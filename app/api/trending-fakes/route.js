import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables")
      return Response.json({ error: "Database configuration error" }, { status: 500 })
    }

    const supabase = await createClient()

    const fiveDaysAgo = new Date()
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5)

    const { error: deleteError } = await supabase
      .from("fake_checks")
      .delete()
      .eq("is_fake", true)
      .lt("created_at", fiveDaysAgo.toISOString())

    if (deleteError) {
      console.error("Error deleting old entries:", deleteError)
    }

    const { data, error } = await supabase
      .from("fake_checks")
      .select("*")
      .eq("is_fake", true)
      .order("created_at", { ascending: false })
      .limit(5)

    if (error) {
      console.error("Database error:", error)
      return Response.json({ error: "Failed to fetch trending fakes", details: error.message }, { status: 500 })
    }

    const fakes = (data || []).map((record) => ({
      claim: record.claim,
      summary: record.result,
      confidence: record.confidence || 0,
      timestamp: record.created_at,
    }))

    return Response.json({ fakes })
  } catch (error) {
    console.error("Error fetching trending fakes:", error)
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
      const { error } = await supabase.from("fake_checks").insert({
        claim: fake.claim,
        result: fake.summary || "No summary available",
        is_fake: true,
      })

      if (error) {
        console.error("Database error:", error)
        return Response.json({ error: "Failed to add trending fake" }, { status: 500 })
      }
    }

    const { data: fakes } = await supabase
      .from("fake_checks")
      .select("*")
      .eq("is_fake", true)
      .order("created_at", { ascending: false })
      .limit(5)

    const formattedFakes = fakes.map((record) => ({
      claim: record.claim,
      summary: record.result,
      confidence: record.confidence || 0,
      timestamp: record.created_at,
    }))

    return Response.json({ success: true, fakes: formattedFakes })
  } catch (error) {
    console.error("Error adding trending fake:", error)
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
      console.error("Database error:", error)
      return Response.json({ error: "Failed to remove trending fake" }, { status: 500 })
    }

    const { data: fakes } = await supabase
      .from("fake_checks")
      .select("*")
      .eq("is_fake", true)
      .order("created_at", { ascending: false })
      .limit(5)

    const formattedFakes = fakes.map((record) => ({
      claim: record.claim,
      summary: record.result,
      confidence: record.confidence || 0,
      timestamp: record.created_at,
    }))

    return Response.json({ success: true, fakes: formattedFakes })
  } catch (error) {
    console.error("Error removing trending fake:", error)
    return Response.json({ error: "Failed to remove trending fake" }, { status: 500 })
  }
}
