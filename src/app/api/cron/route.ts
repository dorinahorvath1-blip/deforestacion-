import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

// ─────────────────────────────────────────────────────────────
// GEE DEFORESTATION CHECK
// This function calls the Google Earth Engine REST API to check
// which communities have had new deforestation detected in the
// last 24 hours.
//
// TO ENABLE: create a GEE service account, download its JSON key,
// add it as GOOGLE_SERVICE_ACCOUNT_KEY in your Vercel env vars,
// and update the assetId below to your GEE asset path.
// ─────────────────────────────────────────────────────────────
async function getCommunitiesWithNewDeforestation(): Promise<string[]> {
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    // GEE credentials not yet configured — return empty so no emails are sent
    console.log("GEE service account not configured. Skipping deforestation check.");
    return [];
  }

  try {
    // Parse service account credentials
    const credentials = JSON.parse(serviceAccountKey);

    // Get OAuth2 token for GEE
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: await createJWT(credentials),
      }),
    });
    const { access_token } = await tokenRes.json();

    // Query GEE: run a computation to check for deforestation alerts in last 24h
    // Replace 'users/dorinahorvath/mapa_deforestacion/comunidades' with your actual asset
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const geeRes = await fetch(
      `https://earthengine.googleapis.com/v1/projects/earthengine-public/maps`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    // TODO: parse GEE response to extract communities with alerts
    // For now return empty — update this logic once GEE service account is configured
    console.log("GEE response status:", geeRes.status);
    return [];
  } catch (err) {
    console.error("GEE check failed:", err);
    return [];
  }
}

// Helper: create a JWT for Google service account auth
async function createJWT(credentials: {
  client_email: string;
  private_key: string;
}): Promise<string> {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/earthengine.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

  const unsigned = `${encode(header)}.${encode(payload)}`;

  // Import private key
  const pemKey = credentials.private_key.replace(/\\n/g, "\n");
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToDer(pemKey),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    Buffer.from(unsigned)
  );

  return `${unsigned}.${Buffer.from(signature).toString("base64url")}`;
}

function pemToDer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  return Buffer.from(b64, "base64");
}

// ─────────────────────────────────────────────────────────────
// MAIN CRON HANDLER — runs daily via Vercel Cron
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // Protect the endpoint so only Vercel cron can call it
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const communitiesWithAlerts = await getCommunitiesWithNewDeforestation();

  if (communitiesWithAlerts.length === 0) {
    return NextResponse.json({ message: "Sin nuevas alertas de deforestación." });
  }

  // Get subscribers for affected communities
  const { data: subscribers, error } = await supabase
    .from("suscriptores")
    .select("nombre, email, comunidad")
    .in("comunidad", communitiesWithAlerts)
    .eq("activo", true);

  if (error || !subscribers || subscribers.length === 0) {
    return NextResponse.json({ message: "Sin suscriptores para las comunidades afectadas." });
  }

  // Send alert email to each subscriber
  const emailPromises = subscribers.map((sub) =>
    resend.emails.send({
      from: "Paz y Esperanza <dorina@pazyesperanza.org>",
      to: sub.email,
      subject: `⚠️ Alerta de Deforestación – ${sub.comunidad}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem; color: #1a1a1a;">
          <h2 style="color: #c0392b;">⚠️ Alerta de Deforestación Detectada</h2>
          <p>Hola <strong>${sub.nombre}</strong>,</p>
          <p>Se ha detectado nueva actividad de deforestación en la comunidad de <strong>${sub.comunidad}</strong> en las últimas 24 horas.</p>
          <p>Te invitamos a revisar el mapa para ver la ubicación exacta de la deforestación detectada.</p>
          <div style="margin: 2rem 0; text-align: center;">
            <a href="https://deforestacion-.vercel.app"
               style="background: #2d6a4f; color: #fff; padding: 0.8rem 2rem; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 1rem;">
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
    })
  );

  await Promise.allSettled(emailPromises);

  return NextResponse.json({
    message: `Alertas enviadas a ${subscribers.length} suscriptores en ${communitiesWithAlerts.length} comunidades.`,
    comunidades: communitiesWithAlerts,
  });
}
