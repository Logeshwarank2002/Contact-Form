import prisma from "../db.server";
import { cors } from 'remix-utils';
export async function options({ request }) {
  // Respond to preflight requests
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*", // allow all Shopify stores (use specific origin in production)
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
// GET CALL
export async function loader({ request }) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const accessToken = url.searchParams.get("accessToken");

  if (!shop || !accessToken) {
    return new Response(
      JSON.stringify({ error: "Shop or accessToken missing" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const session = await prisma.session.findFirst({
    where: { shop, accessToken },
  });

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const contacts = await prisma.contactForm.findMany({
    where: { shop },
    orderBy: { id: "desc" },
  });

  return new Response(JSON.stringify(contacts), {
    headers: { "Content-Type": "application/json" },
  });
}

// POST CALL
export async function action({ request }) {
  const body = await request.json();

  const saved = await prisma.contactForm.create({
    data: {
      name: body.name,
      email: body.email,
      phoneNumber: body.phoneNumber,
      shop: body.shop, 
    },
  });

return cors(
    request,
    new Response(JSON.stringify(saved), {
      headers: { "Content-Type": "application/json" },
    })
  );
}