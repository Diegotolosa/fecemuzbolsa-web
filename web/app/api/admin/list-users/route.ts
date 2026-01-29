import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

async function requireAdminFromBearer(supabaseAdmin: ReturnType<typeof getAdminClient>, req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : null;
  if (!token) return { ok: false as const, status: 401, message: "Missing Bearer token" };

  const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
  if (userErr || !userData?.user) return { ok: false as const, status: 401, message: "Invalid session" };

  const userId = userData.user.id;

  const { data: prof, error: profErr } = await supabaseAdmin
    .from("profiles")
    .select("role,email")
    .eq("id", userId)
    .maybeSingle();

  if (profErr) return { ok: false as const, status: 500, message: profErr.message };
  if (!prof || prof.role !== "admin") return { ok: false as const, status: 403, message: "Not admin" };

  return { ok: true as const, userId };
}

export async function GET(req: Request) {
  try {
    const supabaseAdmin = getAdminClient();

    const adminCheck = await requireAdminFromBearer(supabaseAdmin, req);
    if (!adminCheck.ok) {
      return NextResponse.json({ error: adminCheck.message }, { status: adminCheck.status });
    }

    // Devuelve lista de perfiles (sin datos sensibles)
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id,email,role,created_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ users: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
