import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/snowflake";

export async function POST(req: NextRequest) {
  try {
    const { sql } = await req.json();
    if (!sql || typeof sql !== "string") {
      return NextResponse.json({ error: "sql is required" }, { status: 400 });
    }
    // Only allow DDL statements for policies and tags
    const upper = sql.trim().toUpperCase();
    const allowed = ["CREATE ", "ALTER ", "DROP "];
    if (!allowed.some((prefix) => upper.startsWith(prefix))) {
      return NextResponse.json(
        { error: "Only DDL statements (CREATE, ALTER, DROP) are allowed" },
        { status: 400 }
      );
    }
    const result = await query(sql);
    return NextResponse.json({ success: true, result });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Execution failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
