export const prerender = false;
import type { APIRoute } from "astro";

import Alpaca from "@alpacahq/alpaca-trade-api";
import type { AlpacaBar } from "@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2";

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
  
  const alpaca = new Alpaca({
    keyId: import.meta.env.ALPACA_KEY,
    secretKey: import.meta.env.ALPACA_SECRET,
    // paper: true,
  });

  let bar: AlpacaBar;
  try {
    bar = await alpaca.getLatestBar(symbol.toUpperCase());
    console.log("bar", bar);
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "Error fetching stock data",
      }),
      { status: 500 },
    );
  }

  const open = `$${bar.OpenPrice}`;

  return new Response(
    JSON.stringify({
      open,
    }),
    { status: 200 },
  );
};
