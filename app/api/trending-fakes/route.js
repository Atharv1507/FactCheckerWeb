import { createClient } from "@/lib/supabase/server"

export async function GET() {
  console.log("[v0] GET /api/trending-fakes called")

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("[v0] Missing Supabase environment variables")
      return Response.json({ error: "Database configuration error" }, { status: 500 })
    }

    console.log("[v0] Creating Supabase client...")
    const supabase = await createClient()
    console.log("[v0] Supabase client created successfully")

    // Fetch the 10 most recent false claims from the database
    console.log("[v0] Querying fake_checks table...")
    const { data, error } = await supabase
      .from("fake_checks")
      .select("*")
      .eq("is_fake", true)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("[v0] Database error:", error)
      return Response.json({ error: "Failed to fetch trending fakes", details: error.message }, { status: 500 })
    }

    console.log("[v0] Query successful, found", data?.length || 0, "records")

    // Transform database records to match the expected format
    const fakes = (data || []).map((record) => ({
      claim: record.claim,
      summary: record.result,
      confidence: record.confidence || 0,
      timestamp: record.created_at,
    }))

    return Response.json({ fakes })
  } catch (error) {
    console.error("[v0] Error fetching trending fakes:", error)
    return Response.json({ error: "Failed to fetch trending fakes", details: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { fake } = await request.json()

    if (!fake || !fake.claim) {
      return Response.json({ error: "Invalid fake data" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: existing } = await supabase
      .from("fake_checks")
      .select("id")
      .eq("claim", fake.claim)
      .eq("is_fake", true)
      .maybeSingle()

    if (!existing) {
      // Add to database
      const { error } = await supabase.from("fake_checks").insert({
        claim: fake.claim,
        result: fake.summary || "No summary available",
        is_fake: true,
      })

      if (error) {
        console.error("[v0] Database error:", error)
        return Response.json({ error: "Failed to add trending fake" }, { status: 500 })
      }
    }

    // Fetch updated list
    const { data: fakes } = await supabase
      .from("fake_checks")
      .select("*")
      .eq("is_fake", true)
      .order("created_at", { ascending: false })
      .limit(10)

    const formattedFakes = fakes.map((record) => ({
      claim: record.claim,
      summary: record.result,
      confidence: record.confidence || 0,
      timestamp: record.created_at,
    }))

    return Response.json({ success: true, fakes: formattedFakes })
  } catch (error) {
    console.error("[v0] Error adding trending fake:", error)
    return Response.json({ error: "Failed to add trending fake" }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { claim } = await request.json()

    if (!claim) {
      return Response.json({ error: "Missing claim" }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase.from("fake_checks").delete().eq("claim", claim).eq("is_fake", true)

    if (error) {
      console.error("[v0] Database error:", error)
      return Response.json({ error: "Failed to remove trending fake" }, { status: 500 })
    }

    // Fetch updated list
    const { data: fakes } = await supabase
      .from("fake_checks")
      .select("*")
      .eq("is_fake", true)
      .order("created_at", { ascending: false })
      .limit(10)

    const formattedFakes = fakes.map((record) => ({
      claim: record.claim,
      summary: record.result,
      confidence: record.confidence || 0,
      timestamp: record.created_at,
    }))

    return Response.json({ success: true, fakes: formattedFakes })
  } catch (error) {
    console.error("[v0] Error removing trending fake:", error)
    return Response.json({ error: "Failed to remove trending fake" }, { status: 500 })
  }
}
