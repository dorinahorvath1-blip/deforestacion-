import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const RESEND_KEY = process.env.RESEND_API_KEY!;

async function getCommunitiesWithNewDeforestation(): Promise<string[]> {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    console.log("GEE service account not configured. Skipping deforestation check.");
    return [];
  }
  // TODO: implement GEE REST API call once service account is configured
  return [];
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const isTest = req.nextUrl.searchParams.get("test") === "true";

  let subsRes: Response;
  if (isTest) {
    subsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/suscriptores?activo=eq.true&select=nombre,email,comunidad`,
      { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } }
    );
  } else {
    const communitiesWithAlerts = await getCommunitiesWithNewDeforestation();

    if (communitiesWithAlerts.length === 0) {
      return NextResponse.json({ message: "Sin nuevas alertas de deforestación." });
    }

    const query = communitiesWithAlerts.map(c => `comunidad=eq.${encodeURIComponent(c)}`).join("&");
    subsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/suscriptores?${query}&activo=eq.true&select=nombre,email,comunidad`,
      { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } }
    );
  }

  const subscribers: { nombre: string; email: string; comunidad: string }[] = await subsRes.json();
  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ message: "Sin suscriptores para las comunidades afectadas." });
  }

  await Promise.allSettled(
    subscribers.map(sub =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${RESEND_KEY}` },
        body: JSON.stringify({
          from: "Paz y Esperanza <onboarding@resend.dev>",
          to: sub.email,
          subject: `⚠️ Alerta de Deforestación – ${sub.comunidad}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem; color: #1a1a1a;">
              <h2 style="color: #c0392b;">⚠️ Alerta de Deforestación Detectada</h2>
              <p>Hola <strong>${sub.nombre}</strong>,</p>
              <p>Se ha detectado nueva actividad de deforestación en la comunidad de <strong>${sub.comunidad}</strong> en las últimas 24 horas.</p>
              <div style="margin: 2rem 0; text-align: center;">
                <a href="https://deforestacion-wine.vercel.app"
                   style="background: #2d6a4f; color: #fff; padding: 0.8rem 2rem; border-radius: 8px; text-decoration: none; font-weight: bold;">
                  Ver Mapa
                </a>
              </div>
              <div style="padding: 1rem; background: #fff5f5; border-left: 4px solid #c0392b; border-radius: 4px;">
                <strong>Comunidad afectada:</strong> ${sub.comunidad}
              </div>
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 2rem 0;" />
              <p style="color: #888; font-size: 0.8rem;">Paz y Esperanza · Monitoreo de Deforestación en Comunidades Nativas</p>
            </div>
          `,
        }),
      })
    )
  );

  return NextResponse.json({ message: `Alertas enviadas a ${subscribers.length} suscriptores.` });
}
