import prisma from "../db.server";
import { cors } from 'remix-utils/cors';

const CORS_OPTIONS = {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  credentials: false,
  allowedHeaders: ["Content-Type", "Authorization"],
};

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
    orderBy: { id: "desc" },
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

    if (!data.name || !data.email || !data.shop) {
      return cors(
        request,
        new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }),
        CORS_OPTIONS
      );
    }

    const saved = await prisma.contactForm.create({
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber || null,
        shop: data.shop,
      },
    });

    return cors(
      request,
      new Response(JSON.stringify({ message: "Success", data: saved }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }),
      CORS_OPTIONS
    );
  } catch (error) {
    return cors(
      request,
      new Response(JSON.stringify({ error: "Server error", details: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
      CORS_OPTIONS
    );
  }
}