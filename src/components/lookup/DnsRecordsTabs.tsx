"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { DnsRecords } from "@/lib/types";

function RecordList({ items }: { items: string[] }) {
  if (items.length === 0)
    return <p className="text-[var(--color-muted)] text-sm">No records.</p>;
  return (
    <ul className="font-mono text-sm space-y-0.5 break-all">
      {items.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  );
}

export function DnsRecordsTabs({ dns }: { dns: DnsRecords }) {
  const mxLines = dns.mx.map((m) => `${m.priority}\t${m.exchange}`);
  const tabs: { key: string; label: string; items: string[] }[] = [
    { key: "a", label: "A", items: dns.a },
    { key: "aaaa", label: "AAAA", items: dns.aaaa },
    { key: "mx", label: "MX", items: mxLines },
    { key: "ns", label: "NS", items: dns.ns },
    { key: "txt", label: "TXT", items: dns.txt },
    { key: "cname", label: "CNAME", items: dns.cname },
  ];
  return (
    <div className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-surface)]/40">
      <h3 className="text-sm uppercase tracking-wide text-[var(--color-muted)] mb-3">
        DNS records
      </h3>
      <Tabs defaultValue="a">
        <TabsList>
          {tabs.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>
              {t.label}
              <span className="ml-1.5 text-[var(--color-muted)] text-xs">
                {t.items.length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((t) => (
          <TabsContent key={t.key} value={t.key}>
            <RecordList items={t.items} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
