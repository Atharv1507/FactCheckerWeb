async function fetchWithRetry(url, options, maxRetries = 3) {
  let lastError

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)

      // If successful or not a 503 error, return immediately
      if (response.ok || response.status !== 503) {
        return response
      }

      // For 503 errors, wait before retrying
      if (attempt < maxRetries - 1) {
        const delayMs = Math.pow(2, attempt) * 1000 // Exponential backoff: 1s, 2s, 4s
        console.log(`[v0] API overloaded (503). Retrying in ${delayMs}ms... (Attempt ${attempt + 1}/${maxRetries})`)
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }

      lastError = response
    } catch (error) {
      lastError = error
      if (attempt < maxRetries - 1) {
        const delayMs = Math.pow(2, attempt) * 1000
        console.log(`[v0] Fetch error. Retrying in ${delayMs}ms... (Attempt ${attempt + 1}/${maxRetries})`)
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }
  }

  return lastError
}

export async function POST(request) {
  try {
    const { query, image, url } = await request.json()

    if ((!query || !query.trim()) && !image && (!url || !url.trim())) {
      return Response.json({ error: "Search query, image, or URL is required" }, { status: 400 })
    }

    if (query && query.length > 500) {
      return Response.json(
        { error: "Search query is too long. Please use a shorter query (maximum 500 characters)." },
        { status: 400 },
      )
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE" || apiKey.trim() === "") {
      console.error("[v0] Gemini API key not configured or is a placeholder")
      return Response.json(
        {
          error:
            "Gemini API key is not configured. Please follow these steps:\n\n1. Go to https://aistudio.google.com/apikey\n2. Create a new API key\n3. Copy the key and replace 'YOUR_GEMINI_API_KEY_HERE' in your .env.local file\n4. Restart your application\n\nIf you're using Vercel, add the GEMINI_API_KEY to your project environment variables in the Vars section.",
        },
        { status: 500 },
      )
    }

    console.log(
      "[v0] Fetching from Gemini API with query length:",
      query?.length || 0,
      "Image:",
      !!image,
      "URL:",
      !!url,
    )

    const parts = []

    if (url) {
      try {
        // Check if URL is an image
        const isImageUrl = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url)

        if (isImageUrl) {
          // Fetch image from URL and convert to base64
          const imageResponse = await fetch(url)
          if (!imageResponse.ok) {
            return Response.json(
              { error: "Failed to fetch image from URL. Please check the URL and try again." },
              { status: 400 },
            )
          }

          const arrayBuffer = await imageResponse.arrayBuffer()
          const base64Data = Buffer.from(arrayBuffer).toString("base64")
          const contentType = imageResponse.headers.get("content-type") || "image/jpeg"

          parts.push({
            text: `Analyze this image from URL: ${url}. ${query ? `Context: ${query}` : ""} Provide a fact-check analysis including: what you see in the image, whether the content appears authentic or manipulated, any misleading elements, and verification recommendations. Return ONLY a valid JSON object (no markdown, no code blocks) with these exact fields: verdict (true/false/mixed), confidence (0-100 as number), summary (2-3 sentences about the image), key_points (array of 3-4 key findings about the image), sources_needed (array of recommended sources to verify). Be concise and factual.`,
          })

          parts.push({
            inline_data: {
              mime_type: contentType,
              data: base64Data,
            },
          })
        } else {
          // Fetch webpage content
          const pageResponse = await fetch(url)
          if (!pageResponse.ok) {
            return Response.json(
              { error: "Failed to fetch content from URL. Please check the URL and try again." },
              { status: 400 },
            )
          }

          const htmlContent = await pageResponse.text()

          // Better content extraction - focus on main content areas
          let textContent = htmlContent
            // Remove script and style tags with their content
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
            // Remove navigation, header, footer elements
            .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
            .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "")
            .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "")
            // Remove all HTML tags
            .replace(/<[^>]*>/g, " ")
            // Clean up whitespace
            .replace(/\s+/g, " ")
            .trim()

          // Try to extract title
          const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i)
          const pageTitle = titleMatch ? titleMatch[1].trim() : ""

          // Limit content length but keep meaningful content
          textContent = textContent.substring(0, 4000)

          parts.push({
            text: `Analyze the content from this webpage: ${url}
${pageTitle ? `Page Title: ${pageTitle}` : ""}
${query ? `User Context: ${query}` : ""}

Page Content:
${textContent}

Provide a comprehensive fact-check analysis of the claims or information presented in this webpage. Return ONLY a valid JSON object (no markdown, no code blocks) with these exact fields:
- verdict: "true" | "false" | "mixed" (based on the factual accuracy of the main claims)
- confidence: number between 0-100 (your confidence in this assessment)
- summary: string (2-3 sentences summarizing the main claims and their accuracy)
- key_points: array of 3-4 strings (specific findings about the content's accuracy)
- sources_needed: array of strings (recommended sources to verify the claims)

Be specific about what claims you're fact-checking and why. Focus on factual accuracy, not opinions.`,
          })
        }
      } catch (fetchError) {
        console.error("[v0] URL Fetch Error:", fetchError.message)
        return Response.json(
          { error: "Failed to fetch content from URL. Please check the URL and try again." },
          { status: 400 },
        )
      }
    } else if (image) {
      // Extract base64 data and mime type from data URL
      const matches = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
      if (matches && matches.length === 3) {
        const mimeType = matches[1]
        const base64Data = matches[2]

        parts.push({
          text: `Analyze this image and verify its contents. ${query ? `Context: ${query}` : ""} Provide a fact-check analysis including: what you see in the image, whether the content appears authentic or manipulated, any misleading elements, and verification recommendations. Return ONLY a valid JSON object (no markdown, no code blocks) with these exact fields: verdict (true/false/mixed), confidence (0-100 as number), summary (2-3 sentences about the image), key_points (array of 3-4 key findings about the image), sources_needed (array of recommended sources to verify). Be concise and factual.`,
        })

        parts.push({
          inline_data: {
            mime_type: mimeType,
            data: base64Data,
          },
        })
      } else {
        return Response.json({ error: "Invalid image format" }, { status: 400 })
      }
    } else {
      parts.push({
        text: `You are a fact-checking expert. Analyze the given claim and provide a streamlined conclusion. Return ONLY a valid JSON object (no markdown, no code blocks) with these exact fields: verdict (true/false/mixed), confidence (0-100 as number), summary (2-3 sentences), key_points (array of 3-4 key findings), sources_needed (array of recommended sources to verify). Be concise and factual.

Claim to fact-check: "${query}"

Return only the JSON object, nothing else.`,
      })
    }

    const response = await fetchWithRetry(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: parts,
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      },
    )

    const contentType = response.headers.get("content-type")
    const responseText = await response.text()

    if (!response.ok) {
      console.error("[v0] Gemini API Response Error:", response.status, responseText.substring(0, 200))

      if (response.status === 401 || response.status === 403) {
        return Response.json(
          {
            error:
              "Invalid Gemini API Key. The configured API key appears to be invalid or has insufficient permissions. Please verify your Gemini API key in the environment variables.",
          },
          { status: 403 },
        )
      } else if (response.status === 429) {
        return Response.json({ error: "Rate limit exceeded. Please wait a moment and try again." }, { status: 429 })
      } else if (response.status === 503) {
        return Response.json(
          {
            error:
              "The Gemini service is temporarily overloaded. We've attempted retries, but the service is still unavailable. Please try again in a few moments.",
          },
          { status: 503 },
        )
      } else {
        return Response.json({ error: `API Error: ${response.status}. Please try again later.` }, { status: 500 })
      }
    }

    if (!contentType || !contentType.includes("application/json")) {
      console.error("[v0] Invalid content type:", contentType, "Response:", responseText.substring(0, 200))
      return Response.json(
        {
          error:
            "The API returned an unexpected response format. This may indicate an API configuration issue. Please verify your API key and try again.",
        },
        { status: 500 },
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("[v0] JSON Parse Error:", parseError.message, "Response:", responseText.substring(0, 200))
      return Response.json(
        {
          error: "Failed to parse the API response. The service may be experiencing issues. Please try again later.",
        },
        { status: 500 },
      )
    }

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      return Response.json(
        { error: "No fact-check analysis received. Please try again with a different query." },
        { status: 404 },
      )
    }

    const messageContent = data.candidates[0].content.parts[0].text
    let factCheckData

    try {
      // Try to extract JSON from the response
      const jsonMatch = messageContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        factCheckData = JSON.parse(jsonMatch[0])
      } else {
        // Fallback: create structured data from text response
        factCheckData = {
          verdict: messageContent.toLowerCase().includes("true")
            ? "true"
            : messageContent.toLowerCase().includes("false")
              ? "false"
              : "mixed",
          confidence: 75,
          summary: messageContent,
          key_points: [messageContent.substring(0, 100)],
          sources_needed: ["General research", "Expert verification"],
        }
      }
    } catch (e) {
      factCheckData = {
        verdict: "mixed",
        confidence: 60,
        summary: messageContent,
        key_points: [messageContent.substring(0, 100)],
        sources_needed: ["Further research needed"],
      }
    }

    return Response.json({
      claim: query || url || "Image analysis",
      analysis: factCheckData,
      timestamp: new Date().toISOString(),
      hasImage: !!image,
      hasUrl: !!url,
    })
  } catch (error) {
    console.error("[v0] Server Error:", error.message)

    let errorMessage = "An unexpected error occurred. Please try again later."
    if (error.message.includes("Failed to fetch")) {
      errorMessage = "Network connection failed. Please check your internet connection and try again."
    }

    return Response.json({ error: errorMessage }, { status: 500 })
  }
}

import { createClient } from "@/lib/supabase/server"

export async function PUT(request) {
  try {
    const { claim, analysis } = await request.json()

    if (!claim || !analysis) {
      return Response.json({ error: "Missing claim or analysis data" }, { status: 400 })
    }

    // Create Supabase client
    const supabase = await createClient()

    // Save to database
    const { data, error } = await supabase
      .from("fake_checks")
      .insert({
        claim: claim,
        result: analysis.summary || "No summary available",
        is_fake: analysis.verdict === "false",
        confidence: analysis.confidence || 0,
        session_id: request.headers.get("x-session-id") || null,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return Response.json({ error: "Failed to save to database" }, { status: 500 })
    }

    return Response.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Error saving fact-check:", error)
    return Response.json({ error: "Failed to save fact-check" }, { status: 500 })
  }
}
