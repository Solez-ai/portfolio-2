import type { ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="relative -mb-3 ml-4 inline-block w-fit bg-background px-3 py-1 font-mono text-xs text-foreground border border-dashed border-border rounded">
      {children}
    </div>
  );
}

export function SectionCard({ label, children, className = "" }: { label?: string; children: ReactNode; className?: string }) {
  return (
    <div className={"relative " + className}>
      {label && <SectionLabel>{label}</SectionLabel>}
      <div className="section-card">{children}</div>
    </div>
  );
}
