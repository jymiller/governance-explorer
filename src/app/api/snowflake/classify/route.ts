import { NextRequest, NextResponse } from "next/server";
import { classifyTable } from "@/lib/snowflake";

export async function POST(req: NextRequest) {
  try {
    const { database, schema, table } = await req.json();
    if (!database || !schema || !table) {
      return NextResponse.json(
        { error: "database, schema, and table are required" },
        { status: 400 }
      );
    }
    const result = await classifyTable(database, schema, table);
    return NextResponse.json({ result });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Classification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
