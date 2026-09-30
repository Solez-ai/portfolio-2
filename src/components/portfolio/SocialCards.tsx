import { FaXTwitter, FaInstagram } from "react-icons/fa6";

export function SocialCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up">
      <div className="section-card section-card-hover flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-foreground text-background flex items-center justify-center">
            <FaXTwitter className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold flex items-center gap-1">Samin Yeasar <span className="text-[10px] rounded-full bg-accent-blue text-white w-4 h-4 inline-flex items-center justify-center">✓</span></p>
            <p className="text-xs text-muted-foreground font-mono">@Solez_None · 400+ followers</p>
          </div>
        </div>
        <a href="https://x.com/Solez_None" target="_blank" rel="noreferrer" className="cursor-hover text-sm border border-border rounded-md px-3 py-1.5 hover:bg-foreground hover:text-background transition-all hover:-translate-y-0.5">Follow</a>
      </div>

      <div className="section-card section-card-hover flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md flex items-center justify-center text-white" style={{ background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
            <FaInstagram className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold">Instagram</p>
            <p className="text-xs text-muted-foreground font-mono">@solez.ai · 100+ followers</p>
          </div>
        </div>
        <a href="https://www.instagram.com/solez.ai" target="_blank" rel="noreferrer" className="cursor-hover text-sm rounded-md px-3 py-1.5 text-white transition-all hover:-translate-y-0.5 hover:shadow-lg" style={{ background: "linear-gradient(45deg,#f09433,#dc2743,#bc1888)" }}>Follow</a>
      </div>
    </div>
  );
}
