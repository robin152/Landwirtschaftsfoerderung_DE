import { NextResponse } from "next/server"

const WEBHOOK_URL = "https://eskalator-prozesse.app.n8n.cloud/webhook/e3c34b21-4eff-40eb-b62d-8ff2d21e3603"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const payload = {
      ...data,
      projektseite: "Landwirtschaftsförderung",
      lead_quelle: "Landwirtschaftsförderung",
    }

    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    })

    if (!webhookResponse.ok) {
      console.error("[leads] Webhook returned error status:", webhookResponse.status, webhookResponse.statusText)
      return NextResponse.json(
        { success: false, error: "Webhook returned an error", status: webhookResponse.status },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true, message: "Lead received" })
  } catch (error) {
    console.error("[leads] Webhook not reachable:", error)
    return NextResponse.json(
      { success: false, error: "Webhook not reachable" },
      { status: 502 }
    )
  }
}
