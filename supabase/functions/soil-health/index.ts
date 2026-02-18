import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { soilData, crop, lang } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = lang === "bn"
      ? `আপনি একজন মাটি বিশেষজ্ঞ কৃষি পরামর্শদাতা। মাটি পরীক্ষার ফলাফল বিশ্লেষণ করে সার সুপারিশ ও পুষ্টি ঘাটতি সতর্কতা দিন।`
      : `You are a soil science expert agricultural advisor. Analyze soil test results and provide fertilizer recommendations and nutrient deficiency alerts.`;

    const userPrompt = lang === "bn"
      ? `মাটি পরীক্ষার ফলাফল: pH: ${soilData.ph}, নাইট্রোজেন: ${soilData.nitrogen} kg/ha, ফসফরাস: ${soilData.phosphorus} kg/ha, পটাশিয়াম: ${soilData.potassium} kg/ha, জৈব পদার্থ: ${soilData.organicMatter}%, ফসল: ${crop}`
      : `Soil test results: pH: ${soilData.ph}, Nitrogen: ${soilData.nitrogen} kg/ha, Phosphorus: ${soilData.phosphorus} kg/ha, Potassium: ${soilData.potassium} kg/ha, Organic Matter: ${soilData.organicMatter}%, Crop: ${crop}`;

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
              name: "soil_analysis",
              description: "Return soil health analysis and recommendations",
              parameters: {
                type: "object",
                properties: {
                  overall_health: { type: "string", enum: ["poor", "moderate", "good", "excellent"] },
                  ph_status: { type: "string" },
                  ph_status_bn: { type: "string" },
                  deficiencies: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        nutrient: { type: "string" },
                        nutrient_bn: { type: "string" },
                        level: { type: "string", enum: ["low", "adequate", "high"] },
                        recommendation: { type: "string" },
                        recommendation_bn: { type: "string" }
                      },
                      required: ["nutrient", "nutrient_bn", "level", "recommendation", "recommendation_bn"],
                      additionalProperties: false
                    }
                  },
                  fertilizer_plan: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        fertilizer: { type: "string" },
                        fertilizer_bn: { type: "string" },
                        amount: { type: "string" },
                        timing: { type: "string" },
                        timing_bn: { type: "string" }
                      },
                      required: ["fertilizer", "fertilizer_bn", "amount", "timing", "timing_bn"],
                      additionalProperties: false
                    }
                  },
                  tips: { type: "array", items: { type: "string" } },
                  tips_bn: { type: "array", items: { type: "string" } }
                },
                required: ["overall_health", "ph_status", "ph_status_bn", "deficiencies", "fertilizer_plan", "tips", "tips_bn"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "soil_analysis" } }
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
    let analysis;
    if (toolCall) {
      analysis = JSON.parse(toolCall.function.arguments);
    } else {
      const content = data.choices?.[0]?.message?.content || "";
      analysis = { raw_advice: content };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("soil-health error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
