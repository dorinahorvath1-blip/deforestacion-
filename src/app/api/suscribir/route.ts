import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// const SUPABASE_URL = process.env.SUPABASE_URL!;
// const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
// const RESEND_KEY = process.env.RESEND_API_KEY!;

export async function POST(req: NextRequest) {
  const { nombre, apellido, email, comunidad } = await req.json();

  if (!nombre || !apellido || !email || !comunidad) {
    return NextResponse.json({ error: "Todos los campos son requeridos." }, { status: 400 });
  }

  // // Save to Supabase via REST API
  // const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/suscriptores`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "apikey": SUPABASE_KEY,
  //     "Authorization": `Bearer ${SUPABASE_KEY}`,
  //     "Prefer": "return=minimal",
  //   },
  //   body: JSON.stringify({ nombre, apellido, email, comunidad }),
  // });

  // if (!dbRes.ok) {
  //   const err = await dbRes.text();
  //   console.error("Supabase error:", err);
  //   return NextResponse.json({ error: "Error al guardar la suscripción." }, { status: 500 });
  // }

  // // Send welcome email via Resend REST API
  // await fetch("https://api.resend.com/emails", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Authorization": `Bearer ${RESEND_KEY}`,
  //   },
  //   body: JSON.stringify({
  //     from: "Paz y Esperanza <onboarding@resend.dev>",
  //     to: email,
  //     subject: "Confirmación de suscripción – Monitoreo de Deforestación",
  //     html: `
  //       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem; color: #1a1a1a;">
  //         <h2 style="color: #2d6a4f;">¡Hola, ${nombre}!</h2>
  //         <p>Tu suscripción ha sido registrada exitosamente. A partir de ahora recibirás alertas cuando se detecte deforestación en la comunidad de <strong>${comunidad}</strong>.</p>
  //         <p>Cuando recibas una alerta, podrás ingresar al mapa para ver exactamente dónde fue detectada la deforestación.</p>
  //         <div style="margin: 2rem 0; padding: 1rem; background: #f6fbf8; border-left: 4px solid #2d6a4f; border-radius: 4px;">
  //           <strong>Comunidad monitoreada:</strong> ${comunidad}
  //         </div>
  //         <p style="color: #888; font-size: 0.85rem;">Si no solicitaste esta suscripción, puedes ignorar este correo.</p>
  //         <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 2rem 0;" />
  //         <p style="color: #888; font-size: 0.8rem;">Paz y Esperanza · Monitoreo de Deforestación en Comunidades Nativas</p>
  //       </div>
  //     `,
  //   }),
  // }).catch(err => console.error("Resend error:", err));

  return NextResponse.json({ success: true });
}
