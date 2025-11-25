import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { habitName, habitCategory, previousStreak } = await req.json();
    const XAI_API_KEY = Deno.env.get('XAI_API_KEY');

    if (!XAI_API_KEY) {
      throw new Error('XAI_API_KEY not configured');
    }

    console.log('Generating recovery plan for habit:', habitName);

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [
          {
            role: 'system',
            content: 'You are a compassionate habit coach helping users recover from breaking a streak. Provide exactly 3 actionable, personalized steps to help them get back on track. Be empathetic, motivating, and specific. Each step should be practical and achievable.'
          },
          {
            role: 'user',
            content: `I just broke my ${previousStreak}-day streak for "${habitName}" (${habitCategory} category). Help me get back on track with a 3-step recovery plan. Make it personal and actionable.`
          }
        ],
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('xAI API error:', response.status, errorText);
      throw new Error(`xAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Recovery plan generated successfully');

    return new Response(JSON.stringify({ 
      recoveryPlan: data.choices[0].message.content 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-recovery-plan function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
