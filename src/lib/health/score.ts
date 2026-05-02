
import type { HealthBreakdownItem, HealthScore } from "../types";

export type HealthInput = {
  ssl: { valid: boolean; daysRemaining: number | null } | null;
  dnssec: boolean;
  spf: boolean;
  dmarc: boolean;
  nameservers: string[];
  expiryDays: number | null;
};

function tier(score: number): HealthScore["tier"] {
  if (score >= 80) return "green";
  if (score >= 60) return "amber";
  return "red";
}

function distinctNs(nameservers: string[]) {
  const uniqueRoots = new Set(
    nameservers.map((ns) => {
      const parts = ns.split(".").slice(-2).join(".");
      return parts;
    }),
  );
  return { count: nameservers.length, uniqueRoots: uniqueRoots.size };
}

export function calculateHealthScore(input: HealthInput): HealthScore {
  const breakdown: HealthBreakdownItem[] = [];

  // SSL valid + 60+ days remaining: 25 pts
  let sslPts = 0;
  let sslStatus: HealthBreakdownItem["status"] = "fail";
  let sslDetail = "No SSL certificate found";
  if (input.ssl) {
    if (input.ssl.valid && (input.ssl.daysRemaining ?? 0) >= 60) {
      sslPts = 25;
      sslStatus = "ok";
      sslDetail = `Valid SSL with ${input.ssl.daysRemaining} days remaining`;
    } else if (input.ssl.valid && (input.ssl.daysRemaining ?? 0) >= 14) {
      sslPts = 15;
      sslStatus = "warn";
      sslDetail = `Valid SSL but expires in ${input.ssl.daysRemaining} days`;
    } else if (input.ssl.valid) {
      sslPts = 5;
      sslStatus = "warn";
      sslDetail = `SSL expires very soon (${input.ssl.daysRemaining ?? 0} days)`;
    } else {
      sslPts = 0;
      sslStatus = "fail";
      sslDetail = "SSL certificate is expired or invalid";
    }
  }
  breakdown.push({
    label: "SSL certificate",
    points: sslPts,
    max: 25,
    status: sslStatus,
    detail: sslDetail,
  });

  // DNSSEC enabled: 15 pts
  breakdown.push({
    label: "DNSSEC",
    points: input.dnssec ? 15 : 0,
    max: 15,
    status: input.dnssec ? "ok" : "fail",
    detail: input.dnssec
      ? "DNSSEC delegation signed"
      : "DNSSEC not enabled — risk of DNS hijacking",
  });

  // SPF record present: 10 pts
  breakdown.push({
    label: "SPF record",
    points: input.spf ? 10 : 0,
    max: 10,
    status: input.spf ? "ok" : "warn",
    detail: input.spf
      ? "SPF record published"
      : "No SPF record — email spoofing risk",
  });

  // DMARC record present: 10 pts
  breakdown.push({
    label: "DMARC record",
    points: input.dmarc ? 10 : 0,
    max: 10,
    status: input.dmarc ? "ok" : "warn",
    detail: input.dmarc
      ? "DMARC policy published"
      : "No DMARC policy — limited spoofing protection",
  });

  // Nameservers >= 2 distinct authoritative: 15 pts
  const ns = distinctNs(input.nameservers);
  let nsPts = 0;
  let nsStatus: HealthBreakdownItem["status"] = "fail";
  let nsDetail = "No nameservers detected";
  if (ns.count >= 2 && ns.uniqueRoots >= 2) {
    nsPts = 15;
    nsStatus = "ok";
    nsDetail = `${ns.count} nameservers across ${ns.uniqueRoots} providers`;
  } else if (ns.count >= 2) {
    nsPts = 10;
    nsStatus = "warn";
    nsDetail = `${ns.count} nameservers, but on a single provider`;
  } else if (ns.count === 1) {
    nsPts = 5;
    nsStatus = "warn";
    nsDetail = "Only one nameserver — no redundancy";
  }
  breakdown.push({
    label: "Nameserver redundancy",
    points: nsPts,
    max: 15,
    status: nsStatus,
    detail: nsDetail,
  });

  // Domain not expiring within 90 days: 25 pts
  let expPts = 0;
  let expStatus: HealthBreakdownItem["status"] = "fail";
  let expDetail = "Expiry date unknown";
  if (input.expiryDays === null) {
    expPts = 10;
    expStatus = "warn";
    expDetail = "Expiry date redacted or unavailable";
  } else if (input.expiryDays >= 90) {
    expPts = 25;
    expStatus = "ok";
    expDetail = `Expires in ${input.expiryDays} days`;
  } else if (input.expiryDays >= 30) {
    expPts = 15;
    expStatus = "warn";
    expDetail = `Expires in ${input.expiryDays} days — renew soon`;
  } else if (input.expiryDays >= 0) {
    expPts = 5;
    expStatus = "fail";
    expDetail = `Expires in ${input.expiryDays} days — urgent`;
  } else {
    expPts = 0;
    expStatus = "fail";
    expDetail = `Expired ${Math.abs(input.expiryDays)} days ago`;
  }
  breakdown.push({
    label: "Expiry runway",
    points: expPts,
    max: 25,
    status: expStatus,
    detail: expDetail,
  });

  const score = breakdown.reduce((sum, b) => sum + b.points, 0);
  return { score, tier: tier(score), breakdown };
}