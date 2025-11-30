import prisma from "../db.server";
export async function loader({ request }) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return new Response(JSON.stringify({ error: "Shop is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  const session = await prisma.session.findFirst({
    where: { shop },
  });

  if (!session) {
    return new Response(JSON.stringify({ error: "Session not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ accessToken: session.accessToken }), {
    headers: { "Content-Type": "application/json" },
  });
}