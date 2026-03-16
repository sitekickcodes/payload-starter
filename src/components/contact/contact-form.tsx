"use client";

import { useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { Check } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Turnstile } from "@/components/turnstile";

const INQUIRY_OPTIONS = [
  { value: "general", label: "General Inquiry" },
  { value: "support", label: "Support" },
  { value: "sales", label: "Sales" },
  { value: "partnership", label: "Partnership" },
];

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [inquiry, setInquiry] = useState("general");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const turnstileToken = useRef("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    // Read honeypot from the form
    const form = e.target as HTMLFormElement;
    const honeypot = (form.elements.namedItem("_hp_name") as HTMLInputElement)?.value;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          inquiry,
          message,
          turnstileToken: turnstileToken.current,
          _hp_name: honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }

      setStatus("success");
      track("contact_form_submit", { inquiry_type: inquiry });
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Check className="size-6 text-primary" />
        </div>
        <h3 className="h5 mt-4">Message Sent</h3>
        <p className="body-sm mt-2 text-muted-foreground">
          Thanks for reaching out! We&apos;ll get back to you as soon as we can.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-xl border border-border bg-card p-6 md:p-8"
    >
      <div className="space-y-2">
        <h2 className="h4">Send Us a Message</h2>
        <p className="body-sm text-muted-foreground">
          Fill out the form below and we&apos;ll get back to you.
        </p>
      </div>

      {/* Honeypot — hidden from humans, bots fill it in */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="_hp_name">Leave this empty</label>
        <input type="text" id="_hp_name" name="_hp_name" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-required="true"
            minLength={2}
            aria-describedby={errorMsg ? "form-error" : undefined}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required="true"
          />
        </div>

        {/* Inquiry Type */}
        <div className="space-y-3">
          <Label>What can we help with?</Label>
          <RadioGroup value={inquiry} onValueChange={setInquiry} className="w-auto gap-0">
            {INQUIRY_OPTIONS.map((option) => (
              <label key={option.value} htmlFor={option.value} className="group/radio-row -mx-2 flex w-fit cursor-pointer items-center gap-2 rounded-md px-2 py-1.5">
                <RadioGroupItem value={option.value} id={option.value} />
                <span className="body-sm font-medium leading-none">
                  {option.label}
                </span>
              </label>
            ))}
          </RadioGroup>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Tell us what's on your mind..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            aria-required="true"
            minLength={10}
            rows={5}
          />
        </div>
      </div>

      {errorMsg && (
        <p id="form-error" role="alert" className="body-sm text-destructive">{errorMsg}</p>
      )}

      <Turnstile onVerify={(token) => (turnstileToken.current = token)} />

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
