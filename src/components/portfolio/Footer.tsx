export function Footer() {
  return (
    <footer className="pt-10 pb-6 space-y-6 animate-fade-up">
      <p className="text-center italic text-muted-foreground hover:text-foreground transition-colors">&quot;Nothing Is Perfect — But You Can Make It Better.&quot;</p>
      <div className="text-center text-xs text-muted-foreground/60 font-mono space-y-1">
        <p>
          <span className="text-accent-green">SOLEZ</span> · <span className="text-accent-blue">Solez-ai</span> · <span className="text-accent-pink">solez.ai</span> · <span className="text-accent-green">SOLEZ-AI</span>
        </p>
        <p className="pt-2 text-xs pixel-font text-muted-foreground text-base">
          2026. All rights reserved
        </p>
      </div>
    </footer>
  );
}
