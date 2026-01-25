import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts"
import { Readability } from "https://esm.sh/@mozilla/readability@0.4.4"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Private IP Ranges (CIDR) mechanism would go here, 
// using a library like 'ipaddr.js' if available in Deno, 
// or manual checks for 10.x.x.x, 192.168.x.x, 172.16.x.x, 127.x.x.x

function isPrivateIP(hostname: string): boolean {
    // Basic check - in production use a robust library
    if (hostname === 'localhost') return true;
    // IPv4 private ranges regex
    const privateRanges = [
        /^127\./,
        /^10\./,
        /^192\.168\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /^0\./,
        /^169\.254\./
    ];
    return privateRanges.some(regex => regex.test(hostname));
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { url } = await req.json()
        if (!url) throw new Error('URL is required')

        const targetUrl = new URL(url)

        // 1. Protocol Whitelist
        if (!['http:', 'https:'].includes(targetUrl.protocol)) {
            throw new Error('Invalid protocol. Only HTTP/HTTPS allowed.')
        }

        // 2. DNS Rebinding / Hostname Check
        // Note: To fully prevent DNS rebinding, we'd need to resolve DNS -> check IP -> fetch IP directly.
        // Fetch API usually follows DNS. Deno's fetch might cache.
        // For this level, we reject obvious private hostnames.
        if (isPrivateIP(targetUrl.hostname)) {
            throw new Error('Restricted access to internal network.')
        }

        // 3. Fetch with Limits
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000) // 8s timeout

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; NabdhBotSafe/1.0; +https://nabdh.app)',
            },
            signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!res.ok) throw new Error(`External server error: ${res.status}`)

        // 4. Content Type Validation
        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('text/html')) {
            throw new Error('Only HTML content is allowed')
        }

        const html = await res.text()

        // 5. Hard Limit on HTML size
        if (html.length > 5 * 1024 * 1024) { // 5MB
            throw new Error('Page too large')
        }

        const doc = new DOMParser().parseFromString(html, "text/html")
        if (!doc) throw new Error("Parse error")

        const reader = new Readability(doc)
        const article = reader.parse()

        const content = article?.textContent || doc.body.textContent || ""
        const cleanContent = content.replace(/\s+/g, ' ').trim().slice(0, 5000)

        return new Response(
            JSON.stringify({
                title: article?.title || doc.title,
                content: cleanContent,
                siteName: article?.siteName
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
