import tls from "node:tls";
import type { SslInfo } from "../types";

const TIMEOUT_MS = 8000;

export async function getCertInfo(domain: string): Promise<SslInfo> {
  return new Promise<SslInfo>((resolve) => {
    const socket = tls.connect(
      {
        host: domain,
        port: 443,
        servername: domain,
        rejectUnauthorized: false,
        ALPNProtocols: ["h2", "http/1.1"],
      },
      () => {
        const cert = socket.getPeerCertificate(false);
        const protocol = socket.getProtocol();
        if (!cert || Object.keys(cert).length === 0) {
          socket.end();
          resolve(null);
          return;
        }
        const validFrom = cert.valid_from ? new Date(cert.valid_from) : null;
        const validTo = cert.valid_to ? new Date(cert.valid_to) : null;
        const now = new Date();
        const valid = !!validTo && validTo > now && !!validFrom && validFrom <= now;
        const daysRemaining = validTo
          ? Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          : null;
        const issuer =
          cert.issuer && typeof cert.issuer === "object"
            ? (cert.issuer as { O?: string; CN?: string }).O ??
              (cert.issuer as { CN?: string }).CN ??
              null
            : null;
        const subject =
          cert.subject && typeof cert.subject === "object"
            ? (cert.subject as { CN?: string }).CN ?? null
            : null;
        socket.end();
        resolve({
          valid,
          issuer,
          subject,
          validFrom: validFrom?.toISOString() ?? null,
          validTo: validTo?.toISOString() ?? null,
          daysRemaining,
          protocol,
        });
      },
    );
    const timer = setTimeout(() => {
      socket.destroy();
      resolve(null);
    }, TIMEOUT_MS);
    socket.on("error", () => {
      clearTimeout(timer);
      resolve(null);
    });
    socket.on("close", () => {
      clearTimeout(timer);
    });
  });
}
