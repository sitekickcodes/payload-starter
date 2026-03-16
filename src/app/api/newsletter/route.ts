import { getPayload } from "payload";
import config from "@payload-config";

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };

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
