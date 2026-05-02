import { NextResponse, type NextRequest } from "next/server";

// Serve the IndexNow ownership file at /<KEY>.txt without persisting the key
// to disk — the key only ever lives in the env var.
export function proxy(req: NextRequest) {
  const key = process.env.INDEXNOW_KEY;
  if (key && req.nextUrl.pathname === `/${key}.txt`) {
    return new NextResponse(key, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }
  return NextResponse.next();
}

export const config = {
  // Only match top-level *.txt requests so we don't pay middleware cost on every page
  matcher: "/:key([a-fA-F0-9]{32}).txt",
};
