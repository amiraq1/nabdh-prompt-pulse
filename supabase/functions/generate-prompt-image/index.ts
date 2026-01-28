import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_PROMPT_LENGTH = 400;

const escapeXml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return char;
    }
  });

const wrapText = (text: string, maxChars = 32, maxLines = 3) => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars) {
      if (current) lines.push(current);
      current = word;
      if (lines.length >= maxLines) break;
    } else {
      current = next;
    }
  }

  if (lines.length < maxLines && current) {
    lines.push(current);
  }

  return lines.slice(0, maxLines);
};

const buildPlaceholderSvg = (prompt: string) => {
  const trimmed = prompt.slice(0, MAX_PROMPT_LENGTH);
  const safeText = escapeXml(trimmed);
  const lines = wrapText(safeText, 30, 3);
  const tspans = lines
    .map((line, index) => `<tspan x="50%" dy="${index === 0 ? "0" : "1.4em"}">${line}</tspan>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#g)" />
  <rect x="72" y="72" width="880" height="880" rx="48" fill="rgba(15,23,42,0.55)" stroke="rgba(255,255,255,0.08)" />
  <text x="50%" y="50%" text-anchor="middle" fill="#f8fafc" font-size="36" font-family="'Inter', 'Segoe UI', system-ui, sans-serif" font-weight="600">
    ${tspans}
  </text>
  <text x="50%" y="92%" text-anchor="middle" fill="rgba(226,232,240,0.6)" font-size="16" font-family="'Inter', 'Segoe UI', system-ui, sans-serif">
    Generated placeholder
  </text>
</svg>`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const template = Deno.env.get("IMAGE_PROVIDER_URL")?.trim();
    const encodedPrompt = encodeURIComponent(prompt.slice(0, MAX_PROMPT_LENGTH));

    const imageUrl = template
      ? template.includes("{prompt}")
        ? template.split("{prompt}").join(encodedPrompt)
        : `${template}${encodedPrompt}`
      : `data:image/svg+xml;utf8,${encodeURIComponent(buildPlaceholderSvg(prompt))}`;

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
