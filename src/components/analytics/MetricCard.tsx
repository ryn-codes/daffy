"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  icon?: React.ReactNode;
}

export default function MetricCard({ title, value, change, trend, icon }: MetricCardProps) {
  const isUp = trend === "up";

  return (
    <div className="glass-panel glass-panel-hover p-6 rounded-2xl relative overflow-hidden select-none">
      {/* Decorative Gradient Background Layer */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full filter blur-[50px] opacity-10 pointer-events-none ${
        isUp ? "bg-emerald-500" : "bg-red-500"
      }`} />

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-muted tracking-wide">{title}</span>
        {icon && (
          <div className="text-text-muted bg-slate-900/60 p-2 rounded-lg border border-border-subtle flex-shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-text-bright">{value}</span>
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold ${
          isUp 
            ? "bg-emerald-500/10 text-primary border border-emerald-500/20" 
            : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}>
          {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{change}</span>
        </span>
        <span className="text-xs text-text-muted">vs last month</span>
      </div>
    </div>
  );
}
