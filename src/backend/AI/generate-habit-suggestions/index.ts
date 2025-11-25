import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { currentName, category, autocomplete } = await req.json();
    const XAI_API_KEY = Deno.env.get("XAI_API_KEY");

    if (!XAI_API_KEY) {
      throw new Error("XAI_API_KEY is not configured");
    }

    console.log("Generating habit suggestions for:", { currentName, category, autocomplete });

    // ──────────── AUTOCOMPLETE MODE ────────────
    if (autocomplete) {
      if (!currentName || currentName.length < 2) {
        return new Response(JSON.stringify({ suggestions: [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const systemPrompt = `You are a helpful assistant that suggests habit names based on partial user input. 
Generate 3-5 relevant, specific habit suggestions that complete or expand on what the user is typing.
Make suggestions practical, actionable, and varied.

Return ONLY valid JSON in this exact format:
{
  "suggestions": [
    {"name": "Habit Name", "description": "Brief description"}
  ]
}`;

      const userPrompt = `User is typing: "${currentName}"${
        category ? ` in category: ${category}` : ""
      }
Generate 3-5 relevant habit name completions with brief descriptions.`;


      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${XAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "grok-2-latest",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded", suggestions: [] }),
            {
              status: 429,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "Credits exhausted", suggestions: [] }),
            {
              status: 402,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
        throw new Error(`xAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return new Response(JSON.stringify({ suggestions: [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ──────────── IMPROVE MODE ────────────
    const systemPrompt = `You are a habit formation expert who helps people create effective, motivating habit names and descriptions.

Your task is to take a basic habit name and improve it to be:
- Clear and specific
- Motivating and positive
- Action-oriented
- Concise (3–6 words max)

The description should:
- Explain the benefits
- Be inspiring and encouraging
- Be 1–2 sentences max
- Connect to personal growth or wellbeing`;

    const userPrompt = `Improve this habit:
Current name: "${currentName || "New Habit"}"
Category: ${category || "general"}

Respond with ONLY a JSON object in this exact format (no markdown, no extra text):
{"name": "improved habit name", "description": "motivating description"}`;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${XAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-2-latest",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("xAI API error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again soon." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      throw new Error(`xAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format from AI");

    const suggestions = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(suggestions), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-habit-suggestions:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to generate suggestions",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
