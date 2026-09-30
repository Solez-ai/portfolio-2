import { Download, Linkedin, Mail } from "lucide-react";
import { FaGithub, FaXTwitter, FaInstagram } from "react-icons/fa6";

const RESUME = "https://drive.google.com/file/d/19R008pQKPVudWaSHJMHDOymkIu571LFM/view?usp=sharing";

const Btn = ({ children, href = "#", label }: { children: React.ReactNode; href?: string; label?: string }) => (
  <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="cursor-hover group inline-flex items-center gap-2 border border-border rounded-md px-3 py-1.5 text-sm hover:bg-foreground hover:text-background hover:-translate-y-0.5 transition-all">
    <span className="group-hover:animate-pixel-pop inline-flex items-center gap-2">{children}</span>
  </a>
);

export function LetsConnect() {
  return (
    <div className="section-card section-card-hover text-center animate-fade-up">
      <h2 className="text-2xl font-bold">Let&apos;s Connect</h2>
      <p className="text-muted-foreground mt-1">Feel free to reach out through any of these platforms</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Btn href="https://x.com/Solez_None" label="Follow Samin Yeasar on X (formerly Twitter) — opens in new tab"><FaXTwitter className="w-4 h-4" aria-hidden="true" /> Twitter</Btn>
        <Btn href="https://github.com/Solez-ai" label="View Samin Yeasar's GitHub profile — opens in new tab"><FaGithub className="w-4 h-4" aria-hidden="true" /> GitHub</Btn>
        <Btn href="https://www.linkedin.com/in/solez-ai/" label="Connect with Samin Yeasar on LinkedIn — opens in new tab"><Linkedin className="w-4 h-4" aria-hidden="true" /> LinkedIn</Btn>
        <Btn href="https://www.instagram.com/solez.ai" label="Follow Samin Yeasar on Instagram — opens in new tab"><FaInstagram className="w-4 h-4" aria-hidden="true" /> Instagram</Btn>
        <Btn href="mailto:sheditzofficial918@gmail.com" label="Send an email to Samin Yeasar"><Mail className="w-4 h-4" aria-hidden="true" /> Email</Btn>
        <Btn href={RESUME} label="Download Samin Yeasar's resume — opens in new tab"><Download className="w-4 h-4" aria-hidden="true" /> Resume</Btn>
      </div>
    </div>
  );
}
