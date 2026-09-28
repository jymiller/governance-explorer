"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Check, Play, ShieldCheck, Eye, Tag } from "lucide-react";
import type { ScanResult, GeneratedPolicy } from "@/lib/types";
import { generatePolicies } from "@/lib/policy-generator";

export default function PoliciesPage() {
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);
  const [policies, setPolicies] = useState<GeneratedPolicy[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [executing, setExecuting] = useState<number | null>(null);
  const [execResults, setExecResults] = useState<Record<number, { ok: boolean; msg: string }>>({});

  useEffect(() => {
    const saved = localStorage.getItem("scanHistory");
    if (saved) {
      const history = JSON.parse(saved) as ScanResult[];
      setScanHistory(history);
      if (history.length > 0) {
        const latest = history[0];
        setSelectedScan(latest);
        setPolicies(
          generatePolicies(latest.database, latest.schema, latest.table, latest.columns)
        );
      }
    }
  }, []);

  function selectScan(idx: number) {
    const scan = scanHistory[idx];
    setSelectedScan(scan);
    setPolicies(generatePolicies(scan.database, scan.schema, scan.table, scan.columns));
    setExecResults({});
  }

  async function copySQL(sql: string, idx: number) {
    await navigator.clipboard.writeText(sql);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  async function executePolicy(sql: string, idx: number) {
    setExecuting(idx);
    try {
      const statements = sql
        .split(";")
        .map((s) => s.replace(/^--.*$/gm, "").trim())
        .filter((s) => s && !s.startsWith("--"));

      for (const stmt of statements) {
        const res = await fetch("/api/snowflake/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sql: stmt }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
      }
      setExecResults((prev) => ({ ...prev, [idx]: { ok: true, msg: "Applied successfully" } }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Execution failed";
      setExecResults((prev) => ({ ...prev, [idx]: { ok: false, msg } }));
    } finally {
      setExecuting(null);
    }
  }

  const policyIcons: Record<string, typeof ShieldCheck> = {
    masking: Eye,
    row_access: ShieldCheck,
    tagging: Tag,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Policy Generator</h1>
        <p className="mt-1 text-muted-foreground">
          Auto-generate governance policies from classification results
        </p>
      </div>

      {scanHistory.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No scan results yet. Use the{" "}
            <a href="/scanner" className="underline">
              Governance Scanner
            </a>{" "}
            first to classify a table.
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select a Scan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {scanHistory.slice(0, 10).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => selectScan(i)}
                    className={`flex w-full items-center justify-between rounded-md border p-3 text-left text-sm transition-colors ${
                      selectedScan === s
                        ? "border-primary bg-primary/5"
                        : "hover:bg-accent"
                    }`}
                  >
                    <span className="font-mono">
                      {s.database}.{s.schema}.{s.table}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(s.scannedAt).toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {policies.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                Generated Policies ({policies.length})
              </h2>
              {policies.map((policy, idx) => {
                const Icon = policyIcons[policy.type] || ShieldCheck;
                const result = execResults[idx];
                return (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">{policy.name}</CardTitle>
                        <Badge variant="outline" className="capitalize">
                          {policy.type.replace("_", " ")}
                        </Badge>
                        {policy.targetColumn && (
                          <Badge variant="secondary">{policy.targetColumn}</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {policy.description}
                      </p>
                      <Separator />
                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{policy.sql}</code>
                        </pre>
                        <div className="absolute right-2 top-2 flex gap-1">
                          <button
                            onClick={() => copySQL(policy.sql, idx)}
                            className="rounded-md bg-background/80 p-1.5 text-muted-foreground hover:text-foreground"
                            title="Copy SQL"
                          >
                            {copiedIdx === idx ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => executePolicy(policy.sql, idx)}
                            disabled={executing !== null}
                            className="rounded-md bg-background/80 p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-50"
                            title="Execute"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {result && (
                        <div
                          className={`rounded-md p-2 text-xs ${
                            result.ok
                              ? "bg-green-500/10 text-green-700 dark:text-green-400"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {result.msg}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
