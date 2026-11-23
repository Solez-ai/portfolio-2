import { useEffect, useState } from "react";
import { MapPin, Clock, QrCode, ExternalLink, BadgeCheck } from "lucide-react";
import avatarImg from "@/assets/avatar.jpg";
import qrImg from "@/assets/qr.png";

export function Header() {
  const [time, setTime] = useState("");
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Dhaka",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setTime(new Intl.DateTimeFormat("en-US", opts).format(d));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6 animate-fade-up">
      <button
        onClick={() => setFlipped((f) => !f)}
        className="relative shrink-0 h-24 w-24 md:h-28 md:w-28 rounded-2xl overflow-hidden border border-border group tilt cursor-hover"
        style={{ perspective: "800px" }}
        aria-label={flipped ? "Show profile photo" : "Show QR code"}
      >
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "none" }}
        >
          <img
            src={avatarImg}
            alt="Portrait of Samin Yeasar, Full Stack Developer"
            width={512}
            height={512}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ backfaceVisibility: "hidden" }}
          />
          <img
            src={qrImg}
            alt="QR code to Samin Yeasar's portfolio and contact information"
            width={512}
            height={512}
            className="absolute inset-0 w-full h-full object-cover bg-white p-2"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          />
        </div>
        <span
          className="absolute top-1.5 right-1.5 bg-background/80 backdrop-blur rounded-md p-1 border border-border z-10 group-hover:bg-foreground group-hover:text-background transition-colors"
          aria-hidden="true"
        >
          <QrCode className="w-3.5 h-3.5" />
        </span>
        <span className="absolute inset-0 ring-0 group-hover:ring-2 ring-accent-green/40 rounded-2xl transition-all pointer-events-none" />
      </button>

      <div className="flex flex-col flex-1 min-w-0">
        <h1 className="text-2xl md:text-3xl font-bold leading-tight animate-glitch">
          Samin Yeasar — Full Stack Developer &amp; Founder{" "}
          <BadgeCheck
            className="inline-block w-6 h-6 text-accent-blue animate-float align-text-bottom"
            aria-label="Verified profile"
          />
        </h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          @solez-ai<span className="animate-blink">_</span>
        </p>
        <a
          href="https://mentormind.bd"
          target="_blank"
          rel="noreferrer"
          className="mt-2 self-start inline-flex items-center gap-1.5 font-semibold underline underline-offset-4 decoration-border hover:decoration-accent-green hover:text-accent-green transition-colors cursor-hover"
          aria-label="Building mentormind.bd — opens in new tab"
        >
          Building mentormind.bd <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-4 h-4" aria-hidden="true" /> Bangladesh
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 font-mono tabular-nums">
            <Clock className="w-4 h-4" aria-hidden="true" /> {time}
          </span>
        </div>
      </div>
    </div>
  );
}
