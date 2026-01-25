import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts"
import { Readability } from "https://esm.sh/@mozilla/readability@0.4.4"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { url } = await req.json()

        // 1. Validation & Safety (SSRF Protection)
        if (!url) throw new Error('URL is required')
        const targetUrl = new URL(url)

        // Block internal/private IP ranges (Basic check)
        const hostname = targetUrl.hostname
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
            throw new Error('Restricted domain')
        }

        // 2. Fetch with Retries & User-Agent
        const fetchWithRetry = async (retries = 2) => {
            try {
                const res = await fetch(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (compatible; NabdhBot/1.0; +https://nabdh.app)',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                    },
                    redirect: 'follow'
                })
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
                return res
            } catch (e) {
                if (retries > 0) return fetchWithRetry(retries - 1)
                throw e
            }
        }

        const response = await fetchWithRetry()
        const html = await response.text()

        // 3. Parse & Extract Content
        const doc = new DOMParser().parseFromString(html, "text/html")
        if (!doc) throw new Error("Failed to parse HTML")

        // Remove clutter before extraction
        const unwanted = ['script', 'style', 'nav', 'footer', 'iframe', 'noscript']
        unwanted.forEach(tag => {
            doc.querySelectorAll(tag).forEach(el => el.remove())
        })

        const reader = new Readability(doc)
        const article = reader.parse()

        // 4. Summarize/Truncate (Limit payload size)
        const content = article?.textContent || doc.body.textContent || ""
        const cleanContent = content.replace(/\s+/g, ' ').trim().slice(0, 5000) // Max 5k chars

        return new Response(
            JSON.stringify({
                title: article?.title || doc.title,
                content: cleanContent,
                siteName: article?.siteName,
                url: url
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
