export const prerender = false;
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  console.log("request", request);
  const data = await request.json();
  console.log("data", data);
  const symbol = data.symbol;
  console.log("symbol", symbol);

  if (!symbol) {
    return new Response(
      JSON.stringify({
        message: "Missing required fields",
      }),
      { status: 400 },
    );
  }

  return new Response(
    JSON.stringify({
      symbol,
    }),
    { status: 200 },
  );
};
