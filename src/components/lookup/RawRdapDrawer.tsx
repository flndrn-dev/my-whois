"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Code2, X } from "@/components/ui/icons";

export function RawRdapDrawer({ raw }: { raw: unknown }) {
  if (raw == null) return null;
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <Code2 className="size-4" />
          View raw RDAP / WHOIS
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-background border-l border-border flex flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <Dialog.Title className="font-medium">
              Raw registry response
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="size-8 inline-flex items-center justify-center rounded-md hover:bg-surface"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-auto px-5 py-4">
            <pre className="font-mono text-xs whitespace-pre-wrap break-all">
              {typeof raw === "string"
                ? raw
                : JSON.stringify(raw, null, 2)}
            </pre>
          </div>
          <p className="text-xs text-muted border-t border-border px-5 py-3">
            Emails and IP addresses are redacted server-side before leaving
            our infrastructure.
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
