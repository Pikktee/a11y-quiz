"use client";

import { useState } from "react";
import { Share2, Check, ExternalLink } from "lucide-react";
import { t, type Locale } from "@/lib/i18n";

type Props = { score: number; total: number; url: string; lang: Locale };

export default function ShareButtons({ score, total, url, lang }: Props) {
  const [copied, setCopied] = useState(false);
  const labels = t[lang];
  const shareText = labels.shareText(score, total);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Auf X (Twitter) teilen (öffnet neues Fenster)"
      >
        <ExternalLink size={15} aria-hidden="true" />
        X / Twitter
      </a>

      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Auf LinkedIn teilen (öffnet neues Fenster)"
      >
        <ExternalLink size={15} aria-hidden="true" />
        LinkedIn
      </a>

      <button
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-live="polite"
        aria-label={copied ? labels.linkCopied : labels.copyLink}
      >
        {copied ? (
          <Check size={15} aria-hidden="true" className="text-success" />
        ) : (
          <Share2 size={15} aria-hidden="true" />
        )}
        {copied ? labels.linkCopied : labels.copyLink}
      </button>
    </div>
  );
}
