import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  title: string;
  /** Path like /adoptions — the full URL is built from the current origin */
  path?: string;
  className?: string;
}

const ShareButtons = ({ title, path, className = "" }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const url = path ? `${window.location.origin}${path}` : window.location.href;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Link copied! 🐾", description: "Share it with your clowder!" });
    } catch {
      toast({ title: "Couldn't copy", description: "Please copy the URL from the address bar.", variant: "destructive" });
    }
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`,
      color: "hover:bg-[#25D366]/15 hover:text-[#128C4A]",
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: "hover:bg-[#229ED9]/15 hover:text-[#229ED9]",
    },
  ];

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="text-xs text-muted-foreground mr-1">Share:</span>
      {shareLinks.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${s.name}`}
          className={`px-2 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold transition-colors ${s.color}`}
        >
          {s.name}
        </a>
      ))}
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="p-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-primary/10 transition-colors"
        title="Copy link"
      >
        {copied ? <Check size={14} /> : <Link2 size={14} />}
      </button>
    </div>
  );
};

export default ShareButtons;
