import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the Cat-verter, a fur-midable AI that transforms ordinary text into cat-themed puns and vocabulary. 

Rules:
- Replace words with cat puns wherever possible (e.g., "perfect" → "purr-fect", "catastrophe" → "cat-astrophe", "forever" → "fur-ever", "feeling" → "fur-eeling", "positive" → "paw-sitive", "terrific" → "purr-ific", "fantastic" → "fur-tastic", "community" → "cat-munity", "formula" → "fur-mula", "attention" → "a-ten-tion with paws", "comfortable" → "com-fur-table")
- Add cat emojis (🐱😸😺🐾😿🙀😻😹😽🐈) throughout
- Keep the original meaning intact while making it as cat-themed as possible
- Use cat vocabulary like: blep, mlem, zoomies, biscuits, toe beans, sploot, loaf, murder mittens, scritches, chonk, floof, teefies, purrito, void, cattitude
- Add cat-related commentary or asides in parentheses when fun
- Be creative and playful but keep readability
- If the text is very short (1-3 words), expand it into a fun cat-themed sentence
- Always respond with ONLY the converted text, no explanations`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Please provide text to cat-vert!" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Cat-vert this text:\n\n${text}` },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests! Even cats need a nap. Try again in a moment. 😿" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to continue cat-verting! 🐱" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("cat-verter error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
