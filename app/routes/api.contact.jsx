import prisma from "../db.server";
import { cors } from 'remix-utils/cors';

// ...existing code...
const CORS_OPTIONS = {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  credentials: false,
  allowedHeaders: ["Content-Type", "Authorization"],
};

function sanitizeString(s, maxLen = 2000) {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, maxLen);
}

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  if (!phone) return true;
  return typeof phone === "string" && /^[+\d\-\s\(\)]{6,20}$/.test(phone);
}
// ...existing code...

export async function loader({ request }) {
  // handle preflight
  if (request.method === "OPTIONS") {
    return cors(request, new Response(null, { status: 204 }), CORS_OPTIONS);
  }

  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const accessToken = url.searchParams.get("accessToken");

  if (!shop || !accessToken) {
    return cors(
      request,
      new Response(JSON.stringify({ error: "Shop or accessToken missing" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
      CORS_OPTIONS
    );
  }

  const session = await prisma.session.findFirst({
    where: { shop, accessToken },
  });

  if (!session) {
    return cors(
      request,
      new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
      CORS_OPTIONS
    );
  }

  const contacts = await prisma.contactForm.findMany({
    where: { shop },
    orderBy: { submittedAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return cors(
    request,
    new Response(JSON.stringify({ message: "Success", data: contacts }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
    CORS_OPTIONS
  );
}

export async function action({ request }) {
  if (request.method === "OPTIONS") {
    return cors(request, new Response(null, { status: 204 }), CORS_OPTIONS);
  }

  if (request.method !== "POST") {
    return cors(
      request,
      new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      }),
      CORS_OPTIONS
    );
  }

  try {
    const data = await request.json();

    // Basic sanitization + normalization
    const name = sanitizeString(data.name || "");
    const phoneNumber = sanitizeString(data.phoneNumber || data.phone || "");
    const email = (data.email || "").trim().toLowerCase();
    const shop = sanitizeString(data.shop || "");
    const messageContent = sanitizeString(data.body || data.message || "");

    // Validation
    if (!name || !email || !shop) {
      return cors(
        request,
        new Response(JSON.stringify({ error: "Missing required fields: name, email, shop" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }),
        CORS_OPTIONS
      );
    }

    if (!isValidEmail(email)) {
      return cors(
        request,
        new Response(JSON.stringify({ error: "Invalid email format" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }),
        CORS_OPTIONS
      );
    }

    if (!isValidPhone(phoneNumber)) {
      return cors(
        request,
        new Response(JSON.stringify({ error: "Invalid phone number format" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }),
        CORS_OPTIONS
      );
    }

    // If contact with same shop + email + phone exists -> append Message
    const existing = await prisma.contactForm.findFirst({
      where: {
        shop,
        email,
        phoneNumber,
      },
    });

    if (existing) {
      if (!messageContent) {
        // Nothing to append
        return cors(
          request,
          new Response(JSON.stringify({ message: "Contact exists; no message provided", contactId: existing.id }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
          CORS_OPTIONS
        );
      }

      const newMessage = await prisma.message.create({
        data: {
          content: messageContent,
          contactId: existing.id,
        },
      });

      return cors(
        request,
        new Response(
          JSON.stringify({
            message: "Appended message to existing contact",
            contactId: existing.id,
            message: { id: newMessage.id, createdAt: newMessage.createdAt },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        ),
        CORS_OPTIONS
      );
    }

    // Create new contact with initial message if provided
    const saved = await prisma.contactForm.create({
      data: {
        shop,
        name,
        phoneNumber,
        email,
        messages: messageContent
          ? {
              create: {
                content: messageContent,
              },
            }
          : undefined,
      },
      include: {
        messages: true,
      },
    });

    return cors(
      request,
      new Response(JSON.stringify({ message: "Created", data: saved }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }),
      CORS_OPTIONS
    );
  } catch (error) {
    console.error("api.contact error:", error);
    return cors(
      request,
      new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
      CORS_OPTIONS
    );
  }
}
// ...existing code...