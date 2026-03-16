"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm({ stacked = false }: { stacked?: boolean } = {}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          _hp_name: (e.target as HTMLFormElement).querySelector<HTMLInputElement>("[name=_hp_name]")?.value,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong.");
        return;
      }

      setStatus("success");
      track("newsletter_signup");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isExpanded = status === "success";

  if (stacked) {
    return (
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <input type="text" name="_hp_name" tabIndex={-1} autoComplete="off" />
        </div>
        {status === "success" ? (
          <div
            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            aria-live="polite"
          >
            <Check className="size-4 shrink-0" aria-hidden />
            <span>You&apos;re subscribed</span>
          </div>
        ) : (
          <>
            <div className="relative flex min-h-10 w-full items-stretch overflow-hidden rounded-full border border-input bg-background transition-[box-shadow] duration-300 ease-in-out focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 focus-within:ring-offset-2 focus-within:ring-offset-background">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 w-full min-w-0 rounded-none border-0 bg-transparent px-4 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button
              type="submit"
              size="default"
              className="w-full rounded-full"
              disabled={isSubmitting}
            >
              Subscribe
            </Button>
          </>
        )}
        {status === "error" && (
          <p className="body-sm text-destructive">{errorMsg}</p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3">
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" name="_hp_name" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="relative flex min-h-12 w-full items-stretch overflow-hidden rounded-full border border-input bg-background transition-[box-shadow] duration-300 ease-in-out focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 focus-within:ring-offset-2 focus-within:ring-offset-background">
        <div
          className={`flex min-w-0 overflow-hidden transition-[flex,opacity] duration-400 ease-in-out ${isExpanded ? "flex-0 opacity-0" : "flex-1"}`}
        >
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isExpanded}
            aria-hidden={isExpanded}
            className="h-12 w-full min-w-0 rounded-none border-0 bg-transparent px-5 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div
          className={`flex shrink-0 items-stretch py-1.5 pr-1.5 transition-[flex,padding] duration-400 ease-in-out ${isExpanded ? "flex-1 min-w-0 pl-1.5" : ""}`}
        >
          {status === "success" ? (
            <div
              className="flex h-full w-full min-w-0 items-center justify-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
              aria-live="polite"
            >
              <Check className="size-4 shrink-0" aria-hidden />
              <span>You&apos;re subscribed</span>
            </div>
          ) : (
            <Button
              type="submit"
              size="sm"
              className="h-full w-full min-w-0 rounded-full px-5"
              disabled={isSubmitting}
            >
              Subscribe
            </Button>
          )}
        </div>
      </div>
      {status === "error" && (
        <p className="body-sm text-destructive">{errorMsg}</p>
      )}
    </form>
  );
}
