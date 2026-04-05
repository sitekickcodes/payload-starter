import { getPayload } from "payload";
import config from "@payload-config";
import { sendFormNotification, contactNotificationHtml } from "@/lib/email";
import { checkBotId } from "botid/server";
import { rateLimit } from "@/lib/rate-limit";

interface ContactBody {
  name?: string;
  email?: string;
  inquiry?: string;
  message?: string;
  _hp_name?: string; // honeypot
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // Rate limit: 5 submissions per minute per IP
    const { limited } = rateLimit(`contact:${ip}`, 5, 60_000);
    if (limited) {
      return Response.json(
        { error: "Too many submissions. Please try again in a minute." },
        { status: 429 },
      );
    }

    // Bot detection
    const botIdResult = await checkBotId();
    if (botIdResult.isBot) {
      return Response.json(
        { error: "Verification failed. Please refresh and try again." },
        { status: 403 },
      );
    }

    const { name, email, inquiry, message, _hp_name } =
      (await request.json()) as ContactBody;

    // Honeypot check — if the hidden field has a value, it's a bot
    if (_hp_name) {
      // Return success to not tip off the bot
      return Response.json({ ok: true });
    }

    if (!name || name.trim().length < 2) {
      return Response.json(
        { error: "Please enter your name." },
        { status: 400 },
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (!message || message.trim().length < 10) {
      return Response.json(
        { error: "Please enter a message (at least 10 characters)." },
        { status: 400 },
      );
    }

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    const inquiryType = inquiry || "general";

    const payload = await getPayload({ config });

    await payload.create({
      collection: "contact-submissions",
      data: {
        name: trimmedName,
        email,
        inquiry: inquiryType,
        message: trimmedMessage,
      },
    });

    sendFormNotification({
      subject: `New Contact Form: ${trimmedName}`,
      html: contactNotificationHtml({
        name: trimmedName,
        email,
        inquiry: inquiryType,
        message: trimmedMessage,
      }),
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
