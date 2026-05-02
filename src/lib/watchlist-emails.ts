// HTML email templates for the watchlist flow. Inline CSS only — no
// stylesheets, no <style> blocks — to maximise rendering compatibility
// across Gmail, Outlook, Apple Mail, and the long tail of MUAs.

const BRAND = {
  bg: "#2b283a",
  surface: "#373449",
  fg: "#f7f7f7",
  muted: "#b7b7b7",
  border: "#3F3D52",
  accent: "#f5c842",
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-whois.com";

function shell(innerHtml: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:${BRAND.bg};font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:${BRAND.fg};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:${BRAND.bg};">
        <tr><td style="padding:0 0 24px;">
          <a href="${SITE_URL}" style="text-decoration:none;color:${BRAND.fg};font-size:18px;font-weight:700;">
            <span style="color:${BRAND.accent};margin-right:8px;">◆</span>my whois
          </a>
        </td></tr>
        ${innerHtml}
        <tr><td style="padding:32px 0 0;border-top:1px solid ${BRAND.border};">
          <p style="color:${BRAND.muted};font-size:12px;line-height:1.5;margin:24px 0 0;">
            You're getting this because you added a domain to my whois&rsquo;s expiry watchlist.
            Reply to this email to unsubscribe and we&rsquo;ll remove you from the audience.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function confirmationEmailHtml(args: {
  domain: string;
  expirationDate: string | null;
  daysRemaining: number | null;
}): string {
  const expiry =
    args.expirationDate && args.daysRemaining != null
      ? `<p style="font-size:16px;line-height:1.5;color:${BRAND.fg};margin:0 0 16px;">
            <strong style="color:${BRAND.accent};">${args.domain}</strong> currently expires on
            <strong>${new Date(args.expirationDate).toUTCString().split(" ").slice(0, 4).join(" ")}</strong>
            (${args.daysRemaining} days from now).
        </p>`
      : `<p style="font-size:16px;line-height:1.5;color:${BRAND.fg};margin:0 0 16px;">
            We&rsquo;re tracking <strong style="color:${BRAND.accent};">${args.domain}</strong>. The expiry date wasn&rsquo;t in the public record yet, but we&rsquo;ll keep checking and let you know once it surfaces.
        </p>`;
  return shell(`
    <tr><td>
      <h1 style="font-size:24px;font-weight:700;line-height:1.2;margin:0 0 16px;color:${BRAND.fg};">
        You&rsquo;re on the watchlist for ${args.domain}.
      </h1>
      ${expiry}
      <p style="font-size:14px;line-height:1.6;color:${BRAND.muted};margin:0 0 16px;">
        We&rsquo;ll email you 30, 14, and 7 days before the registration expires. If
        the domain renews early or transfers, the alerts pause automatically.
      </p>
      <p style="margin:32px 0;">
        <a href="${SITE_URL}/${args.domain}" style="display:inline-block;background:${BRAND.accent};color:${BRAND.bg};padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
          See the full lookup for ${args.domain}
        </a>
      </p>
    </td></tr>
  `);
}

export function expiryAlertHtml(args: {
  domain: string;
  expirationDate: string;
  daysRemaining: number;
}): string {
  const formatted = new Date(args.expirationDate)
    .toUTCString()
    .split(" ")
    .slice(0, 4)
    .join(" ");
  const tone =
    args.daysRemaining <= 7
      ? "<strong>final reminder</strong>"
      : args.daysRemaining <= 14
        ? "two-week heads-up"
        : "30-day heads-up";
  return shell(`
    <tr><td>
      <h1 style="font-size:24px;font-weight:700;line-height:1.2;margin:0 0 16px;color:${BRAND.fg};">
        ${args.domain} expires in ${args.daysRemaining} days.
      </h1>
      <p style="font-size:16px;line-height:1.5;color:${BRAND.fg};margin:0 0 12px;">
        This is your ${tone}. The registration is set to expire on
        <strong>${formatted}</strong>.
      </p>
      <p style="font-size:14px;line-height:1.6;color:${BRAND.muted};margin:0 0 24px;">
        Renew through your registrar to keep ownership. If the domain has already
        been renewed, ignore this email — the next watchlist check will pick up
        the new expiry date and the alerts will pause.
      </p>
      <p style="margin:24px 0;">
        <a href="${SITE_URL}/${args.domain}" style="display:inline-block;background:${BRAND.accent};color:${BRAND.bg};padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
          See the current record for ${args.domain}
        </a>
      </p>
    </td></tr>
  `);
}
