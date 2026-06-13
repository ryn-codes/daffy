"use client";

import React, { useState } from "react";
import { 
  Users, 
  Plus, 
  Trash2, 
  TrendingUp, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Check,
  DollarSign,
  Share2,
  Download,
  Bell,
  MoreHorizontal,
  ChevronDown,
  Filter,
  X,
  HelpCircle,
  Eye,
  Info,
  CheckCircle2,
  Clock,
  Award,
  Zap,
  TrendingDown,
  UserCheck,
  Percent
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface CohortDetailDrawer {
  cohortName: string;
  usersSize: string;
  activeUsers: string;
  wk1: string;
  wk4: string;
  wk12: string;
  revenue: string;
  orders: number;
}

export default function CohortsTab() {
  // Filters Config bar states
  const [cohortType, setCohortType] = useState("User Property");
  const [cohortDef, setCohortDef] = useState("Users with purchase > 0");
  const [dateRange, setDateRange] = useState("Last 6 Months");
  const [comparePeriod, setComparePeriod] = useState("Previous Period");
  const [granularity, setGranularity] = useState("Weekly");

  const [showFilters, setShowFilters] = useState(true);

  // Cohort Detail Drawer
  const [selectedCohortDrawer, setSelectedCohortDrawer] = useState<CohortDetailDrawer | null>(null);

  // Interactive Toast alert feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // KPI calculations
  const kpiRows = {
    totalCohorts: { value: "24", change: "↑ 33%", trend: "up" },
    totalUsers: { value: "2.48M", change: "↑ 18.6%", trend: "up" },
    avgSize: { value: "103.3K", change: "↑ 7.4%", trend: "up" },
    avgRetention: { value: "28.7%", change: "↑ 5.3%", trend: "up" },
    revenue: { value: "₹428.3 Cr", change: "↑ 12.8%", trend: "up" },
    healthyCohorts: { value: "11", change: "↑ 22%", trend: "up" }
  };

  // Matrix Heatmap Rows
  const matrixData = [
    { name: "May 06 - May 12", size: "128K", rates: [100, 46, 33, 25, 19, 12, 8, 5, 3, 2, 1] },
    { name: "May 13 - May 19", size: "122K", rates: [100, 44, 31, 24, 18, 11, 7, 5, 3, 2, 1] },
    { name: "May 20 - May 26", size: "134K", rates: [100, 42, 30, 23, 17, 10, 7, 4, 3, 2, 1] },
    { name: "May 27 - Jun 02", size: "140K", rates: [100, 41, 29, 22, 17, 10, 6, 4, 2, 1, 1] },
    { name: "Jun 03 - Jun 09", size: "146K", rates: [100, 42, 30, 23, 17, 11, 7, 5, 3, 2, 1] },
    { name: "Jun 10 - Jun 16", size: "152K", rates: [100, 40, 29, 21, 15, 9, 6, 4, 2, 1, 1] }
  ];

  // Decay line curve data
  const curveData = [
    { name: "Wk 0", current: 100, previous: 100, quarter: 100 },
    { name: "Wk 2", current: 33.0, previous: 29.5, quarter: 27.2 },
    { name: "Wk 4", current: 19.0, previous: 16.2, quarter: 14.5 },
    { name: "Wk 8", current: 8.0, previous: 6.8, quarter: 5.5 },
    { name: "Wk 12", current: 5.0, previous: 4.1, quarter: 3.2 },
    { name: "Wk 24", current: 1.0, previous: 0.8, quarter: 0.5 }
  ];

  // Row 4: Performance Summary
  const performanceData = [
    { cohort: "May 06 - May 12", users: "128K", w1: "46%", w4: "19%", w12: "8%", revenue: "₹24.3 Cr", orders: "2.8" },
    { cohort: "May 13 - May 19", users: "122K", w1: "44%", w4: "18%", w12: "7%", revenue: "₹22.1 Cr", orders: "2.6" },
    { cohort: "May 20 - May 26", users: "134K", w1: "42%", w4: "17%", w12: "7%", revenue: "₹25.4 Cr", orders: "2.4" },
    { cohort: "May 27 - Jun 02", users: "140K", w1: "41%", w4: "16%", w12: "6%", revenue: "₹23.9 Cr", orders: "2.3" },
    { cohort: "Jun 03 - Jun 09", users: "145K", w1: "42%", w4: "17%", w12: "7%", revenue: "₹27.2 Cr", orders: "2.5" },
    { cohort: "Jun 10 - Jun 16", users: "152K", w1: "40%", w4: "15%", w12: "6%", revenue: "₹29.4 Cr", orders: "2.2" }
  ];

  // Row 4: Segments
  const segmentData = [
    { name: "Premium Members", users: "420K", w1: "62%", w4: "32%", w12: "10%", w24: "2%", trend: "up" },
    { name: "Frequent Buyers", users: "610K", w1: "55%", w4: "28%", w12: "9%", w24: "2%", trend: "up" },
    { name: "Electronics Buyers", users: "380K", w1: "48%", w4: "24%", w12: "8%", w24: "2%", trend: "neutral" },
    { name: "New Users", users: "300K", w1: "32%", w4: "13%", w12: "4%", w24: "1%", trend: "down" }
  ];

  // Row 4: Drivers
  const driversData = [
    { driver: "First Purchase within 7 days", impact: "+35%", users: "1.2M" },
    { driver: "Added Wishlist", impact: "+22%", users: "980K" },
    { driver: "Used Coupon in First Order", impact: "+18%", users: "760K" },
    { driver: "Push Notifications Enabled", impact: "+16%", users: "1.4M" },
    { driver: "Multiple Category Browsing", impact: "+12%", users: "820K" }
  ];

  // Row 4: AI Insights
  const aiInsights = [
    {
      title: "May 06-May 12 cohort has 5.1% higher Week 4 retention.",
      desc: "Reason: Higher first purchase completion.",
      actionText: "View Analysis",
      type: "success"
    },
    {
      title: "Electronics buyers retention dropping after Week 8.",
      desc: "Reason: Higher return/refund rate increase.",
      actionText: "View Users",
      type: "warning"
    },
    {
      title: "Cohorts acquired via Festival Sale campaign retain 12% better.",
      desc: "Campaign running in May driving high quality users.",
      actionText: "View Campaigns",
      type: "insight"
    }
  ];

  // Churn predicted pie chart data
  const churnPieData = [
    { name: "High Risk", value: 22, fill: "#EF4444" },
    { name: "Medium Risk", value: 48, fill: "#F59E0B" },
    { name: "Low Risk", value: 30, fill: "#10B981" }
  ];

  const getHeatmapColor = (rate: number) => {
    if (rate === 100) return "bg-primary text-white border-primary/20 hover:scale-[1.03]";
    if (rate >= 40) return "bg-primary/80 text-text-bright border-primary/20 hover:scale-[1.03]";
    if (rate >= 30) return "bg-primary/60 text-text-bright border-primary/15 hover:scale-[1.03]";
    if (rate >= 20) return "bg-primary/45 text-text-bright border-primary/10 hover:scale-[1.03]";
    if (rate >= 15) return "bg-primary/30 text-text-bright border-border-subtle hover:scale-[1.03]";
    if (rate >= 10) return "bg-amber-500/25 text-amber-400 border-amber-500/10 hover:scale-[1.03]";
    if (rate >= 5) return "bg-red-500/20 text-red-400 border-red-500/10 hover:scale-[1.03]";
    return "bg-slate-900/60 text-text-muted border-border-subtle hover:scale-[1.03]";
  };

  const handleCellClick = (cohortName: string, size: string, rate: number, weekIdx: number) => {
    setSelectedCohortDrawer({
      cohortName,
      usersSize: size,
      activeUsers: `${(parseFloat(size) * (rate / 100)).toFixed(1)}K`,
      wk1: "46%",
      wk4: "19%",
      wk12: "8%",
      revenue: `₹${(24.3 + weekIdx * 0.8).toFixed(1)} Cr`,
      orders: Math.round(rate * 0.1) || 1
    });
  };

  return (
    <div className="space-y-6 pb-12 select-none relative">
      
      {/* Toast Alert Popups */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-950 border border-primary text-text-bright px-5 py-3.5 rounded-xl shadow-2xl z-50 flex items-center gap-3 max-w-sm animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="text-xs font-semibold leading-relaxed">{toastMessage}</div>
          <button onClick={() => setToastMessage(null)} className="text-text-muted hover:text-white ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= HEADER VIEW ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-subtle pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-bright flex items-center gap-2">
            Cohort Analysis
            <Sparkles className="w-5.5 h-5.5 text-primary" />
          </h1>
          <p className="text-xs text-text-muted">
            Analyze user groups, their behavior, retention, and performance over time.
          </p>
        </div>

        {/* Header CTA buttons */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => triggerToast("Cohort configuration builder opened.")}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Cohort
          </button>
          <button onClick={() => triggerToast("Cohort workspace configuration saved.")} className="px-3.5 py-1.5 bg-slate-900 border border-border-subtle rounded-lg text-xs font-semibold text-text-bright hover:border-slate-800 transition-colors cursor-pointer">
            Save View
          </button>
          <button onClick={() => triggerToast("Sharing link copied to clipboard.")} className="px-3.5 py-1.5 bg-slate-900 border border-border-subtle rounded-lg text-xs font-semibold text-text-bright hover:border-slate-800 transition-colors cursor-pointer">
            <Share2 className="w-4 h-4 text-accent-blue" /> Share
          </button>
          <button onClick={() => triggerToast("Exporting cohort lists as CSV...")} className="px-3.5 py-1.5 bg-slate-900 border border-border-subtle rounded-lg text-xs font-semibold text-text-bright hover:border-slate-800 transition-colors cursor-pointer">
            <Download className="w-4 h-4 text-accent-purple" /> Export
          </button>
          <button className="p-1.5 bg-slate-900 border border-border-subtle rounded-lg text-text-muted hover:text-white cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= FILTERS CONFIG BAR ================= */}
      <div className="glass-panel p-4.5 rounded-2xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3 items-center">
            
            {/* Cohort Type selector */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Cohort Type</span>
              <div className="relative">
                <select
                  value={cohortType}
                  onChange={(e) => setCohortType(e.target.value)}
                  className="pl-2.5 pr-8 py-1.5 text-xs bg-slate-950 border border-border-subtle rounded-lg text-text-bright font-semibold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="User Property">User Property</option>
                  <option value="Behavior Based">Behavior Based</option>
                  <option value="Event Based">Event Based</option>
                  <option value="Purchase Based">Purchase Based</option>
                  <option value="Revenue Based">Revenue Based</option>
                  <option value="Lifecycle Based">Lifecycle Based</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
              </div>
            </div>

            {/* Cohort Definition input selector */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Cohort Definition</span>
              <div className="relative">
                <select
                  value={cohortDef}
                  onChange={(e) => setCohortDef(e.target.value)}
                  className="pl-2.5 pr-8 py-1.5 text-xs bg-slate-950 border border-border-subtle rounded-lg text-primary font-bold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="Users with purchase > 0">Users with purchase &gt; 0</option>
                  <option value="Users who purchased Electronics">Users who purchased Electronics</option>
                  <option value="Users who completed signup">Users who completed signup</option>
                  <option value="Users active 5+ days">Users active 5+ days</option>
                  <option value="High value customers">High value customers</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
              </div>
            </div>

            {/* Date Range filter */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Date Range</span>
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="pl-2.5 pr-8 py-1.5 text-xs bg-slate-950 border border-border-subtle rounded-lg text-text-bright font-semibold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="Today">Today</option>
                  <option value="Last 7 Days">Last 7 Days</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Last 6 Months">Last 6 Months</option>
                  <option value="Custom">Custom</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
              </div>
            </div>

            {/* Compare filter */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Compare With</span>
              <div className="relative">
                <select
                  value={comparePeriod}
                  onChange={(e) => setComparePeriod(e.target.value)}
                  className="pl-2.5 pr-8 py-1.5 text-xs bg-slate-950 border border-border-subtle rounded-lg text-text-bright font-semibold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="Previous Period">Previous Period</option>
                  <option value="Previous Year">Previous Year</option>
                  <option value="No Comparison">No Comparison</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
              </div>
            </div>

            {/* Granularity filter */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Granularity</span>
              <div className="relative">
                <select
                  value={granularity}
                  onChange={(e) => setGranularity(e.target.value)}
                  className="pl-2.5 pr-8 py-1.5 text-xs bg-slate-950 border border-border-subtle rounded-lg text-text-bright font-semibold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
              </div>
            </div>

            {/* Add Filter CTA button */}
            <div className="flex flex-col justify-end h-11">
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  showFilters ? "bg-primary/10 border-primary/30 text-primary" : "bg-slate-900 border-border-subtle text-text-muted hover:text-white"
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Add Filter</span>
              </button>
            </div>

          </div>

          <div className="text-text-muted text-[10px] font-bold select-none border-l border-border-subtle pl-4 py-2 hidden sm:block">
            View Mode: <span className="text-primary">Cohort Workspace</span>
          </div>
        </div>

        {/* Filter Tag list display */}
        {showFilters && (
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-border-subtle/80 flex flex-wrap items-center gap-2 text-[10px] font-mono text-text-muted">
            <span className="font-bold text-primary">WHERE</span>
            <span className="bg-slate-900 px-2 py-0.5 border border-border-subtle rounded text-text-bright">CohortType = UserProperty</span>
            <span className="font-bold text-primary">AND</span>
            <span className="bg-slate-900 px-2 py-0.5 border border-border-subtle rounded text-text-bright">CohortDefinition = Purchase &gt; 0</span>
            <button onClick={() => setShowFilters(false)} className="ml-auto text-text-muted hover:text-white font-bold p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ================= 6 COHORT KPI CARDS ROW ================= */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {/* Card 1: Total Cohorts */}
        <div className="glass-panel p-4.5 rounded-xl border-l-2 border-l-primary flex flex-col justify-between h-[90px]">
          <div className="flex justify-between items-start text-[9px] text-text-muted font-bold uppercase tracking-wider">
            <span>Total Cohorts</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-1">
            <span className="text-xl font-black text-text-bright">{kpiRows.totalCohorts.value}</span>
            <span className="text-[9px] text-primary font-bold block mt-0.5">{kpiRows.totalCohorts.change} vs prev 6m</span>
          </div>
        </div>

        {/* Card 2: Total Users */}
        <div className="glass-panel p-4.5 rounded-xl flex flex-col justify-between h-[90px]">
          <div className="flex justify-between items-start text-[9px] text-text-muted font-bold uppercase tracking-wider">
            <span>Total Users</span>
            <UserCheck className="w-4 h-4 text-accent-blue" />
          </div>
          <div className="mt-1">
            <span className="text-xl font-black text-text-bright">{kpiRows.totalUsers.value}</span>
            <span className="text-[9px] text-primary font-bold block mt-0.5">{kpiRows.totalUsers.change} vs prev 6m</span>
          </div>
        </div>

        {/* Card 3: Avg Size */}
        <div className="glass-panel p-4.5 rounded-xl flex flex-col justify-between h-[90px]">
          <div className="flex justify-between items-start text-[9px] text-text-muted font-bold uppercase tracking-wider">
            <span>Avg Cohort Size</span>
            <Zap className="w-4 h-4 text-accent-purple" />
          </div>
          <div className="mt-1">
            <span className="text-xl font-black text-text-bright">{kpiRows.avgSize.value}</span>
            <span className="text-[9px] text-primary font-bold block mt-0.5">{kpiRows.avgSize.change} vs prev 6m</span>
          </div>
        </div>

        {/* Card 4: Avg Retention W4 */}
        <div className="glass-panel p-4.5 rounded-xl flex flex-col justify-between h-[90px]">
          <div className="flex justify-between items-start text-[9px] text-text-muted font-bold uppercase tracking-wider">
            <span>Avg Retention Week 4</span>
            <Percent className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-1">
            <span className="text-xl font-black text-text-bright">{kpiRows.avgRetention.value}</span>
            <span className="text-[9px] text-primary font-bold block mt-0.5">{kpiRows.avgRetention.change} vs prev 6m</span>
          </div>
        </div>

        {/* Card 5: Revenue */}
        <div className="glass-panel p-4.5 rounded-xl flex flex-col justify-between h-[90px]">
          <div className="flex justify-between items-start text-[9px] text-text-muted font-bold uppercase tracking-wider">
            <span>Revenue from Cohorts</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-1">
            <span className="text-xl font-black text-emerald-400">{kpiRows.revenue.value}</span>
            <span className="text-[9px] text-primary font-bold block mt-0.5">{kpiRows.revenue.change} vs prev 6m</span>
          </div>
        </div>

        {/* Card 6: Healthy Cohorts */}
        <div className="glass-panel p-4.5 rounded-xl flex flex-col justify-between h-[90px]">
          <div className="flex justify-between items-start text-[9px] text-text-muted font-bold uppercase tracking-wider">
            <span>Healthy Cohorts</span>
            <Award className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-1">
            <span className="text-xl font-black text-text-bright">{kpiRows.healthyCohorts.value}</span>
            <span className="text-[9px] text-primary font-bold block mt-0.5">{kpiRows.healthyCohorts.change} vs prev 6m</span>
          </div>
        </div>
      </div>

      {/* ================= ROW 3: HEATMAP MATRIX (70%) & LINE CURVES (30%) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        
        {/* Cohort Matrix Heatmap Table (70% width) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl flex flex-col gap-4 overflow-hidden h-fit">
          <div>
            <h3 className="text-sm font-bold text-text-bright uppercase">Cohort Retention Matrix</h3>
            <p className="text-[10px] text-text-muted mt-0.5 font-semibold">Percentage of users performing at least one event after cohort creation.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse select-none text-[10px] font-semibold">
              <thead>
                <tr className="bg-slate-950 border-b border-border-subtle text-text-muted uppercase text-[9px]">
                  <th className="py-2.5 px-3 min-w-[110px]">Cohort (Week Starting)</th>
                  <th className="py-2.5 px-2">Users</th>
                  <th className="py-2.5 px-1 text-center min-w-[34px]">Wk 0</th>
                  <th className="py-2.5 px-1 text-center min-w-[34px]">Wk 1</th>
                  <th className="py-2.5 px-1 text-center min-w-[34px]">Wk 2</th>
                  <th className="py-2.5 px-1 text-center min-w-[34px]">Wk 3</th>
                  <th className="py-2.5 px-1 text-center min-w-[34px]">Wk 4</th>
                  <th className="py-2.5 px-1 text-center min-w-[34px]">Wk 6</th>
                  <th className="py-2.5 px-1 text-center min-w-[34px]">Wk 8</th>
                  <th className="py-2.5 px-1 text-center min-w-[34px]">Wk 12</th>
                  <th className="py-2.5 px-1 text-center min-w-[34px]">Wk 16</th>
                  <th className="py-2.5 px-1 text-center min-w-[34px]">Wk 20</th>
                  <th className="py-2.5 px-1 text-center min-w-[34px]">Wk 24</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/50 text-text-bright font-mono">
                {matrixData.map((row) => (
                  <tr key={row.name} className="hover:bg-slate-900/10 transition-colors">
                    <td className="py-3 px-3 font-bold text-text-bright font-sans text-[10px]">{row.name}</td>
                    <td className="py-3 px-2 text-text-muted font-sans text-[10px]">{row.size}</td>
                    {row.rates.map((rate, colIdx) => (
                      <td
                        key={colIdx}
                        onClick={() => handleCellClick(row.name, row.size, rate, colIdx)}
                        className={`py-3 px-1 text-center font-black border border-bg-deep cursor-pointer transition-all duration-200 relative group ${getHeatmapColor(rate)}`}
                      >
                        {rate}%
                        
                        {/* Cell hover Popover details card */}
                        <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-950 border border-border-subtle p-3 rounded-xl shadow-2xl z-40 text-left text-[10px] space-y-1 font-sans font-medium">
                          <p className="text-text-bright font-bold border-b border-border-subtle pb-1">{row.name}</p>
                          <p className="text-text-muted mt-1">Cohort Users Size: <span className="text-text-bright font-mono font-bold">{row.size}</span></p>
                          <p className="text-text-muted">Week {colIdx} Retention: <span className="text-primary font-mono font-bold">{rate}%</span></p>
                          <p className="text-text-muted">Active Users Remaining: <span className="text-accent-blue font-mono font-bold">{(parseFloat(row.size) * (rate / 100)).toFixed(1)}K</span></p>
                          <p className="text-text-muted">Revenue Generated: <span className="text-emerald-400 font-mono font-bold">₹{(24.3 + colIdx * 0.8).toFixed(1)} Cr</span></p>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Average Row */}
                <tr className="bg-slate-950/60 font-bold border-t-2 border-border-subtle text-text-bright">
                  <td className="py-3.5 px-3 font-bold font-sans text-[10px]">Average</td>
                  <td className="py-3.5 px-2 text-text-muted font-sans text-[10px]">137K</td>
                  {[100, 42, 30, 23, 17, 10, 7, 5, 3, 2, 1].map((avg, i) => (
                    <td key={i} className="py-3.5 px-1 text-center font-black text-primary border border-bg-deep">
                      {avg}%
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Retention Curve Comparison (30% width) */}
        <div className="lg:col-span-3 glass-panel p-5 rounded-2xl flex flex-col justify-between gap-5 h-fit">
          <div>
            <h3 className="text-sm font-bold text-text-bright uppercase">Retention Curve Comparison</h3>
            <p className="text-[10px] text-text-muted mt-0.5 font-semibold">Line trend mapping decay path rates.</p>
          </div>

          {/* Line Chart */}
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={curveData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={8} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={8} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0b0f19", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  itemStyle={{ fontSize: "10px", color: "#f3f4f6" }}
                />
                <Legend verticalAlign="bottom" height={24} iconType="circle" wrapperStyle={{ fontSize: "8px" }} />
                <Line type="monotone" dataKey="current" name="May 06-12 (Current)" stroke="#10b981" strokeWidth={2.2} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="previous" name="Apr 06-12 (Previous)" stroke="#3b82f6" strokeWidth={1.8} strokeDasharray="3 3" dot={false} />
                <Line type="monotone" dataKey="quarter" name="Mar 06-12" stroke="#8b5cf6" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Curve summary pills */}
          <div className="grid grid-cols-5 gap-1 pt-3 border-t border-border-subtle text-center">
            <div className="bg-slate-900/30 p-1.5 rounded border border-border-subtle">
              <span className="text-[7px] text-text-muted block font-bold uppercase">Wk 1</span>
              <span className="text-[10px] font-black text-text-bright block font-mono">46%</span>
              <span className="text-[7px] text-primary block font-bold">↑ 6.2%</span>
            </div>
            <div className="bg-slate-900/30 p-1.5 rounded border border-border-subtle">
              <span className="text-[7px] text-text-muted block font-bold uppercase">Wk 4</span>
              <span className="text-[10px] font-black text-text-bright block font-mono">19%</span>
              <span className="text-[7px] text-primary block font-bold">↑ 5.1%</span>
            </div>
            <div className="bg-slate-900/30 p-1.5 rounded border border-border-subtle">
              <span className="text-[7px] text-text-muted block font-bold uppercase">Wk 8</span>
              <span className="text-[10px] font-black text-text-bright block font-mono">8%</span>
              <span className="text-[7px] text-primary block font-bold">↑ 1.8%</span>
            </div>
            <div className="bg-slate-900/30 p-1.5 rounded border border-border-subtle">
              <span className="text-[7px] text-text-muted block font-bold uppercase">Wk 12</span>
              <span className="text-[10px] font-black text-text-bright block font-mono">5%</span>
              <span className="text-[7px] text-primary block font-bold">↑ 0.9%</span>
            </div>
            <div className="bg-slate-900/30 p-1.5 rounded border border-border-subtle">
              <span className="text-[7px] text-text-muted block font-bold uppercase">Wk 24</span>
              <span className="text-[10px] font-black text-text-bright block font-mono">1%</span>
              <span className="text-[7px] text-primary block font-bold">↑ 0.2%</span>
            </div>
          </div>
        </div>

      </div>

      {/* ================= ROW 4: 4 ANALYTICS SUMMARY TABLES (4 COLUMNS GRID) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-2">
        
        {/* Col 1: Cohort Performance Summary */}
        <div className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between gap-3 overflow-hidden">
          <div>
            <h4 className="text-xs font-bold text-text-bright uppercase">Cohort Performance Summary</h4>
            <p className="text-[9px] text-text-muted mt-0.5 font-semibold">General cohort users volume, conversions, and revenues.</p>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-[10px] font-semibold">
              <thead>
                <tr className="border-b border-border-subtle text-text-muted uppercase text-[9px]">
                  <th className="py-2 pr-1">Cohort</th>
                  <th className="py-2 px-1 text-right">Users</th>
                  <th className="py-2 px-1 text-right">W1</th>
                  <th className="py-2 px-1 text-right">W4</th>
                  <th className="py-2 px-1 text-right">W12</th>
                  <th className="py-2 px-1 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/40 font-mono text-text-bright">
                {performanceData.slice(0, 4).map((row) => (
                  <tr key={row.cohort} className="hover:bg-slate-900/20">
                    <td className="py-2.5 pr-1 font-sans font-bold text-text-bright">{row.cohort.replace("May ", "")}</td>
                    <td className="py-2.5 px-1 text-right text-text-muted">{row.users}</td>
                    <td className="py-2.5 px-1 text-right text-primary">{row.w1}</td>
                    <td className="py-2.5 px-1 text-right text-primary">{row.w4}</td>
                    <td className="py-2.5 px-1 text-right text-primary">{row.w12}</td>
                    <td className="py-2.5 px-1 text-right text-emerald-400 font-bold">{row.revenue.replace(" Cr", "")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button onClick={() => triggerToast("Opening full performance details index...")} className="text-[9px] font-bold text-primary hover:underline text-left mt-2 block">
            View all cohorts →
          </button>
        </div>

        {/* Col 2: Retention by Segment */}
        <div className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between gap-3 overflow-hidden">
          <div>
            <h4 className="text-xs font-bold text-text-bright uppercase">Retention by Segment</h4>
            <p className="text-[9px] text-text-muted mt-0.5 font-semibold">Segment conversions and trend directions.</p>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-[10px] font-semibold">
              <thead>
                <tr className="border-b border-border-subtle text-text-muted uppercase text-[9px]">
                  <th className="py-2 pr-1">Segment</th>
                  <th className="py-2 px-1 text-right">WK1</th>
                  <th className="py-2 px-1 text-right">WK4</th>
                  <th className="py-2 px-1 text-right">WK12</th>
                  <th className="py-2 px-1 text-right">WK24</th>
                  <th className="py-2 pl-1 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/40 font-mono text-text-bright">
                {segmentData.map((row) => (
                  <tr key={row.name} className="hover:bg-slate-900/20">
                    <td className="py-2.5 pr-1 font-sans font-bold text-text-bright truncate max-w-[80px]">{row.name}</td>
                    <td className="py-2.5 px-1 text-right text-text-muted">{row.w1}</td>
                    <td className="py-2.5 px-1 text-right text-primary">{row.w4}</td>
                    <td className="py-2.5 px-1 text-right text-primary">{row.w12}</td>
                    <td className="py-2.5 px-1 text-right text-primary">{row.w24}</td>
                    <td className="py-2.5 pl-1 text-right font-bold">
                      {row.trend === "up" ? (
                        <span className="text-primary">↑</span>
                      ) : row.trend === "down" ? (
                        <span className="text-red-400">↓</span>
                      ) : (
                        <span className="text-text-muted">→</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={() => triggerToast("Opening user segments matrix deep dive...")} className="text-[9px] font-bold text-primary hover:underline text-left mt-2 block">
            View all segments →
          </button>
        </div>

        {/* Col 3: Retention Drivers */}
        <div className="glass-panel p-4.5 rounded-2xl flex flex-col justify-between gap-3 overflow-hidden">
          <div>
            <h4 className="text-xs font-bold text-text-bright uppercase">Top Retention Drivers</h4>
            <p className="text-[9px] text-text-muted mt-0.5 font-semibold">User actions correlated with higher retention outcomes.</p>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-[10px] font-semibold">
              <thead>
                <tr className="border-b border-border-subtle text-text-muted uppercase text-[9px]">
                  <th className="py-2 pr-1">Driver</th>
                  <th className="py-2 px-1 text-right">Impact</th>
                  <th className="py-2 pl-1 text-right">Affected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/40 text-text-bright">
                {driversData.slice(0, 4).map((row) => (
                  <tr key={row.driver} className="hover:bg-slate-900/20">
                    <td className="py-2.5 pr-1 font-bold text-text-bright truncate max-w-[120px]">{row.driver}</td>
                    <td className="py-2.5 px-1 text-right font-mono font-black text-primary">{row.impact}</td>
                    <td className="py-2.5 pl-1 text-right font-mono text-text-muted">{row.users}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={() => triggerToast("Opening behavioral triggers list...")} className="text-[9px] font-bold text-primary hover:underline text-left mt-2 block">
            View all drivers →
          </button>
        </div>

        {/* Col 4: AI Insights */}
        <div className="glass-panel p-4.5 rounded-2xl flex flex-col gap-3 overflow-hidden">
          <div>
            <h4 className="text-xs font-bold text-text-bright uppercase">AI Cohort Insights</h4>
            <p className="text-[9px] text-text-muted mt-0.5 font-semibold">Automated cohort quality diagnostics.</p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {aiInsights.map((insight, idx) => (
              <div 
                key={idx} 
                className={`p-3 border rounded-xl flex flex-col gap-1 text-[10px] leading-relaxed transition-all ${
                  insight.type === "warning" 
                    ? "bg-red-500/5 border-red-500/15" 
                    : insight.type === "success" 
                    ? "bg-emerald-500/5 border-emerald-500/15" 
                    : "bg-slate-900/60 border-border-subtle"
                }`}
              >
                <div className="flex justify-between items-start font-bold text-[10px]">
                  <span className={insight.type === "warning" ? "text-red-400" : "text-primary"}>
                    {insight.type === "warning" ? "⚠ Alert" : "💡 Opportunity"}
                  </span>
                  <button 
                    onClick={() => triggerToast(`Insight trigger active: ${insight.actionText}`)}
                    className="text-[9px] font-bold text-primary hover:underline cursor-pointer"
                  >
                    {insight.actionText}
                  </button>
                </div>
                <p className="text-text-bright font-bold mt-1 text-[10px] leading-snug">{insight.title}</p>
                <p className="text-[9px] text-text-muted font-semibold">{insight.desc}</p>
              </div>
            ))}
          </div>

          <button onClick={() => triggerToast("AI CoPilot chat console opened...")} className="text-[9px] font-bold text-primary hover:underline text-left mt-2 block">
            View all insights →
          </button>
        </div>

      </div>

      {/* ================= BOTTOM ROW: ACTIVITY DISTRIBUTION & CHURN PREDICTIONS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-2">
        
        {/* Left Column: Stacked distribution (60% width equivalent) */}
        <div className="lg:col-span-3 glass-panel p-5 rounded-2xl flex flex-col justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-text-bright uppercase">Cohort Activity Distribution (Week 4)</h4>
            <p className="text-[10px] text-text-muted mt-0.5 font-semibold">User behavioral state splits at Week 4 after acquisition.</p>
          </div>

          {/* Horizontal multi-stacked progress bar */}
          <div className="w-full h-5 rounded-lg overflow-hidden flex font-mono text-[8px] font-bold text-white shadow-inner select-none">
            <div className="bg-emerald-500 flex items-center justify-center" style={{ width: "38.6%" }} title="Purchased">38%</div>
            <div className="bg-cyan-500 flex items-center justify-center" style={{ width: "24.1%" }} title="Added Cart">24%</div>
            <div className="bg-blue-500 flex items-center justify-center" style={{ width: "16.3%" }} title="Viewed Product">16%</div>
            <div className="bg-amber-500 flex items-center justify-center" style={{ width: "8.7%" }} title="Searched">8%</div>
            <div className="bg-slate-800 flex items-center justify-center text-text-muted" style={{ width: "12.3%" }} title="Inactive">12%</div>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[9px] text-text-muted font-bold pt-1.5 border-t border-border-subtle/50">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded" /> Purchased (38.6%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-cyan-500 rounded" /> Added Cart (24.1%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded" /> Viewed Product (16.3%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-500 rounded" /> Searched (8.7%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-800 rounded" /> Inactive (12.3%)</span>
          </div>
        </div>

        {/* Right Column: Churn predictions donut + reasons (40% width equivalent) */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl flex flex-col gap-4">
          <div>
            <h4 className="text-xs font-bold text-text-bright uppercase">Churn Prediction (Next 30 Days)</h4>
            <p className="text-[10px] text-text-muted mt-0.5 font-semibold">User lists matching high risk predictive models.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 items-center justify-between">
            
            {/* Left at-risk stats */}
            <div className="space-y-3 flex-1 text-xs">
              <div className="bg-slate-900 border border-border-subtle/80 rounded-xl p-3 text-left">
                <span className="text-[9px] font-bold text-text-muted uppercase block">Users At Risk</span>
                <span className="text-lg font-black text-red-400 block mt-1 font-mono">1.8M</span>
                <span className="text-[8px] text-text-muted font-mono block mt-0.5">7.2% of total users</span>
              </div>
              <div className="bg-slate-900 border border-border-subtle/80 rounded-xl p-3 text-left">
                <span className="text-[9px] font-bold text-text-muted uppercase block">Potential Revenue Loss</span>
                <span className="text-lg font-black text-red-400 block mt-1 font-mono">₹36.4 Cr</span>
              </div>
            </div>

            {/* Middle churn reasons list */}
            <div className="text-[9px] text-text-muted font-semibold space-y-1.5 flex-1 min-w-[120px]">
              <span className="text-[8px] font-bold uppercase tracking-wider block mb-1">Top Churn Reasons</span>
              <div className="flex justify-between border-b border-border-subtle/50 pb-1"><span>No activity (14d):</span><span className="text-text-bright font-mono">45%</span></div>
              <div className="flex justify-between border-b border-border-subtle/50 pb-1"><span>Order return/refund:</span><span className="text-text-bright font-mono">25%</span></div>
              <div className="flex justify-between border-b border-border-subtle/50 pb-1"><span>Delivery issues:</span><span className="text-text-bright font-mono">18%</span></div>
              <div className="flex justify-between"><span>Price sensitivity:</span><span className="text-text-bright font-mono">12%</span></div>
            </div>

            {/* Right Donut chart */}
            <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={churnPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={22}
                    outerRadius={34}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {churnPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Legend overlay */}
              <div className="absolute text-[8px] text-center font-bold text-text-muted uppercase leading-none">
                <span className="text-xs font-black text-text-bright block">30D</span>
                Risk
              </div>
            </div>

          </div>

          <div className="flex justify-between items-center text-[10px] border-t border-border-subtle/50 pt-2.5">
            <div className="flex gap-2.5 text-[8px] font-bold text-text-muted">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> High Risk (22%)</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Medium (48%)</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Low (30%)</span>
            </div>
            <button onClick={() => triggerToast("Opening churn prediction analytics console...")} className="text-[10px] font-bold text-primary hover:underline cursor-pointer">
              View all at risk users →
            </button>
          </div>
        </div>

      </div>

      {/* ================= COHORT CELLS DRILLDOWN DRAWER VIEW ================= */}
      {selectedCohortDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex justify-end">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedCohortDrawer(null)} />
          
          <div className="relative w-full max-w-md bg-slate-950 border-l border-border-subtle h-full p-6 shadow-2xl flex flex-col gap-6 overflow-y-auto animate-slide-left">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-border-subtle pb-4.5">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase block">Cohort Detail Workspace</span>
                <h4 className="text-md font-black text-text-bright tracking-tight mt-1">{selectedCohortDrawer.cohortName}</h4>
              </div>
              <button 
                onClick={() => setSelectedCohortDrawer(null)}
                className="p-1 rounded bg-slate-900 border border-border-subtle text-text-muted hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div className="bg-slate-900 border border-border-subtle/80 rounded-xl p-3.5">
                <span className="text-[9px] font-bold text-text-muted uppercase block">Cohort Size</span>
                <span className="text-md font-black text-text-bright block mt-1 font-mono">{selectedCohortDrawer.usersSize} users</span>
              </div>
              <div className="bg-slate-900 border border-border-subtle/80 rounded-xl p-3.5">
                <span className="text-[9px] font-bold text-text-muted uppercase block">Active Retained Users</span>
                <span className="text-md font-black text-primary block mt-1 font-mono">{selectedCohortDrawer.activeUsers} users</span>
              </div>
              <div className="bg-slate-900 border border-border-subtle/80 rounded-xl p-3.5">
                <span className="text-[9px] font-bold text-text-muted uppercase block">Average Orders/User</span>
                <span className="text-md font-black text-text-bright block mt-1 font-mono">{selectedCohortDrawer.orders} orders</span>
              </div>
              <div className="bg-slate-900 border border-border-subtle/80 rounded-xl p-3.5">
                <span className="text-[9px] font-bold text-text-muted uppercase block">Total Influenced Revenue</span>
                <span className="text-md font-black text-emerald-400 block mt-1 font-mono">{selectedCohortDrawer.revenue}</span>
              </div>
            </div>

            {/* Retention Progression stats */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Retention Milestones Rate</span>
              <div className="bg-slate-900/60 p-4 border border-border-subtle rounded-xl space-y-3.5 text-xs font-semibold">
                <div className="flex justify-between border-b border-border-subtle/50 pb-2"><span>Week 1 Retention:</span><span className="text-primary font-mono font-bold">{selectedCohortDrawer.wk1}</span></div>
                <div className="flex justify-between border-b border-border-subtle/50 pb-2"><span>Week 4 Retention:</span><span className="text-primary font-mono font-bold">{selectedCohortDrawer.wk4}</span></div>
                <div className="flex justify-between"><span>Week 12 Retention:</span><span className="text-primary font-mono font-bold">{selectedCohortDrawer.wk12}</span></div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 pt-4 border-t border-border-subtle/80 mt-auto">
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => {
                    triggerToast(`Segment cohort created for ${selectedCohortDrawer.cohortName}.`);
                    setSelectedCohortDrawer(null);
                  }}
                  className="py-2 bg-slate-900 border border-border-subtle hover:border-slate-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Create Segment
                </button>
                <button 
                  onClick={() => {
                    triggerToast(`Triggering campaign scheduler for ${selectedCohortDrawer.cohortName} cohort.`);
                    setSelectedCohortDrawer(null);
                  }}
                  className="py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Send Campaign
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => {
                    triggerToast(`Exporting users list from ${selectedCohortDrawer.cohortName} cohort.`);
                    setSelectedCohortDrawer(null);
                  }}
                  className="py-2 bg-slate-900/40 border border-border-subtle text-text-muted hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                >
                  Export Users
                </button>
                <button 
                  onClick={() => {
                    triggerToast(`Reconstructing user journeys for ${selectedCohortDrawer.cohortName}.`);
                    setSelectedCohortDrawer(null);
                  }}
                  className="py-2 bg-slate-900/40 border border-border-subtle text-text-muted hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                >
                  Analyze Journey
                </button>
                <button 
                  onClick={() => {
                    triggerToast(`User directory filtered by ${selectedCohortDrawer.cohortName}.`);
                    setSelectedCohortDrawer(null);
                  }}
                  className="py-2 bg-slate-900/40 border border-border-subtle text-text-muted hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                >
                  View Users
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
