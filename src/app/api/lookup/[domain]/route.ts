import { NextResponse } from "next/server";
import { lookupDomain, DomainNotFoundError, DomainLookupError } from "@/lib/lookup";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ domain: string }> },
) {
  const { domain: raw } = await params;
  try {
    const snapshot = await lookupDomain(decodeURIComponent(raw));
    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=3600",
      },
    });
  } catch (err) {
    if (err instanceof DomainNotFoundError) {
      return NextResponse.json(
        { error: "domain_not_found", domain: raw },
        { status: 404 },
      );
    }
    if (err instanceof DomainLookupError) {
      return NextResponse.json(
        { error: "invalid_domain", domain: raw },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "lookup_failed", message: (err as Error).message },
      { status: 502 },
    );
  }
}
