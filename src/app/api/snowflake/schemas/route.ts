import { NextRequest, NextResponse } from "next/server";
import { getSchemas } from "@/lib/snowflake";

export async function GET(req: NextRequest) {
  const database = req.nextUrl.searchParams.get("database");
  if (!database) {
    return NextResponse.json({ error: "database is required" }, { status: 400 });
  }
  try {
    const schemas = await getSchemas(database);
    return NextResponse.json({ schemas });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to fetch schemas";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
