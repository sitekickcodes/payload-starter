import { getPayload } from "payload";
import config from "@payload-config";
import { sendFormNotification, contactNotificationHtml } from "@/lib/email";

interface ContactBody {
  name?: string;
  email?: string;
  inquiry?: string;
  message?: string;
}

export async function POST(request: Request) {
  try {
    const { name, email, inquiry, message } = (await request.json()) as ContactBody;

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
