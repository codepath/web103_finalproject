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
    const { messages } = await req.json();
    const XAI_API_KEY = Deno.env.get('XAI_API_KEY');

    if (!XAI_API_KEY) {
      throw new Error('XAI_API_KEY not configured');
    }

    console.log('Calling xAI API with messages:', messages);

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
            content: 'You are a supportive AI Habit Coach. Help users build better habits with personalized advice, step-by-step routines, and encouragement. Be empathetic, practical, and motivating. Provide specific, actionable guidance for habit formation and breaking bad habits.'
          },
          ...messages
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
    console.log('xAI API response received');

    return new Response(JSON.stringify({ 
      message: data.choices[0].message.content 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in habit-coach function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
