import { NextResponse } from "next/server";
import { getDatabases } from "@/lib/snowflake";

export async function GET() {
  try {
    const dbs = await getDatabases();
    return NextResponse.json({ databases: dbs });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to fetch databases";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
