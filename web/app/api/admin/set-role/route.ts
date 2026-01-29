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

export async function POST(req: Request) {
  try {
    const supabaseAdmin = getAdminClient();

    const adminCheck = await requireAdminFromBearer(supabaseAdmin, req);
    if (!adminCheck.ok) {
      return NextResponse.json({ error: adminCheck.message }, { status: adminCheck.status });
    }

    const body = await req.json().catch(() => null);
    const targetUserId = body?.userId as string | undefined;
    const role = body?.role as string | undefined;

    if (!targetUserId || !role) {
      return NextResponse.json({ error: "Missing userId or role" }, { status: 400 });
    }

    if (role !== "member" && role !== "admin") {
      return NextResponse.json({ error: "Invalid role (use member/admin)" }, { status: 400 });
    }

    // Evitar que un admin se quite su propio admin por accidente (opcional, pero recomendable)
    if (targetUserId === adminCheck.userId && role !== "admin") {
      return NextResponse.json({ error: "You cannot remove your own admin role" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ role })
      .eq("id", targetUserId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
