import { getPayload } from "payload";
import config from "@payload-config";
import { rateLimit } from "@/lib/rate-limit";

interface NewsletterBody {
  email?: string;
  _hp_name?: string; // honeypot
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // Rate limit: 10 submissions per minute per IP
    const { limited } = rateLimit(`newsletter:${ip}`, 10, 60_000);
    if (limited) {
      return Response.json(
        { error: "Too many submissions. Please try again in a minute." },
        { status: 429 },
      );
    }

    const { email, _hp_name } = (await request.json()) as NewsletterBody;

    // Honeypot check
    if (_hp_name) {
      return Response.json({ ok: true });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const payload = await getPayload({ config });

    await payload.create({
      collection: "newsletter-submissions",
      data: { email },
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
