import { NextRequest, NextResponse } from "next/server";
import { getTables } from "@/lib/snowflake";

export async function GET(req: NextRequest) {
  const database = req.nextUrl.searchParams.get("database");
  const schema = req.nextUrl.searchParams.get("schema");
  if (!database || !schema) {
    return NextResponse.json(
      { error: "database and schema are required" },
      { status: 400 }
    );
  }
  try {
    const tables = await getTables(database, schema);
    return NextResponse.json({ tables });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to fetch tables";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
