"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ScanResult } from "@/lib/types";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import type { PieLabelRenderProps } from "recharts";

const COLORS = [
  "hsl(0, 72%, 51%)",
  "hsl(43, 96%, 56%)",
  "hsl(142, 71%, 45%)",
  "hsl(217, 91%, 60%)",
  "hsl(280, 68%, 51%)",
  "hsl(200, 18%, 46%)",
];

export default function DashboardPage() {
  const [scans, setScans] = useState<ScanResult[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("scanHistory");
    if (saved) setScans(JSON.parse(saved));
  }, []);

  const stats = useMemo(() => {
    const uniqueScans = new Map<string, ScanResult>();
    for (const s of scans) {
      const key = `${s.database}.${s.schema}.${s.table}`;
      if (!uniqueScans.has(key) || s.scannedAt > uniqueScans.get(key)!.scannedAt) {
        uniqueScans.set(key, s);
      }
    }

    const latest = Array.from(uniqueScans.values());
    const allCols = latest.flatMap((s) => s.columns);
    const classified = allCols.filter((c) => c.semanticCategory);
    const unclassified = allCols.length - classified.length;

    const byCategory = new Map<string, number>();
    for (const col of classified) {
      const cat = col.semanticCategory!;
      byCategory.set(cat, (byCategory.get(cat) || 0) + 1);
    }

    const byPrivacy = new Map<string, number>();
    for (const col of classified) {
      const priv = col.privacyCategory || "UNKNOWN";
      byPrivacy.set(priv, (byPrivacy.get(priv) || 0) + 1);
    }

    return {
      totalTables: latest.length,
      totalColumns: allCols.length,
      classifiedCount: classified.length,
      unclassifiedCount: unclassified,
      coveragePercent: allCols.length > 0 ? (classified.length / allCols.length) * 100 : 0,
      byCategory: Array.from(byCategory.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      byPrivacy: Array.from(byPrivacy.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      tables: latest,
    };
  }, [scans]);

  if (scans.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Governance Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Visual overview of your data governance posture
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No scan data yet. Use the{" "}
            <a href="/scanner" className="underline">
              Governance Scanner
            </a>{" "}
            to classify tables, then return here.
          </CardContent>
        </Card>
      </div>
    );
  }

  const pieData = [
    { name: "Classified", value: stats.classifiedCount },
    { name: "Unclassified", value: stats.unclassifiedCount },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Governance Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Visual overview of your data governance posture
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Tables Scanned" value={stats.totalTables} />
        <MetricCard label="Total Columns" value={stats.totalColumns} />
        <MetricCard label="Classified" value={stats.classifiedCount} />
        <MetricCard
          label="Coverage"
          value={`${stats.coveragePercent.toFixed(0)}%`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Classification Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  label={(props: PieLabelRenderProps) =>
                    `${props.name ?? ''} ${(((props.percent as number) ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  <Cell fill="hsl(142, 71%, 45%)" />
                  <Cell fill="hsl(200, 18%, 46%)" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">By Privacy Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.byPrivacy}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {stats.byCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">By Semantic Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={Math.max(200, stats.byCategory.length * 30)}>
              <BarChart data={stats.byCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11 }}
                  width={150}
                />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {stats.byCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Scanned Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 font-medium">Table</th>
                  <th className="pb-2 pr-4 font-medium">Columns</th>
                  <th className="pb-2 pr-4 font-medium">Classified</th>
                  <th className="pb-2 font-medium">Coverage</th>
                </tr>
              </thead>
              <tbody>
                {stats.tables.map((s) => {
                  const cls = s.columns.filter((c) => c.semanticCategory).length;
                  const pct = s.columns.length > 0 ? (cls / s.columns.length) * 100 : 0;
                  return (
                    <tr
                      key={`${s.database}.${s.schema}.${s.table}`}
                      className="border-b last:border-0"
                    >
                      <td className="py-2 pr-4 font-mono text-xs">
                        {s.database}.{s.schema}.{s.table}
                      </td>
                      <td className="py-2 pr-4">{s.columns.length}</td>
                      <td className="py-2 pr-4">{cls}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-20 rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {pct.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}
