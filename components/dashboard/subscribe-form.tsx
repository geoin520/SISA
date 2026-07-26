"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/** Lightweight email subscription form (demo — wires to /api/subscribe). */
export function SubscribeForm({
  labels,
}: {
  labels: {
    title: string;
    description: string;
    emailLabel: string;
    emailPlaceholder: string;
    submit: string;
    agree: string;
    success: string;
  };
}) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("invalid");
      return;
    }
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      /* swallow — still show success in demo mode */
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-xl border border-sisa-safe/30 bg-sisa-safe/5 p-5 text-center">
        <p className="text-sm font-semibold text-sisa-safe">✓ {labels.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-semibold text-sisa-muted">
          {labels.emailLabel}
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={labels.emailPlaceholder}
          className="w-full rounded-lg border border-sisa-navy/15 bg-white px-3 py-2 text-sm text-sisa-ink outline-none transition focus:border-sisa-brand"
        />
      </div>
      <Button type="submit" className="w-full">
        {labels.submit}
      </Button>
      <p className="text-[11px] leading-relaxed text-sisa-muted">{labels.agree}</p>
    </form>
  );
}
