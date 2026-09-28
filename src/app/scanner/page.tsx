"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScanSearch, Loader2, AlertCircle } from "lucide-react";
import type { ClassificationResult, ScanResult } from "@/lib/types";

export default function ScannerPage() {
  const [databases, setDatabases] = useState<string[]>([]);
  const [schemas, setSchemas] = useState<string[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const [db, setDb] = useState("");
  const [schema, setSchema] = useState("");
  const [table, setTable] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("scanHistory");
    if (saved) setScanHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    fetch("/api/snowflake/databases")
      .then((r) => r.json())
      .then((d) => setDatabases(d.databases || []))
      .catch(() => setError("Failed to connect to Snowflake. Check your credentials."));
  }, []);

  useEffect(() => {
    if (!db) return;
    setSchema("");
    setTable("");
    setSchemas([]);
    setTables([]);
    fetch(`/api/snowflake/schemas?database=${encodeURIComponent(db)}`)
      .then((r) => r.json())
      .then((d) => setSchemas(d.schemas || []));
  }, [db]);

  useEffect(() => {
    if (!db || !schema) return;
    setTable("");
    setTables([]);
    fetch(
      `/api/snowflake/tables?database=${encodeURIComponent(db)}&schema=${encodeURIComponent(schema)}`
    )
      .then((r) => r.json())
      .then((d) => setTables(d.tables || []));
  }, [db, schema]);

  const scan = useCallback(async () => {
    if (!db || !schema || !table) return;
    setScanning(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch("/api/snowflake/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ database: db, schema, table }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const raw = data.result?.classification_result || data.result || {};
      const parsed: ClassificationResult[] = Object.entries(raw).map(
        ([colName, info]: [string, unknown]) => {
          const col = info as Record<string, unknown>;
          const alt = col.alternates as Array<Record<string, unknown>> | undefined;
          return {
            columnName: colName,
            semanticCategory: (col.semantic_category as string) || null,
            privacyCategory: (col.privacy_category as string) || null,
            probability: (col.probability as number) || null,
            alternates: (alt || []).map((a) => ({
              semanticCategory: a.semantic_category as string,
              privacyCategory: a.privacy_category as string,
              probability: a.probability as number,
            })),
          };
        }
      );

      setResults(parsed);

      const scan: ScanResult = {
        database: db,
        schema,
        table,
        scannedAt: new Date().toISOString(),
        columns: parsed,
      };
      const updated = [scan, ...scanHistory].slice(0, 50);
      setScanHistory(updated);
      localStorage.setItem("scanHistory", JSON.stringify(updated));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scan failed");
    } finally {
      setScanning(false);
    }
  }, [db, schema, table, scanHistory]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Governance Scanner
        </h1>
        <p className="mt-1 text-muted-foreground">
          Run Snowflake CLASSIFY on any table to detect sensitive columns
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select a Table to Scan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Database</label>
              <Select value={db} onValueChange={(v) => v && setDb(v)}>
                <SelectTrigger><SelectValue placeholder="Select database" /></SelectTrigger>
                <SelectContent>
                  {databases.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Schema</label>
              <Select value={schema} onValueChange={(v) => v && setSchema(v)} disabled={!db}>
                <SelectTrigger><SelectValue placeholder="Select schema" /></SelectTrigger>
                <SelectContent>
                  {schemas.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Table</label>
              <Select value={table} onValueChange={(v) => v && setTable(v)} disabled={!schema}>
                <SelectTrigger><SelectValue placeholder="Select table" /></SelectTrigger>
                <SelectContent>
                  {tables.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <button
            onClick={scan}
            disabled={!table || scanning}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {scanning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ScanSearch className="h-4 w-4" />
            )}
            {scanning ? "Scanning..." : "Scan Table"}
          </button>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Classification Results: {db}.{schema}.{table}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 pr-4 font-medium">Column</th>
                    <th className="pb-2 pr-4 font-medium">Semantic Category</th>
                    <th className="pb-2 pr-4 font-medium">Privacy Category</th>
                    <th className="pb-2 font-medium">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((col) => (
                    <tr key={col.columnName} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-mono text-xs">
                        {col.columnName}
                      </td>
                      <td className="py-2 pr-4">
                        {col.semanticCategory ? (
                          <Badge variant="secondary">{col.semanticCategory}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-2 pr-4">
                        {col.privacyCategory ? (
                          <Badge
                            variant={
                              col.privacyCategory === "IDENTIFIER"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {col.privacyCategory}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-2">
                        {col.probability != null ? (
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${col.probability * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {(col.probability * 100).toFixed(0)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {scanHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scan History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scanHistory.slice(0, 10).map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border p-3 text-sm"
                >
                  <span className="font-mono">
                    {s.database}.{s.schema}.{s.table}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">
                      {s.columns.filter((c) => c.semanticCategory).length}/
                      {s.columns.length} classified
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(s.scannedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
