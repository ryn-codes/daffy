"use client";

import React, { useState } from "react";
import { 
  RefreshCw, 
  Filter,
  TrendingUp, 
  HelpCircle, 
  Sparkles, 
  Layers,
  ArrowRight,
  TrendingDown,
  Clock,
  DollarSign,
  Smartphone,
  Globe,
  Settings,
  MoreHorizontal,
  ChevronDown,
  Download,
  Share2,
  Bell,
  CheckCircle2,
  X,
  Play,
  AlertCircle,
  Bookmark,
  Users,
  Percent,
  Plus
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
  BarChart,
  Bar,
  Cell
} from "recharts";

interface DrilldownDetails {
  cohortName: string;
  weekName: string;
  users: string;
  rate: string;
  categories: string[];
  orders: number;
  ltv: string;
}

export default function RetentionTab() {
  // Config Bar States
  const [cohortType, setCohortType] = useState("Signup Date");
  const [dateRange, setDateRange] = useState("Last 6 Months");
  const [comparePeriod, setComparePeriod] = useState("Previous Period");
  const [returningBy, setReturningBy] = useState("Any Activity");
  const [selectedSegment, setSelectedSegment] = useState("All Users");
  const [selectedPlatform, setSelectedPlatform] = useState("All Platforms");

  // Advanced Filters display
  const [showFilters, setShowFilters] = useState(true);

  // Tab switcher
  const [activeWorkspace, setActiveWorkspace] = useState<"Cohort Matrix" | "Revenue & Churn" | "Drivers & Alerts">("Cohort Matrix");
  const [matrixViewType, setMatrixViewType] = useState<"heatmap" | "table" | "curve">("heatmap");

  // Cohort Cell Drilldown State
  const [drilldownCell, setDrilldownCell] = useState<DrilldownDetails | null>(null);

  // Action feedback alert
  const [toastText, setToastText] = useState<string | null>(null);

  const handleActionToast = (text: string) => {
    setToastText(text);
    setTimeout(() => setToastText(null), 5000);
  };

  // KPI calculations
  const kpis = {
    retention: { value: "42.8%", change: "+4.3%", trend: "up" },
    repeat: { value: "38.4M", change: "52.1%", trend: "up" },
    churn: { value: "12.8M", change: "↓ -2.4%", trend: "down" },
    nrr: { value: "118%", change: "+8.2%", trend: "up" },
    frequency: { value: "4.8", change: "+12.0%", trend: "up" },
    ltv: { value: "₹8,450", change: "+6.8%", trend: "up" }
  };

  // Retention Curve Line Chart Data (Week 0 to Week 12)
  const curveData = [
    { name: "Wk 0", current: 100, previous: 100 },
    { name: "Wk 1", current: 41.2, previous: 35.8 },
    { name: "Wk 2", current: 30.7, previous: 26.5 },
    { name: "Wk 3", current: 23.1, previous: 19.8 },
    { name: "Wk 4", current: 18.7, previous: 15.2 },
    { name: "Wk 5", current: 14.1, previous: 11.4 },
    { name: "Wk 6", current: 10.6, previous: 8.8 },
    { name: "Wk 7", current: 8.2, previous: 6.9 },
    { name: "Wk 8", current: 6.6, previous: 5.5 },
    { name: "Wk 9", current: 5.3, previous: 4.6 },
    { name: "Wk 10", current: 4.2, previous: 3.8 },
    { name: "Wk 11", current: 3.4, previous: 3.1 },
    { name: "Wk 12", current: 2.7, previous: 2.4 }
  ];

  // Cohort Heatmap Row Data
  const cohortsData = [
    { name: "May 06 - May 12", size: "1.2M", rates: [100, 45, 33, 25, 19, 15, 11, 9, 7, 6, 5, 4, 3] },
    { name: "May 13 - May 19", size: "1.1M", rates: [100, 44, 31, 24, 18, 14, 11, 8, 7, 5, 4, 3, 3] },
    { name: "May 20 - May 26", size: "1.3M", rates: [100, 42, 30, 23, 17, 13, 10, 8, 6, 5, 4, 3, 3] },
    { name: "May 27 - Jun 02", size: "1.4M", rates: [100, 41, 29, 22, 17, 13, 10, 7, 6, 5, 4, 4, -1] },
    { name: "Jun 03 - Jun 09", size: "1.5M", rates: [100, 41, 28, 21, 16, 12, 9, 7, 6, 5, 4, -1, -1] },
    { name: "Jun 10 - Jun 16", size: "1.6M", rates: [100, 40, 28, 21, 15, 11, 9, 6, 5, -1, -1, -1, -1] }
  ];

  // Segment Table Data
  const segmentsData = [
    { name: "Premium Users", size: "4.2M", w1: "62.4%", w4: "28.3%", w12: "5.4%", change: "↑ 8.2%", trend: "up" },
    { name: "Frequent Buyers", size: "6.8M", w1: "55.1%", w4: "24.2%", w12: "4.6%", change: "↑ 6.7%", trend: "up" },
    { name: "New Users", size: "10.5M", w1: "32.8%", w4: "13.2%", w12: "1.9%", change: "↑ 2.8%", trend: "up" },
    { name: "Electronics Enthusiasts", size: "3.9M", w1: "48.3%", w4: "22.7%", w12: "4.1%", change: "↑ 5.1%", trend: "up" },
    { name: "Fashion Shoppers", size: "3.2M", w1: "35.7%", w4: "14.6%", w12: "2.2%", change: "↑ 3.4%", trend: "up" },
    { name: "At Risk Users", size: "1.8M", w1: "18.8%", w4: "6.3%", w12: "0.8%", change: "↓ -1.2%", trend: "down" }
  ];

  // Platform Table Data
  const platformsData = [
    { name: "Android App", size: "14.2M", w1: "42.6%", w4: "19.1%", w12: "2.9%", change: "↑ 4.8%", trend: "up" },
    { name: "iOS App", size: "5.1M", w1: "46.8%", w4: "21.3%", w12: "3.5%", change: "↑ 5.2%", trend: "up" },
    { name: "Web", size: "4.3M", w1: "37.2%", w4: "16.4%", w12: "2.3%", change: "↑ 3.1%", trend: "up" },
    { name: "Flipkart Lite", size: "1.2M", w1: "29.5%", w4: "11.7%", w12: "1.5%", change: "↑ 2.6%", trend: "up" }
  ];

  // Reactivation Channels
  const channelsData = [
    { name: "Push Notification", size: "1.4M", impact: "↑ 22.6%" },
    { name: "Email Campaign", size: "820K", impact: "↑ 15.3%" },
    { name: "WhatsApp", size: "610K", impact: "↑ 10.2%" },
    { name: "SMS", size: "230K", impact: "↑ 5.8%" },
    { name: "In-App Banner", size: "120K", impact: "↑ 4.1%" }
  ];

  // AI Retention Insights
  const aiInsights = [
    { text: "Week 1 retention improved by 6.3%", cause: "Driven by improved onboarding flow for new users.", type: "success" },
    { text: "Drop in retention after Week 2 for new users", cause: "Potential issue in product discovery experience.", type: "warning" },
    { text: "Reactivation campaigns increased retention by 18%", cause: "Push & WhatsApp driving higher return frequency.", type: "success" }
  ];

  // Churn Reasons Chart Data
  const churnReasonsData = [
    { name: "No activity", value: 45, fill: "#3b82f6" },
    { name: "Delivery issues", value: 25, fill: "#f59e0b" },
    { name: "Price sensitivity", value: 18, fill: "#ec4899" },
    { name: "Customer service", value: 12, fill: "#8b5cf6" }
  ];

  // Helper to color heatmap cells
  const getHeatmapColor = (rate: number) => {
    if (rate === -1) return "bg-slate-950/20 text-text-muted/40 border-border-subtle/20 cursor-not-allowed";
    if (rate === 100) return "bg-primary text-white border-primary/20 hover:scale-[1.03]";
    if (rate >= 40) return "bg-primary/80 text-text-bright border-primary/20 hover:scale-[1.03]";
    if (rate >= 30) return "bg-primary/65 text-text-bright border-primary/15 hover:scale-[1.03]";
    if (rate >= 20) return "bg-primary/50 text-text-bright border-primary/10 hover:scale-[1.03]";
    if (rate >= 15) return "bg-primary/35 text-text-bright border-border-subtle hover:scale-[1.03]";
    if (rate >= 10) return "bg-amber-500/25 text-amber-400 border-amber-500/10 hover:scale-[1.03]";
    if (rate >= 5) return "bg-red-500/20 text-red-400 border-red-500/10 hover:scale-[1.03]";
    return "bg-slate-900/60 text-text-muted border-border-subtle hover:scale-[1.03]";
  };

  // Cohort Cell click trigger details
  const handleCellClick = (cohortName: string, weekIndex: number, rate: number) => {
    if (rate === -1) return;
    setDrilldownCell({
      cohortName,
      weekName: `Week ${weekIndex}`,
      users: `${(parseFloat(cohortsData.find(c => c.name === cohortName)?.size || "1") * (rate / 100)).toFixed(2)}M`,
      rate: `${rate}%`,
      categories: ["Electronics", "Fashion", "Grocery"],
      orders: Math.round(rate * 2.8),
      ltv: `₹${(8450 + weekIndex * 150).toLocaleString("en-IN")}`
    });
  };

  // Retention Health Score Circular Dial Variables
  const strokeRadius = 26;
  const strokeCircumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset = strokeCircumference - (72 / 100) * strokeCircumference;

  return (
    <div className="space-y-6 pb-12 select-none relative">
      
      {/* Toast Alert Popup */}
      {toastText && (
        <div className="fixed bottom-5 right-5 bg-slate-950 border border-primary text-text-bright px-5 py-3.5 rounded-xl shadow-2xl z-50 flex items-center gap-3 max-w-sm animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="text-xs font-semibold leading-relaxed">{toastText}</div>
          <button onClick={() => setToastText(null)} className="text-text-muted ml-auto hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= HEADER AND TITLE AREA ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-subtle pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-bright flex items-center gap-2">
            Retention Intelligence
            <Sparkles className="w-5.5 h-5.5 text-primary" />
          </h1>
          <p className="text-xs text-text-muted">
            Analyze customer stickiness, repeat behavior, cohort health, and long-term business value.
          </p>
        </div>

        {/* Top actions */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleActionToast("Retention view configuration saved successfully.")} className="px-3.5 py-1.5 bg-slate-900 border border-border-subtle rounded-lg text-xs font-semibold text-text-bright hover:border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer">
            Save View
          </button>
          <button onClick={() => handleActionToast("Retention report generated and downloaded.")} className="px-3.5 py-1.5 bg-slate-900 border border-border-subtle rounded-lg text-xs font-semibold text-text-bright hover:border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer">
            <Download className="w-4 h-4 text-accent-blue" /> Export Report
          </button>
          <button onClick={() => handleActionToast("Cohort generated for low-engagement users.")} className="px-3.5 py-1.5 bg-slate-900 border border-border-subtle rounded-lg text-xs font-semibold text-text-bright hover:border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer">
            <Layers className="w-4 h-4 text-accent-purple" /> Create Cohort
          </button>
          <button onClick={() => handleActionToast("Alert active: Week 4 retention drops below 15%")} className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 flex items-center gap-1.5 transition-colors cursor-pointer">
            <Bell className="w-4 h-4" /> Set Alert
          </button>
        </div>
      </div>

      {/* ================= CONFIGURATION SELECTORS BAR ================= */}
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
                  <option value="Signup Date">Signup Date</option>
                  <option value="First Purchase Date">First Purchase Date</option>
                  <option value="First Category Purchase">First Category Purchase</option>
                  <option value="Marketing Campaign">Marketing Campaign</option>
                  <option value="Experiment Exposure">Experiment Exposure</option>
                  <option value="Seller Interaction">Seller Interaction</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
              </div>
            </div>

            {/* Date Range selector */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Date Range</span>
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="pl-2.5 pr-8 py-1.5 text-xs bg-slate-950 border border-border-subtle rounded-lg text-text-bright font-semibold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Last 3 Months">Last 3 Months</option>
                  <option value="Last 6 Months">Last 6 Months</option>
                  <option value="Last 12 Months">Last 12 Months</option>
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
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
              </div>
            </div>

            {/* Returning Activity criteria */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Returning By</span>
              <div className="relative">
                <select
                  value={returningBy}
                  onChange={(e) => setReturningBy(e.target.value)}
                  className="pl-2.5 pr-8 py-1.5 text-xs bg-slate-950 border border-border-subtle rounded-lg text-primary font-bold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="Any Activity">Any Activity</option>
                  <option value="Purchase completed">Purchase completed</option>
                  <option value="Revenue Retention">Revenue Retention</option>
                  <option value="Category Retention">Category Retention</option>
                  <option value="Feature Retention">Feature Retention</option>
                  <option value="Subscription Retention">Subscription Retention</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
              </div>
            </div>

            {/* User segment selector */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Users Segment</span>
              <div className="relative">
                <select
                  value={selectedSegment}
                  onChange={(e) => setSelectedSegment(e.target.value)}
                  className="pl-2.5 pr-8 py-1.5 text-xs bg-slate-950 border border-border-subtle rounded-lg text-text-bright font-semibold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="All Users">All Users</option>
                  <option value="New Users">New Users</option>
                  <option value="Returning Users">Returning Users</option>
                  <option value="Premium Users">Premium Users</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
              </div>
            </div>

            {/* Platform filter selector */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Platform</span>
              <div className="relative">
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="pl-2.5 pr-8 py-1.5 text-xs bg-slate-950 border border-border-subtle rounded-lg text-text-bright font-semibold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="All Platforms">All Platforms</option>
                  <option value="Android App">Android App</option>
                  <option value="iOS App">iOS App</option>
                  <option value="Web">Web</option>
                  <option value="Flipkart Lite">Flipkart Lite</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
              </div>
            </div>

            {/* Advanced Filters button */}
            <div className="flex flex-col justify-end h-11">
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  showFilters ? "bg-primary/10 border-primary/30 text-primary" : "bg-slate-900 border-border-subtle text-text-muted hover:text-white"
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>

          </div>

          {/* Matrix view workspace switcher tabs */}
          <div className="flex bg-slate-950 p-1.5 rounded-lg border border-border-subtle self-start md:self-center">
            {(["Cohort Matrix", "Revenue & Churn", "Drivers & Alerts"] as const).map(workspace => (
              <button
                key={workspace}
                onClick={() => setActiveWorkspace(workspace)}
                className={`px-3.5 py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
                  activeWorkspace === workspace 
                    ? "bg-primary text-white shadow-sm" 
                    : "text-text-muted hover:text-text-bright"
                }`}
              >
                {workspace}
              </button>
            ))}
          </div>
        </div>

        {/* Filter criteria list tag block */}
        {showFilters && (
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-border-subtle/80 flex flex-wrap items-center gap-2 text-[10px] font-mono text-text-muted">
            <span className="font-bold text-primary">WHERE</span>
            <span className="bg-slate-900 px-2 py-0.5 border border-border-subtle rounded text-text-bright">CohortType = SignupDate</span>
            <span className="font-bold text-primary">AND</span>
            <span className="bg-slate-900 px-2 py-0.5 border border-border-subtle rounded text-text-bright">RetentionAction = AnyActivity</span>
            <span className="font-bold text-primary">AND</span>
            <span className="bg-slate-900 px-2 py-0.5 border border-border-subtle rounded text-text-bright">Segment = AllUsers</span>
            <button onClick={() => setShowFilters(false)} className="ml-auto text-text-muted hover:text-white font-bold p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ================= RETENTION HEALTH KPI COMMAND CENTER ================= */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {/* KPI 1: 30D Retention */}
        <div className="glass-panel p-4 rounded-xl border-l-2 border-l-primary flex flex-col justify-between">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Average Retention (Week 1)</span>
          <div className="mt-2">
            <span className="text-xl font-black text-text-bright">{kpis.retention.value}</span>
            <span className="text-[9px] font-bold text-primary block mt-0.5">↑ 6.3% vs prev</span>
          </div>
        </div>

        {/* KPI 2: Week 4 Retention */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Average Retention (Week 4)</span>
          <div className="mt-2">
            <span className="text-xl font-black text-text-bright">18.7%</span>
            <span className="text-[9px] font-bold text-primary block mt-0.5">↑ 3.8% vs prev</span>
          </div>
        </div>

        {/* KPI 3: Week 12 Retention */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Average Retention (Week 12)</span>
          <div className="mt-2">
            <span className="text-xl font-black text-text-bright">7.4%</span>
            <span className="text-[9px] font-bold text-primary block mt-0.5">↑ 1.9% vs prev</span>
          </div>
        </div>

        {/* KPI 4: Users in Cohorts */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Users in Cohorts</span>
          <div className="mt-2">
            <span className="text-xl font-black text-text-bright">24.8M</span>
            <span className="text-[9px] font-bold text-primary block mt-0.5">↑ 12.6% vs prev</span>
          </div>
        </div>

        {/* KPI 5: Reactivated Users */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Reactivated Users</span>
          <div className="mt-2">
            <span className="text-xl font-black text-text-bright">3.2M</span>
            <span className="text-[9px] font-bold text-primary block mt-0.5">↑ 15.3% vs prev</span>
          </div>
        </div>

        {/* KPI 6: Churn Rate */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Churn Rate (90 Days)</span>
          <div className="mt-2">
            <span className="text-xl font-black text-amber-500">68.3%</span>
            <span className="text-[9px] font-bold text-primary block mt-0.5">↓ -2.1% vs prev</span>
          </div>
        </div>
      </div>

      {/* ================= WORKSPACE SUBTABS ================= */}
      <div className="min-h-[400px]">
        
        {/* ================= WORKSPACE: COHORT MATRIX ================= */}
        {activeWorkspace === "Cohort Matrix" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Heatmap Grid Matrix */}
            <div className="lg:col-span-2 glass-panel p-5 rounded-2xl flex flex-col gap-4 overflow-hidden h-fit">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-border-subtle pb-4">
                <div>
                  <h3 className="text-sm font-bold text-text-bright uppercase">Retention Cohort Matrix</h3>
                  <p className="text-[10px] text-text-muted mt-0.5 font-semibold">Each cell represents the % of active users in that week after initial signup.</p>
                </div>

                {/* Grid Heatmap view toggles */}
                <div className="flex bg-slate-950 p-1 rounded-lg border border-border-subtle">
                  {([
                    { id: "heatmap", label: "Heatmap" },
                    { id: "table", label: "Table view" }
                  ] as const).map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setMatrixViewType(mode.id as any)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                        matrixViewType === mode.id || (matrixViewType === "curve" && mode.id === "heatmap")
                          ? "bg-primary text-white" 
                          : "text-text-muted hover:text-white"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Heatmap Grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse select-none text-[10px] font-semibold">
                  <thead>
                    <tr className="bg-slate-950 border-b border-border-subtle text-text-muted uppercase text-[9px]">
                      <th className="py-2.5 px-3 min-w-[100px]">Cohort Week</th>
                      <th className="py-2.5 px-3">Size</th>
                      {Array.from({ length: 13 }, (_, i) => (
                        <th key={i} className="py-2.5 px-1.5 text-center min-w-[36px]">Wk {i}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle/50 text-text-bright font-mono">
                    {cohortsData.map((row) => (
                      <tr key={row.name} className="hover:bg-slate-900/10 transition-colors">
                        <td className="py-3 px-3 font-bold text-text-bright font-sans text-[10px]">{row.name}</td>
                        <td className="py-3 px-3 text-text-muted font-sans text-[10px]">{row.size}</td>
                        {row.rates.map((rate, colIdx) => (
                          <td
                            key={colIdx}
                            onClick={() => handleCellClick(row.name, colIdx, rate)}
                            className={`py-3 px-1 text-center font-black border border-bg-deep cursor-pointer transition-all duration-200 ${getHeatmapColor(rate)}`}
                          >
                            {rate === -1 ? "—" : `${rate}%`}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {/* Average Row */}
                    <tr className="bg-slate-950/60 font-bold border-t-2 border-border-subtle text-text-bright">
                      <td className="py-3.5 px-3 font-bold font-sans text-[10px]">Average Retention</td>
                      <td className="py-3.5 px-3 text-text-muted font-sans text-[10px]">24.8M</td>
                      {[100, 41.2, 30.7, 23.1, 18.7, 14.1, 10.6, 8.2, 6.6, 5.3, 4.2, 3.4, 2.7].map((avg, i) => (
                        <td key={i} className="py-3.5 px-1 text-center font-black text-primary border border-bg-deep">
                          {avg}%
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Decay line curve */}
            <div className="lg:col-span-1 glass-panel p-5 rounded-2xl flex flex-col justify-between gap-5 h-fit">
              <div>
                <h3 className="text-sm font-bold text-text-bright uppercase">Retention Curve (Average)</h3>
                <p className="text-[10px] text-text-muted mt-0.5 font-semibold">Visualizing user activity drops over weeks.</p>
              </div>

              {/* Curve chart */}
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
                    <Line type="monotone" dataKey="current" name="All Users (Current)" stroke="#10b981" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                    <Line type="monotone" dataKey="previous" name="All Users (Previous)" stroke="#3b82f6" strokeWidth={1.8} strokeDasharray="3 3" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Curve Summary Pills */}
              <div className="grid grid-cols-4 gap-2 border-t border-border-subtle pt-4 text-center">
                <div className="bg-slate-900/40 p-2 rounded border border-border-subtle">
                  <span className="text-[8px] text-text-muted block uppercase font-bold">Wk 1</span>
                  <span className="text-xs font-black text-text-bright block font-mono">41.2%</span>
                  <span className="text-[8px] text-primary block font-bold">↑ 6.3%</span>
                </div>
                <div className="bg-slate-900/40 p-2 rounded border border-border-subtle">
                  <span className="text-[8px] text-text-muted block uppercase font-bold">Wk 4</span>
                  <span className="text-xs font-black text-text-bright block font-mono">18.7%</span>
                  <span className="text-[8px] text-primary block font-bold">↑ 3.8%</span>
                </div>
                <div className="bg-slate-900/40 p-2 rounded border border-border-subtle">
                  <span className="text-[8px] text-text-muted block uppercase font-bold">Wk 8</span>
                  <span className="text-xs font-black text-text-bright block font-mono">6.6%</span>
                  <span className="text-[8px] text-primary block font-bold">↑ 1.6%</span>
                </div>
                <div className="bg-slate-900/40 p-2 rounded border border-border-subtle">
                  <span className="text-[8px] text-text-muted block uppercase font-bold">Wk 12</span>
                  <span className="text-xs font-black text-text-bright block font-mono">2.7%</span>
                  <span className="text-[8px] text-primary block font-bold">↑ 0.9%</span>
                </div>
              </div>
            </div>

            {/* Bottom Card Deck Grid Row */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6 mt-2">
              
              {/* Card 1: Segments */}
              <div className="glass-panel p-4.5 rounded-2xl flex flex-col gap-3">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Retention by Segment</span>
                <div className="space-y-2 text-xs flex-1">
                  {segmentsData.slice(0, 4).map((seg) => (
                    <div key={seg.name} className="flex justify-between py-1.5 border-b border-border-subtle last:border-b-0">
                      <span className="text-text-bright font-bold truncate max-w-[120px]">{seg.name}</span>
                      <div className="flex gap-2.5 font-mono text-[10px]">
                        <span className="text-text-muted">W1: {seg.w1}</span>
                        <span className="text-primary font-bold">W4: {seg.w4}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleActionToast("Opening segments breakdown deep dive...")} className="text-[10px] font-bold text-primary hover:underline text-left mt-2">
                  View all segments →
                </button>
              </div>

              {/* Card 2: Platforms */}
              <div className="glass-panel p-4.5 rounded-2xl flex flex-col gap-3">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Retention by Platform</span>
                <div className="space-y-2 text-xs flex-1">
                  {platformsData.map((plat) => (
                    <div key={plat.name} className="flex justify-between py-1.5 border-b border-border-subtle last:border-b-0">
                      <span className="text-text-bright font-bold">{plat.name}</span>
                      <div className="flex gap-2.5 font-mono text-[10px]">
                        <span className="text-text-muted">W1: {plat.w1}</span>
                        <span className="text-primary font-bold">W4: {plat.w4}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleActionToast("Opening platform details matrix...")} className="text-[10px] font-bold text-primary hover:underline text-left mt-2">
                  View all platforms →
                </button>
              </div>

              {/* Card 3: Reactivation Channels */}
              <div className="glass-panel p-4.5 rounded-2xl flex flex-col gap-3">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Top Reactivation Channels</span>
                <div className="space-y-2 text-xs flex-1">
                  {channelsData.map((ch) => (
                    <div key={ch.name} className="flex justify-between py-1.5 border-b border-border-subtle last:border-b-0">
                      <span className="text-text-bright font-bold">{ch.name}</span>
                      <div className="flex gap-2.5 font-mono text-[10px]">
                        <span className="text-text-muted">{ch.size}</span>
                        <span className="text-primary font-bold">{ch.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleActionToast("Opening reactivation logs dashboard...")} className="text-[10px] font-bold text-primary hover:underline text-left mt-2">
                  View all channels →
                </button>
              </div>

              {/* Card 4: AI insights */}
              <div className="glass-panel p-4.5 rounded-2xl flex flex-col gap-3">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">AI Retention Insights</span>
                <div className="space-y-3 flex-grow">
                  {aiInsights.map((item, idx) => (
                    <div key={idx} className="text-[10px] bg-slate-900/40 p-2.5 border border-border-subtle rounded-xl flex flex-col gap-1">
                      <p className="text-text-bright font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {item.text}
                      </p>
                      <p className="text-[9px] text-text-muted leading-relaxed font-semibold">{item.cause}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer strip: Cohort Activity Distribution & health score */}
              <div className="col-span-1 md:col-span-2 glass-panel p-5 rounded-2xl flex flex-col justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Cohort Activity Distribution (Week 4)</span>
                  <p className="text-[9px] text-text-muted mt-0.5">Average customer active logins ratio within Wk 4 cohort boundaries.</p>
                </div>
                
                {/* Horizontal multi progress bar */}
                <div className="w-full h-5 rounded-lg overflow-hidden flex font-mono text-[8px] font-bold text-white shadow-inner">
                  <div className="bg-emerald-500 flex items-center justify-center" style={{ width: "42.3%" }} title="Active 1+ Day">42%</div>
                  <div className="bg-cyan-500 flex items-center justify-center" style={{ width: "23.1%" }} title="Active 2-3 Days">23%</div>
                  <div className="bg-blue-500 flex items-center justify-center" style={{ width: "12.4%" }} title="Active 4-6 Days">12%</div>
                  <div className="bg-amber-500 flex items-center justify-center" style={{ width: "8.6%" }} title="Active 7+ Days">8%</div>
                  <div className="bg-slate-800 flex items-center justify-center text-text-muted" style={{ width: "13.6%" }} title="Inactive">13%</div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-text-muted font-bold">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded" /> Active 1+ Day (42.3%)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-cyan-500 rounded" /> Active 2-3 Days (23.1%)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded" /> Active 4-6 Days (12.4%)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-500 rounded" /> Active 7+ Days (8.6%)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-800 rounded" /> Inactive (13.6%)</span>
                </div>
              </div>

              {/* Health Score Circular Dial */}
              <div className="col-span-1 md:col-span-2 glass-panel p-5 rounded-2xl flex items-center gap-6 justify-between">
                <div className="space-y-1 text-left">
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Retention Health Score</h4>
                  <p className="text-xl font-black text-text-bright">72/100 <span className="text-xs text-primary font-bold">Good</span></p>
                  <p className="text-[10px] text-text-muted font-semibold leading-relaxed">
                    ↑ 6 points vs previous period. Calculated from repeat frequencies, LTV expansion, and churn controls.
                  </p>
                </div>

                {/* SVG Dial */}
                <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r={strokeRadius} stroke="rgba(255,255,255,0.03)" strokeWidth="4" fill="transparent" />
                    <circle cx="32" cy="32" r={strokeRadius} stroke="#10b981" strokeWidth="4" fill="transparent" strokeDasharray={strokeCircumference} strokeDashoffset={strokeDashoffset} />
                  </svg>
                  <span className="absolute text-xs font-black text-text-bright">72%</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= WORKSPACE: REVENUE & CHURN ================= */}
        {activeWorkspace === "Revenue & Churn" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Revenue Retention Heatmap Grid */}
            <div className="lg:col-span-2 glass-panel p-5 rounded-2xl flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-bold text-text-bright uppercase">Revenue Cohort Matrix</h3>
                <p className="text-xs text-text-muted">Cohort-to-cohort monthly GMV contribution and revenue expansion levels.</p>
              </div>

              {/* Revenue Matrix table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950 border-b border-border-subtle text-text-muted font-semibold uppercase">
                      <th className="py-2.5 px-4">Cohort Month</th>
                      <th className="py-2.5 px-2 text-center">Month 0</th>
                      <th className="py-2.5 px-2 text-center">Month 1</th>
                      <th className="py-2.5 px-2 text-center">Month 2</th>
                      <th className="py-2.5 px-2 text-center">Month 3</th>
                      <th className="py-2.5 px-2 text-center">Month 4</th>
                      <th className="py-2.5 px-2 text-center">Month 5</th>
                      <th className="py-2.5 px-2 text-center">Month 6</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle/50 font-mono text-text-bright font-bold">
                    {[
                      { name: "January Cohort", values: ["₹100 Cr", "₹85 Cr", "₹78 Cr", "₹62 Cr", "₹55 Cr", "₹50 Cr", "₹48 Cr"] },
                      { name: "February Cohort", values: ["₹120 Cr", "₹95 Cr", "₹88 Cr", "₹75 Cr", "₹68 Cr", "₹60 Cr", "—"] },
                      { name: "March Cohort", values: ["₹140 Cr", "₹115 Cr", "₹102 Cr", "₹88 Cr", "₹78 Cr", "—", "—"] },
                      { name: "April Cohort", values: ["₹150 Cr", "₹122 Cr", "₹110 Cr", "₹94 Cr", "—", "—", "—"] }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/15 transition-colors">
                        <td className="py-3 px-4 font-sans font-semibold text-text-bright">{row.name}</td>
                        {row.values.map((val, i) => (
                          <td key={i} className="py-3 px-2 text-center">
                            <span className={val.includes("—") ? "text-text-muted/40 font-normal" : "text-text-bright"}>
                              {val}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Expansion vs Gross metrics row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border-subtle pt-4 mt-2">
                <div className="bg-slate-900/40 p-3.5 border border-border-subtle rounded-xl text-center">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Net Revenue Retention (NRR)</span>
                  <span className="text-xl font-black text-emerald-400 block mt-1">118%</span>
                </div>
                <div className="bg-slate-900/40 p-3.5 border border-border-subtle rounded-xl text-center">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Gross Rev Retention (GRR)</span>
                  <span className="text-xl font-black text-text-bright block mt-1">78%</span>
                </div>
                <div className="bg-slate-900/40 p-3.5 border border-border-subtle rounded-xl text-center">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Expansion Upsell GMV</span>
                  <span className="text-xl font-black text-primary block mt-1">+22%</span>
                </div>
              </div>
            </div>

            {/* Right Column: Churn Prediction and Health segments */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              {/* Churn Pred Card */}
              <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 h-fit">
                <div>
                  <h3 className="text-sm font-bold text-text-bright uppercase">Customer Churn Prediction</h3>
                  <p className="text-[10px] text-text-muted mt-0.5">Automated predictive churn intelligence metrics.</p>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-slate-900 border border-border-subtle rounded-xl p-3.5 text-center">
                    <span className="text-[9px] font-bold text-text-muted block uppercase">High Risk Users</span>
                    <span className="text-lg font-black text-red-400 block mt-1.5">8.4M</span>
                  </div>
                  <div className="bg-slate-900 border border-border-subtle rounded-xl p-3.5 text-center">
                    <span className="text-[9px] font-bold text-text-muted block uppercase">Potential GMV Loss</span>
                    <span className="text-lg font-black text-red-400 block mt-1.5">₹82 Cr</span>
                  </div>
                </div>

                {/* Churn Reasons Recharts BarChart */}
                <div className="h-32 w-full mt-2 select-none">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={churnReasonsData} layout="vertical" margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={8} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0b0f19", borderColor: "rgba(255,255,255,0.1)", borderRadius: "6px" }}
                        itemStyle={{ fontSize: "9px", color: "#f3f4f6" }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} maxBarSize={15}>
                        {churnReasonsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Health Segments categorization */}
              <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 h-fit">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Cohort Health Classification</span>
                
                <div className="space-y-3.5 text-xs">
                  <div className="pb-3 border-b border-border-subtle flex justify-between items-start gap-4">
                    <div>
                      <span className="font-bold text-primary block">Champions</span>
                      <p className="text-[10px] text-text-muted leading-relaxed mt-0.5">Highly active customers purchasing regularly.</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold font-mono">Healthy</span>
                  </div>

                  <div className="pb-3 border-b border-border-subtle flex justify-between items-start gap-4">
                    <div>
                      <span className="font-bold text-text-bright block">Loyal Customers</span>
                      <p className="text-[10px] text-text-muted leading-relaxed mt-0.5">Consistent repeat buyers responding to offers.</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-border-subtle text-text-muted text-[9px] font-bold font-mono">Stable</span>
                  </div>

                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="font-bold text-red-400 block">Potential Churn</span>
                      <p className="text-[10px] text-text-muted leading-relaxed mt-0.5">Declining activity frequency over subsequent weeks.</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-bold font-mono">At Risk</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= WORKSPACE: DRIVERS, FUNNELS & ALERTS ================= */}
        {activeWorkspace === "Drivers & Alerts" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Retention Drivers (Positive & Negative) */}
            <div className="lg:col-span-2 glass-panel p-5 rounded-2xl flex flex-col gap-5">
              <div>
                <h3 className="text-sm font-bold text-text-bright uppercase">Retention Driver Analysis</h3>
                <p className="text-xs text-text-muted">Behavioral triggers that correlate positively or negatively with retention stability.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Positive Drivers */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Positive Correlation Triggers</span>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="font-bold text-text-bright block">Wishlist additions</span>
                        <p className="text-[9px] text-text-muted mt-0.5">Items saved within first 3 days.</p>
                      </div>
                      <span className="font-black text-primary font-mono">+22% retention</span>
                    </div>

                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="font-bold text-text-bright block">Notification enrollment</span>
                        <p className="text-[9px] text-text-muted mt-0.5">Push notification enabled on app launch.</p>
                      </div>
                      <span className="font-black text-primary font-mono">+18% retention</span>
                    </div>

                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="font-bold text-text-bright block">Early order checkout</span>
                        <p className="text-[9px] text-text-muted mt-0.5">Purchase completed within first 7 days.</p>
                      </div>
                      <span className="font-black text-primary font-mono">+35% retention</span>
                    </div>
                  </div>
                </div>

                {/* Negative Drivers */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">Negative Correlation Triggers</span>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-red-500/5 border border-red-500/15 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="font-bold text-text-bright block">Delivery latency delays</span>
                        <p className="text-[9px] text-text-muted mt-0.5">SLA delivery time exceeding 5 days.</p>
                      </div>
                      <span className="font-black text-red-400 font-mono">-28% retention</span>
                    </div>

                    <div className="p-3 bg-red-500/5 border border-red-500/15 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="font-bold text-text-bright block">Transaction checkout failure</span>
                        <p className="text-[9px] text-text-muted mt-0.5">Payment gateway fails on first order.</p>
                      </div>
                      <span className="font-black text-red-400 font-mono">-15% retention</span>
                    </div>

                    <div className="p-3 bg-red-500/5 border border-red-500/15 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="font-bold text-text-bright block">Order refund returns</span>
                        <p className="text-[9px] text-text-muted mt-0.5">First order returned within 30 days.</p>
                      </div>
                      <span className="font-black text-red-400 font-mono">-22% retention</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lifecycle Retention Funnel */}
              <div className="border-t border-border-subtle pt-4 mt-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-4">Customer Lifecycle Retention Funnel</span>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2 text-xs text-center font-bold">
                  {[
                    { label: "New User", val: "100M" },
                    { label: "First View", val: "72M" },
                    { label: "First Cart", val: "34M" },
                    { label: "First Purchase", val: "18M" },
                    { label: "Second Purchase", val: "9M" },
                    { label: "Loyal Customer", val: "4M" }
                  ].map((item, idx) => (
                    <React.Fragment key={idx}>
                      <div className="bg-slate-900 border border-border-subtle/80 p-3 rounded-xl flex-1 max-w-[120px] select-none">
                        <span className="block text-[9px] text-text-muted uppercase">{item.label}</span>
                        <span className="block text-sm font-black text-text-bright mt-1">{item.val}</span>
                      </div>
                      {idx < 5 && <ArrowRight className="w-4 h-4 text-text-muted/30 hidden md:block" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Experiment Impact & Active Alerts */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              {/* Experiment Impact Card */}
              <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-bold text-text-bright uppercase flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-primary" /> Experiment Impact
                  </h3>
                  <p className="text-[10px] text-text-muted mt-0.5 font-semibold">Correlating testing variants with long-term retention change.</p>
                </div>

                <div className="bg-slate-900/60 p-3.5 border border-border-subtle rounded-xl space-y-2 text-xs">
                  <span className="font-bold text-text-bright block truncate">Personalized Homepage layout</span>
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-primary font-bold">Variant B</span>
                    <span className="text-emerald-400 font-bold">+7.8% 30D retention</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-text-muted pt-1 border-t border-border-subtle/40">
                    <span>Repeat Orders: +12%</span>
                    <span>GMV Influence: +₹15 Cr</span>
                  </div>
                </div>
              </div>

              {/* Retention Alerts */}
              <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-bold text-text-bright uppercase flex items-center gap-1.5">
                    <AlertCircle className="w-4.5 h-4.5 text-red-400" /> Retention Alerts
                  </h3>
                  <p className="text-[10px] text-text-muted mt-0.5 font-semibold">Active warning signals flagging retention drops.</p>
                </div>

                <div className="p-3.5 bg-red-500/5 border border-red-500/15 rounded-xl text-xs space-y-1.5">
                  <p className="font-bold text-red-400">Android app retention dropped 5%</p>
                  <p className="text-[9px] text-text-muted leading-relaxed font-semibold">
                    App v12.4 checkout page crash spike affecting 1.2M users on low-end device hardware configurations.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ================= COHORT CELLS DRILLDOWN DIALOG MODAL ================= */}
      {drilldownCell && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setDrilldownCell(null)} />
          
          <div className="relative w-full max-w-md bg-slate-950 border border-border-subtle rounded-2xl p-6 shadow-2xl space-y-5 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-border-subtle pb-4">
              <div>
                <span className="text-[9px] font-bold text-primary uppercase block">Cohort Details Drill Down</span>
                <h4 className="text-sm font-black text-text-bright mt-1">{drilldownCell.cohortName} • {drilldownCell.weekName}</h4>
              </div>
              <button 
                onClick={() => setDrilldownCell(null)}
                className="p-1 rounded bg-slate-900 border border-border-subtle text-text-muted hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Metrics */}
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div className="bg-slate-900 border border-border-subtle rounded-xl p-3.5">
                <span className="text-[9px] font-bold text-text-muted uppercase block">Retained Users</span>
                <span className="text-md font-black text-text-bright block mt-1 font-mono">{drilldownCell.users}</span>
              </div>
              <div className="bg-slate-900 border border-border-subtle rounded-xl p-3.5">
                <span className="text-[9px] font-bold text-text-muted uppercase block">Retention Rate</span>
                <span className="text-md font-black text-primary block mt-1 font-mono">{drilldownCell.rate}</span>
              </div>
              <div className="bg-slate-900 border border-border-subtle rounded-xl p-3.5">
                <span className="text-[9px] font-bold text-text-muted uppercase block">Average Orders</span>
                <span className="text-md font-black text-text-bright block mt-1 font-mono">{drilldownCell.orders}</span>
              </div>
              <div className="bg-slate-900 border border-border-subtle rounded-xl p-3.5">
                <span className="text-[9px] font-bold text-text-muted uppercase block">Average LTV</span>
                <span className="text-md font-black text-emerald-400 block mt-1 font-mono">{drilldownCell.ltv}</span>
              </div>
            </div>

            {/* Top Categories */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Top Categories Purchased</span>
              <div className="flex flex-wrap gap-2">
                {drilldownCell.categories.map((cat) => (
                  <span key={cat} className="px-2.5 py-1 rounded bg-slate-900 border border-border-subtle font-bold text-text-bright">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions button */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border-subtle">
              <button 
                onClick={() => {
                  handleActionToast(`Campaign scheduled for ${drilldownCell.cohortName} users.`);
                  setDrilldownCell(null);
                }}
                className="py-2 bg-slate-900 hover:border-slate-800 border border-border-subtle text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Send Campaign
              </button>
              <button 
                onClick={() => {
                  handleActionToast(`Segment created for ${drilldownCell.cohortName} users.`);
                  setDrilldownCell(null);
                }}
                className="py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Create Segment
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
