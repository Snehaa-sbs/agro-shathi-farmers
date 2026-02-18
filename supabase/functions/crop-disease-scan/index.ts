import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, lang } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = lang === "bn"
      ? `আপনি একজন কৃষি বিশেষজ্ঞ। ছবি দেখে ফসলের রোগ বা পোকামাকড় চিহ্নিত করুন। JSON ফরম্যাটে উত্তর দিন।`
      : `You are an agricultural expert. Identify crop diseases or pests from the image. Respond in JSON format.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: lang === "bn"
                  ? "এই ফসলের ছবি বিশ্লেষণ করুন। রোগ/পোকা চিহ্নিত করুন এবং চিকিৎসা পরামর্শ দিন। JSON ফরম্যাটে উত্তর দিন: {\"disease_name\": \"...\", \"disease_name_bn\": \"...\", \"confidence\": 0-100, \"severity\": \"low/medium/high\", \"description\": \"...\", \"description_bn\": \"...\", \"treatment\": [\"...\"], \"treatment_bn\": [\"...\"], \"prevention\": [\"...\"], \"prevention_bn\": [\"...\"]}"
                  : "Analyze this crop image. Identify any disease or pest and provide treatment advice. Respond in JSON: {\"disease_name\": \"...\", \"disease_name_bn\": \"...\", \"confidence\": 0-100, \"severity\": \"low/medium/high\", \"description\": \"...\", \"description_bn\": \"...\", \"treatment\": [\"...\"], \"treatment_bn\": [\"...\"], \"prevention\": [\"...\"], \"prevention_bn\": [\"...\"]}"
              },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
              }
            ]
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "diagnose_crop",
              description: "Return crop disease diagnosis",
              parameters: {
                type: "object",
                properties: {
                  disease_name: { type: "string" },
                  disease_name_bn: { type: "string" },
                  confidence: { type: "number" },
                  severity: { type: "string", enum: ["low", "medium", "high"] },
                  description: { type: "string" },
                  description_bn: { type: "string" },
                  treatment: { type: "array", items: { type: "string" } },
                  treatment_bn: { type: "array", items: { type: "string" } },
                  prevention: { type: "array", items: { type: "string" } },
                  prevention_bn: { type: "array", items: { type: "string" } },
                },
                required: ["disease_name", "disease_name_bn", "confidence", "severity", "description", "description_bn", "treatment", "treatment_bn", "prevention", "prevention_bn"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "diagnose_crop" } }
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limited, try again later" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let diagnosis;
    if (toolCall) {
      diagnosis = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback: try to parse from content
      const content = data.choices?.[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      diagnosis = jsonMatch ? JSON.parse(jsonMatch[0]) : { disease_name: "Unknown", description: content };
    }

    return new Response(JSON.stringify(diagnosis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("crop-disease-scan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
