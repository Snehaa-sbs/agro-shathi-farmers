import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { lang, region } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = lang === "bn"
      ? `আপনি বাংলাদেশের কৃষি বাজার বিশ্লেষক। বর্তমান বাজার দর এবং প্রবণতা বিশ্লেষণ করুন। বাস্তবসম্মত দাম দিন।`
      : `You are a Bangladesh agricultural market analyst. Provide current realistic market prices and trends for major crops in Bangladesh.`;

    const userPrompt = lang === "bn"
      ? `বাংলাদেশের ${region || 'ঢাকা'} অঞ্চলের প্রধান ফসলের বর্তমান বাজার দর দিন। ধান, গম, ভুট্টা, আলু, পেঁয়াজ, টমেটো, বেগুন, মরিচ, এবং পাট অন্তর্ভুক্ত করুন।`
      : `Provide current market prices for major crops in ${region || 'Dhaka'}, Bangladesh. Include Rice, Wheat, Corn, Potato, Onion, Tomato, Eggplant, Chili, and Jute.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "market_prices",
              description: "Return current crop market prices",
              parameters: {
                type: "object",
                properties: {
                  region: { type: "string" },
                  region_bn: { type: "string" },
                  last_updated: { type: "string" },
                  crops: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        name_bn: { type: "string" },
                        price_per_kg: { type: "number" },
                        unit: { type: "string" },
                        trend: { type: "string", enum: ["up", "down", "stable"] },
                        change_percent: { type: "number" }
                      },
                      required: ["name", "name_bn", "price_per_kg", "unit", "trend", "change_percent"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["region", "region_bn", "last_updated", "crops"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "market_prices" } }
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let prices;
    if (toolCall) {
      prices = JSON.parse(toolCall.function.arguments);
    } else {
      const content = data.choices?.[0]?.message?.content || "";
      prices = { raw: content };
    }

    return new Response(JSON.stringify(prices), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("market-prices error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
