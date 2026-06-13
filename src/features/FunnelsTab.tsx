"use client";

import React, { useState } from "react";
import { 
  Filter, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Users, 
  AlertCircle, 
  Sparkles, 
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
  HelpCircle,
  Eye,
  Info,
  Layers,
  ArrowDown,
  Check
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from "recharts";
import { mockEngine } from "@/lib/mockEngine";

interface StepDetails {
  title: string;
  users: string;
  successRate: string;
  avgItems: string;
  revenue: string;
  dropReasons: { reason: string; pct: number }[];
  segments: { name: string; drop: number }[];
  actions: string[];
}

export default function FunnelsTab() {
  // Config Bar States
  const [currentFunnel, setCurrentFunnel] = useState("Purchase Journey");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [comparePeriod, setComparePeriod] = useState("Previous Period");
  const [selectedSegment, setSelectedSegment] = useState("All Users");
  const [activePlatform, setActivePlatform] = useState<"All" | "Android" | "iOS" | "Web">("All");

  // Advanced Filters mock display
  const [showFilters, setShowFilters] = useState(true);

  // Tab switcher in Funnel Card
  const [funnelTab, setFunnelTab] = useState<"Standard" | "Cumulative" | "Trends">("Standard");
  const [showDropOff, setShowDropOff] = useState(true);
  const [conversionMetric, setConversionMetric] = useState("Conversion %");

  // Drawer for Step Intelligence
  const [selectedStep, setSelectedStep] = useState<StepDetails | null>(null);

  // Interactive Toast / Notification Modal for Actions
  const [alertText, setAlertText] = useState<string | null>(null);

  // Step intelligence data mapping
  const stepDetailsMap: Record<string, StepDetails> = {
    "App Opened": {
      title: "APP OPENED",
      users: "149.2M",
      successRate: "100%",
      avgItems: "N/A",
      revenue: "N/A",
      dropReasons: [
        { reason: "App launch crash", pct: 12 },
        { reason: "Slow API latency", pct: 8 },
        { reason: "Network timeouts", pct: 5 }
      ],
      segments: [
        { name: "Low-end devices", drop: 15 },
        { name: "Rural network users", drop: 12 }
      ],
      actions: ["Optimize application startup payload", "Reallocate regional CDN buffers"]
    },
    "Search Completed": {
      title: "SEARCH COMPLETED",
      users: "98.7M",
      successRate: "66.2%",
      avgItems: "3.2 searches/session",
      revenue: "₹340 Cr influenced",
      dropReasons: [
        { reason: "Zero result queries", pct: 28 },
        { reason: "Irrelevant suggestions", pct: 18 },
        { reason: "Search latency bar", pct: 12 }
      ],
      segments: [
        { name: "New Users", drop: 30 },
        { name: "Web platform", drop: 22 }
      ],
      actions: ["Refine semantic search embeddings", "Add spelling autocorrect indexer"]
    },
    "Product Viewed": {
      title: "PRODUCT DETAIL VIEW (PDP)",
      users: "61.3M",
      successRate: "62.1%",
      avgItems: "2.1 views/session",
      revenue: "₹280 Cr influenced",
      dropReasons: [
        { reason: "Out of stock items", pct: 35 },
        { reason: "High delivery timelines", pct: 24 },
        { reason: "Uncompetitive pricing", pct: 18 }
      ],
      segments: [
        { name: "iOS Users", drop: 28 },
        { name: "Tier 2 & 3 Cities", drop: 25 }
      ],
      actions: ["Implement seller backfill for OOS", "Show fast delivery options above list"]
    },
    "Add to Cart": {
      title: "ADD TO CART ANALYSIS",
      users: "23.9M",
      successRate: "39.0%",
      avgItems: "2.4 items added",
      revenue: "₹320 Cr influence",
      dropReasons: [
        { reason: "High product price", pct: 32 },
        { reason: "Delivery fee surprise", pct: 21 },
        { reason: "Coupon code failure", pct: 15 }
      ],
      segments: [
        { name: "Android Users", drop: 18 },
        { name: "New Users", drop: 22 }
      ],
      actions: ["Test free shipping banner thresholds", "Improve delivery visibility on PDP"]
    },
    "Checkout Started": {
      title: "CHECKOUT STARTED",
      users: "9.3M",
      successRate: "38.9%",
      avgItems: "1.2 checkouts/user",
      revenue: "₹190 Cr influenced",
      dropReasons: [
        { reason: "Complex address forms", pct: 40 },
        { reason: "COD payment restriction", pct: 28 },
        { reason: "Long verification delays", pct: 15 }
      ],
      segments: [
        { name: "Guest Checkout", drop: 45 },
        { name: "iOS Users", drop: 18.6 }
      ],
      actions: ["Deploy address auto-suggestions API", "A/B test quick UPI auto-fill checkout"]
    },
    "Payment Success": {
      title: "PAYMENT SUCCESS",
      users: "6.48M",
      successRate: "69.7%",
      avgItems: "1.0 order completed",
      revenue: "₹428.3 Cr generated",
      dropReasons: [
        { reason: "Bank server failures", pct: 48 },
        { reason: "UPI timeout drops", pct: 32 },
        { reason: "OTP latency failures", pct: 14 }
      ],
      segments: [
        { name: "HDFC bank cards", drop: 18 },
        { name: "Android users", drop: 7.3 }
      ],
      actions: ["Add secondary gateway retry logic", "Rollback UPI Checkout SDK version to v4.2 stable"]
    }
  };

  // Overall KPIs
  const kpis = {
    conversion: { value: "4.32%", change: "+8.6%", trend: "up" },
    conversions: { value: "6.48M", change: "+5.2%", trend: "up" },
    entered: { value: "149.2M", change: "+3.1%", trend: "up" },
    time: { value: "12m 34s", change: "-4.6%", trend: "down" },
    revenue: { value: "₹428.3 Cr", change: "+9.4%", trend: "up" }
  };

  // Recharts Line trend data (May 13 - June 12)
  const trendData = [
    { date: "13 May", conversion: 3.82, prevConversion: 3.50 },
    { date: "16 May", conversion: 4.10, prevConversion: 3.65 },
    { date: "19 May", conversion: 3.95, prevConversion: 3.70 },
    { date: "22 May", conversion: 4.25, prevConversion: 3.80 },
    { date: "25 May", conversion: 4.30, prevConversion: 3.90 },
    { date: "28 May", conversion: 4.32, prevConversion: 3.98 },
    { date: "31 May", conversion: 4.20, prevConversion: 4.02 },
    { date: "3 Jun", conversion: 4.38, prevConversion: 4.10 },
    { date: "6 Jun", conversion: 4.45, prevConversion: 4.15 },
    { date: "9 Jun", conversion: 4.40, prevConversion: 4.20 },
    { date: "12 Jun", conversion: 4.32, prevConversion: 4.25 }
  ];

  // AI Insights
  const insights = [
    {
      id: "ai_1",
      title: "Checkout conversion dropped by 7.3%",
      desc: "Major drop between Payment Initiated → Payment Success",
      impact: "Impact: ~₹12.4 Cr GMV",
      severity: "critical",
      actionText: "View Analysis",
      alertInfo: "Payment Success rate dropped by 7.3% on Android devices in last 24h. Root Cause: SBI/HDFC server timeouts. Action: Secondary payment retry is recommended."
    },
    {
      id: "ai_2",
      title: "High drop in Address Added step for iOS users",
      desc: "Drop rate: 18.6% (vs Android: 6.2%)",
      severity: "warning",
      actionText: "View Users",
      alertInfo: "Address input fields keyboard overlaps text inputs on iOS app v12.4.1. Action: Hotfix UI layout overlap."
    },
    {
      id: "ai_3",
      title: "Product View to Add to Cart improved by 4.2%",
      desc: "Primarily driven by Electronics category",
      severity: "success",
      actionText: "View Details",
      alertInfo: "Recommendation algorithm experiment v12.2 (Variant B) moved recommendations above product description. Results in +4.2% Cart Add."
    }
  ];

  // Drop-off rows
  const dropOffs = [
    { step: "Product Viewed → Add to Cart", count: "37.4M", rate: "61.0%", change: "↑ 3.2%", trend: "up" },
    { step: "Add to Cart → Checkout Started", count: "14.6M", rate: "61.6%", change: "↑ 4.8%", trend: "up" },
    { step: "Checkout Started → Payment Success", count: "2.82M", rate: "30.3%", change: "↑ 7.3%", trend: "up" },
    { step: "Search Completed → Product Viewed", count: "37.4M", rate: "37.9%", change: "↑ 1.2%", trend: "up" },
    { step: "App Opened → Search Completed", count: "50.5M", rate: "33.8%", change: "↓ 0.6%", trend: "down" }
  ];

  // Segments
  const segments = [
    { name: "Premium Users", entered: "24.8M", conversion: "6.72%", change: "↑ 9.8%", trend: "up" },
    { name: "Frequent Buyers", entered: "31.2M", conversion: "7.18%", change: "↑ 6.5%", trend: "up" },
    { name: "New Users", entered: "38.6M", conversion: "2.34%", change: "↑ 4.1%", trend: "up" },
    { name: "At Risk Users", entered: "8.4M", conversion: "1.12%", change: "↓ 2.3%", trend: "down" },
    { name: "Electronics Enthusiasts", entered: "18.7M", conversion: "5.98%", change: "↑ 8.9%", trend: "up" }
  ];

  // Click handler to display step detail drawer
  const handleStepClick = (stepName: string) => {
    const details = stepDetailsMap[stepName];
    if (details) {
      setSelectedStep(details);
    }
  };

  const handleActionToast = (text: string) => {
    setAlertText(text);
    setTimeout(() => setAlertText(null), 5000);
  };

  return (
    <div className="space-y-6 pb-12 select-none relative">
      
      {/* Dynamic Toast Alerts */}
      {alertText && (
        <div className="fixed bottom-5 right-5 bg-slate-950 border border-primary text-text-bright px-5 py-3.5 rounded-xl shadow-2xl z-50 flex items-center gap-3 max-w-sm animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="text-xs font-semibold leading-relaxed">{alertText}</div>
          <button onClick={() => setAlertText(null)} className="text-text-muted hover:text-white ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= HEADER AND TOP CONTROLS ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-subtle pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-bright flex items-center gap-2">
            Funnel Intelligence
            <Sparkles className="w-5.5 h-5.5 text-primary" />
          </h1>
          <p className="text-xs text-text-muted">
            Analyze customer journeys, conversion barriers, and revenue impact across product experiences.
          </p>
        </div>

        {/* Header Actions Buttons */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleActionToast("Funnel setup saved successfully.")} className="px-3.5 py-1.5 bg-slate-900 border border-border-subtle rounded-lg text-xs font-semibold text-text-bright hover:border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer">
            <Check className="w-4 h-4 text-primary" /> Save Funnel
          </button>
          <button onClick={() => handleActionToast("Shareable link copied to clipboard.")} className="px-3.5 py-1.5 bg-slate-900 border border-border-subtle rounded-lg text-xs font-semibold text-text-bright hover:border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer">
            <Share2 className="w-4 h-4 text-accent-blue" /> Share
          </button>
          <button onClick={() => handleActionToast("Export generated. CSV downloading...")} className="px-3.5 py-1.5 bg-slate-900 border border-border-subtle rounded-lg text-xs font-semibold text-text-bright hover:border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer">
            <Download className="w-4 h-4 text-accent-purple" /> Export
          </button>
          <button onClick={() => handleActionToast("Alert trigger registered: conversion < 4.0%")} className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 flex items-center gap-1.5 transition-colors cursor-pointer">
            <Bell className="w-4 h-4" /> Create Alert
          </button>
          <button className="p-1.5 bg-slate-900 border border-border-subtle rounded-lg text-text-muted hover:text-white cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= CONFIGURATION FILTER BAR ================= */}
      <div className="glass-panel p-4.5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          
          {/* Funnel Selector */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Current Funnel</span>
            <div className="relative">
              <select
                value={currentFunnel}
                onChange={(e) => setCurrentFunnel(e.target.value)}
                className="pl-2.5 pr-8 py-1.5 text-xs bg-slate-950 border border-border-subtle rounded-lg text-primary font-bold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="Purchase Journey">Purchase Journey</option>
                <option value="Search Discovery">Search Discovery</option>
                <option value="New User Activation">New User Activation</option>
                <option value="Seller Onboarding">Seller Onboarding</option>
                <option value="Payment Success">Payment Success</option>
                <option value="Subscription Conversion">Subscription Conversion</option>
                <option value="Retention Journey">Retention Journey</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
            </div>
          </div>

          {/* Date range filter */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Date Range</span>
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="pl-2.5 pr-8 py-1.5 text-xs bg-slate-950 border border-border-subtle rounded-lg text-text-bright font-semibold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Custom Range">Custom Range</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
            </div>
          </div>

          {/* Comparison range selector */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Compare With</span>
            <div className="relative">
              <select
                value={comparePeriod}
                onChange={(e) => setComparePeriod(e.target.value)}
                className="pl-2.5 pr-8 py-1.5 text-xs bg-slate-950 border border-border-subtle rounded-lg text-text-bright font-semibold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="Previous Period">Previous 30 Days</option>
                <option value="Previous Year">Previous Year</option>
                <option value="Custom Range">Custom Range</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
            </div>
          </div>

          {/* Segment Filter selector */}
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
                <option value="High Value Customers">High Value Customers</option>
                <option value="Android Users">Android Users</option>
                <option value="iOS Users">iOS Users</option>
                <option value="Mumbai Users">Mumbai Users</option>
                <option value="Electronics Buyers">Electronics Buyers</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
            </div>
          </div>

          {/* Advanced filter toggle */}
          <div className="flex flex-col justify-end h-11">
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                showFilters ? "bg-primary/10 border-primary/30 text-primary" : "bg-slate-900 border-border-subtle text-text-muted hover:text-white"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{showFilters ? "Filter Active" : "Add Filter"}</span>
            </button>
          </div>

        </div>

        {/* Platform Device Segment filter switcher */}
        <div className="flex bg-slate-950 p-1.5 rounded-lg border border-border-subtle self-start md:self-center">
          {(["All", "Android", "iOS", "Web"] as const).map(platform => (
            <button
              key={platform}
              onClick={() => setActivePlatform(platform)}
              className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer ${
                activePlatform === platform 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-text-muted hover:text-text-bright transition-colors"
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Mock Filter Tag Block */}
      {showFilters && (
        <div className="bg-slate-950/60 p-3 rounded-xl border border-border-subtle/80 flex flex-wrap items-center gap-2 text-[10px] font-mono text-text-muted">
          <span className="font-bold text-primary">WHERE</span>
          <span className="bg-slate-900 px-2 py-0.5 border border-border-subtle rounded text-text-bright">Category = Electronics</span>
          <span className="font-bold text-primary">AND</span>
          <span className="bg-slate-900 px-2 py-0.5 border border-border-subtle rounded text-text-bright">Price &gt; ₹50,000</span>
          <span className="font-bold text-primary">AND</span>
          <span className="bg-slate-900 px-2 py-0.5 border border-border-subtle rounded text-text-bright">City = Bangalore</span>
          <button onClick={() => setShowFilters(false)} className="ml-auto text-text-muted hover:text-white font-bold p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ================= FUNNEL KPI HEALTH LAYER ================= */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Overall Conversion */}
        <div className="glass-panel p-4.5 rounded-xl border-l-2 border-l-primary flex flex-col justify-between">
          <div className="flex justify-between items-start text-[10px] text-text-muted uppercase tracking-wider font-bold">
            <span>Overall Conversion</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-text-bright">{kpis.conversion.value}</span>
            <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-primary">
              <span className="bg-emerald-500/10 px-1 rounded">{kpis.conversion.change}</span>
              <span className="text-text-muted font-normal">vs previous period</span>
            </div>
          </div>
        </div>

        {/* Total Conversions */}
        <div className="glass-panel p-4.5 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start text-[10px] text-text-muted uppercase tracking-wider font-bold">
            <span>Total Conversions</span>
            <CheckCircle2 className="w-4 h-4 text-accent-blue" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-text-bright">{kpis.conversions.value}</span>
            <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-primary">
              <span className="bg-emerald-500/10 px-1 rounded">{kpis.conversions.change}</span>
              <span className="text-text-muted font-normal">vs previous period</span>
            </div>
          </div>
        </div>

        {/* Users Entered */}
        <div className="glass-panel p-4.5 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start text-[10px] text-text-muted uppercase tracking-wider font-bold">
            <span>Users Entered</span>
            <Users className="w-4 h-4 text-accent-purple" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-text-bright">{kpis.entered.value}</span>
            <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-primary">
              <span className="bg-emerald-500/10 px-1 rounded">{kpis.entered.change}</span>
              <span className="text-text-muted font-normal">vs previous period</span>
            </div>
          </div>
        </div>

        {/* Avg Completion Time */}
        <div className="glass-panel p-4.5 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start text-[10px] text-text-muted uppercase tracking-wider font-bold">
            <span>Avg Completion Time</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-text-bright">{kpis.time.value}</span>
            <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-primary">
              <span className="bg-emerald-500/10 px-1 rounded">{kpis.time.change}</span>
              <span className="text-text-muted font-normal">vs previous period</span>
            </div>
          </div>
        </div>

        {/* Revenue Generated */}
        <div className="glass-panel p-4.5 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start text-[10px] text-text-muted uppercase tracking-wider font-bold">
            <span>Revenue Generated</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-400">{kpis.revenue.value}</span>
            <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-primary">
              <span className="bg-emerald-500/10 px-1 rounded">{kpis.revenue.change}</span>
              <span className="text-text-muted font-normal">vs previous period</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN 3-COLUMN LAYOUT SYSTEM ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= LEFT MAIN AREA (2/3) ================= */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Main Funnel overview card */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-text-bright uppercase">Funnel Overview</span>
                
                {/* Standard | Cumulative | Trends tabs switcher */}
                <div className="flex bg-slate-950 p-1 rounded-lg border border-border-subtle text-[10px] font-bold">
                  {(["Standard", "Cumulative", "Trends"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setFunnelTab(tab)}
                      className={`px-3 py-1 rounded cursor-pointer transition-all ${
                        funnelTab === tab 
                          ? "bg-primary text-white shadow-sm" 
                          : "text-text-muted hover:text-white"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Show controls: Dropdowns and switch triggers */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={conversionMetric}
                    onChange={(e) => setConversionMetric(e.target.value)}
                    className="pl-2 pr-7 py-1 text-[11px] bg-slate-950 border border-border-subtle rounded text-text-bright focus:outline-none appearance-none cursor-pointer font-bold"
                  >
                    <option value="Conversion %">Conversion %</option>
                    <option value="Cumulative %">Cumulative %</option>
                  </select>
                  <ChevronDown className="absolute right-1.5 top-1.5 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-text-muted font-semibold">Show Drop-off</span>
                  <button
                    onClick={() => setShowDropOff(!showDropOff)}
                    className={`relative w-8 h-4.5 rounded-full border transition-all cursor-pointer ${
                      showDropOff ? "bg-primary border-primary" : "bg-slate-950 border-border-subtle"
                    }`}
                  >
                    <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
                      showDropOff ? "left-4.5" : "left-0.5"
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Standard funnel visualization view */}
            {funnelTab === "Standard" && (
              <div className="relative w-full h-[320px] pt-6 flex flex-col justify-between">
                
                {/* Continuous Polygon connector diagram background */}
                <div className="absolute top-[80px] bottom-14 left-0 right-0 z-0">
                  <svg className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gApp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity="0.25"/><stop offset="100%" stopColor="#10b981" stopOpacity="0"/></linearGradient>
                      <linearGradient id="gSrc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25"/><stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/></linearGradient>
                      <linearGradient id="gPdp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25"/><stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/></linearGradient>
                      <linearGradient id="gCart" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ec4899" stopOpacity="0.25"/><stop offset="100%" stopColor="#ec4899" stopOpacity="0"/></linearGradient>
                      <linearGradient id="gChk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25"/><stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/></linearGradient>
                      <linearGradient id="gPay" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity="0.25"/><stop offset="100%" stopColor="#10b981" stopOpacity="0"/></linearGradient>
                    </defs>
                    {/* App Opened: x: 0% to 12% */}
                    <polygon points="0,0 12,20 12,100 0,100" fill="url(#gApp)" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5" transform="scale(100) translate(0)" />
                    
                    {/* Search Completed: x: 17.6% to 29.6% */}
                    <polygon points="17.6,20 29.6,25 29.6,100 17.6,100" fill="url(#gSrc)" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.5" />
                    
                    {/* Product Viewed: x: 35.2% to 47.2% */}
                    <polygon points="35.2,25 47.2,40 47.2,100 35.2,100" fill="url(#gPdp)" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.5" />
                    
                    {/* Add to Cart: x: 52.8% to 64.8% */}
                    <polygon points="52.8,40 64.8,50 64.8,100 52.8,100" fill="url(#gCart)" stroke="#ec4899" strokeWidth="1" strokeOpacity="0.5" />
                    
                    {/* Checkout Started: x: 70.4% to 82.4% */}
                    <polygon points="70.4,50 82.4,60 82.4,100 70.4,100" fill="url(#gChk)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />
                    
                    {/* Payment Success: x: 88% to 100% */}
                    <polygon points="88,60 100,60 100,100 88,100" fill="url(#gPay)" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5" />
                  </svg>
                </div>

                {/* Overlaid visual interaction cards flex list */}
                <div className="relative z-10 flex justify-between h-full items-stretch">
                  
                  {/* Step 1: App Opened */}
                  <div 
                    onClick={() => handleStepClick("App Opened")}
                    className="flex-1 flex flex-col justify-between items-center group cursor-pointer hover:-translate-y-0.5 transition-all text-center"
                  >
                    <div className="space-y-1 bg-slate-950/80 px-2 py-1.5 border border-border-subtle rounded-lg">
                      <span className="text-[10px] font-bold text-text-muted flex items-center gap-1 justify-center">
                        <span className="w-4 h-4 bg-emerald-500/10 border border-emerald-500/20 text-primary rounded flex items-center justify-center font-bold">1</span>
                        <span>App Opened</span>
                      </span>
                      <p className="text-xs font-bold text-text-bright">149.2M</p>
                    </div>

                    <div className="mt-auto pb-2">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-900 border border-border-subtle text-text-muted group-hover:text-primary transition-colors">
                        100%
                      </span>
                    </div>
                  </div>

                  {/* Connector 1 */}
                  <div className="w-[5%] flex flex-col items-center justify-center font-bold text-[9px] text-red-400 text-center select-none pt-12">
                    {showDropOff && (
                      <div className="bg-red-500/5 border border-red-500/15 p-1 rounded backdrop-blur">
                        <span className="block text-[8px] uppercase font-semibold opacity-60">Drop</span>
                        <span className="block font-black">50.5M</span>
                        <span className="block opacity-80">33.8%</span>
                        <ArrowDown className="w-3 h-3 mx-auto mt-0.5" />
                      </div>
                    )}
                  </div>

                  {/* Step 2: Search */}
                  <div 
                    onClick={() => handleStepClick("Search Completed")}
                    className="flex-1 flex flex-col justify-between items-center group cursor-pointer hover:-translate-y-0.5 transition-all text-center pt-5"
                  >
                    <div className="space-y-1 bg-slate-950/80 px-2 py-1.5 border border-border-subtle rounded-lg">
                      <span className="text-[10px] font-bold text-text-muted flex items-center gap-1 justify-center">
                        <span className="w-4 h-4 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded flex items-center justify-center font-bold">2</span>
                        <span>Search</span>
                      </span>
                      <p className="text-xs font-bold text-text-bright">98.7M</p>
                    </div>

                    <div className="mt-auto pb-2">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-900 border border-border-subtle text-text-muted group-hover:text-cyan-400 transition-colors">
                        66.2%
                      </span>
                    </div>
                  </div>

                  {/* Connector 2 */}
                  <div className="w-[5%] flex flex-col items-center justify-center font-bold text-[9px] text-red-400 text-center select-none pt-12">
                    {showDropOff && (
                      <div className="bg-red-500/5 border border-red-500/15 p-1 rounded backdrop-blur">
                        <span className="block text-[8px] uppercase font-semibold opacity-60">Drop</span>
                        <span className="block font-black">37.4M</span>
                        <span className="block opacity-80">37.9%</span>
                        <ArrowDown className="w-3 h-3 mx-auto mt-0.5" />
                      </div>
                    )}
                  </div>

                  {/* Step 3: Product viewed */}
                  <div 
                    onClick={() => handleStepClick("Product Viewed")}
                    className="flex-1 flex flex-col justify-between items-center group cursor-pointer hover:-translate-y-0.5 transition-all text-center pt-8"
                  >
                    <div className="space-y-1 bg-slate-950/80 px-2 py-1.5 border border-border-subtle rounded-lg">
                      <span className="text-[10px] font-bold text-text-muted flex items-center gap-1 justify-center">
                        <span className="w-4 h-4 bg-blue-500/10 border border-blue-500/20 text-accent-blue rounded flex items-center justify-center font-bold">3</span>
                        <span>Product Viewed</span>
                      </span>
                      <p className="text-xs font-bold text-text-bright">61.3M</p>
                    </div>

                    <div className="mt-auto pb-2">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-900 border border-border-subtle text-text-muted group-hover:text-accent-blue transition-colors">
                        62.1%
                      </span>
                    </div>
                  </div>

                  {/* Connector 3 */}
                  <div className="w-[5%] flex flex-col items-center justify-center font-bold text-[9px] text-red-400 text-center select-none pt-12">
                    {showDropOff && (
                      <div className="bg-red-500/5 border border-red-500/15 p-1 rounded backdrop-blur">
                        <span className="block text-[8px] uppercase font-semibold opacity-60">Drop</span>
                        <span className="block font-black">37.4M</span>
                        <span className="block opacity-80">61.9%</span>
                        <ArrowDown className="w-3 h-3 mx-auto mt-0.5" />
                      </div>
                    )}
                  </div>

                  {/* Step 4: Add to Cart */}
                  <div 
                    onClick={() => handleStepClick("Add to Cart")}
                    className="flex-1 flex flex-col justify-between items-center group cursor-pointer hover:-translate-y-0.5 transition-all text-center pt-12"
                  >
                    <div className="space-y-1 bg-slate-950/80 px-2 py-1.5 border border-border-subtle rounded-lg">
                      <span className="text-[10px] font-bold text-text-muted flex items-center gap-1 justify-center">
                        <span className="w-4 h-4 bg-pink-500/10 border border-pink-500/20 text-accent-pink rounded flex items-center justify-center font-bold">4</span>
                        <span>Add to Cart</span>
                      </span>
                      <p className="text-xs font-bold text-text-bright">23.9M</p>
                    </div>

                    <div className="mt-auto pb-2">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-900 border border-border-subtle text-text-muted group-hover:text-accent-pink transition-colors">
                        39.0%
                      </span>
                    </div>
                  </div>

                  {/* Connector 4 */}
                  <div className="w-[5%] flex flex-col items-center justify-center font-bold text-[9px] text-red-400 text-center select-none pt-12">
                    {showDropOff && (
                      <div className="bg-red-500/5 border border-red-500/15 p-1 rounded backdrop-blur">
                        <span className="block text-[8px] uppercase font-semibold opacity-60">Drop</span>
                        <span className="block font-black">14.6M</span>
                        <span className="block opacity-80">61.1%</span>
                        <ArrowDown className="w-3 h-3 mx-auto mt-0.5" />
                      </div>
                    )}
                  </div>

                  {/* Step 5: Checkout Started */}
                  <div 
                    onClick={() => handleStepClick("Checkout Started")}
                    className="flex-1 flex flex-col justify-between items-center group cursor-pointer hover:-translate-y-0.5 transition-all text-center pt-16"
                  >
                    <div className="space-y-1 bg-slate-950/80 px-2 py-1.5 border border-border-subtle rounded-lg">
                      <span className="text-[10px] font-bold text-text-muted flex items-center gap-1 justify-center">
                        <span className="w-4 h-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded flex items-center justify-center font-bold">5</span>
                        <span>Checkout</span>
                      </span>
                      <p className="text-xs font-bold text-text-bright">9.3M</p>
                    </div>

                    <div className="mt-auto pb-2">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-900 border border-border-subtle text-text-muted group-hover:text-amber-400 transition-colors">
                        38.9%
                      </span>
                    </div>
                  </div>

                  {/* Connector 5 */}
                  <div className="w-[5%] flex flex-col items-center justify-center font-bold text-[9px] text-red-400 text-center select-none pt-12">
                    {showDropOff && (
                      <div className="bg-red-500/5 border border-red-500/15 p-1 rounded backdrop-blur">
                        <span className="block text-[8px] uppercase font-semibold opacity-60">Drop</span>
                        <span className="block font-black">2.82M</span>
                        <span className="block opacity-80">30.3%</span>
                        <ArrowDown className="w-3 h-3 mx-auto mt-0.5" />
                      </div>
                    )}
                  </div>

                  {/* Step 6: Payment Success */}
                  <div 
                    onClick={() => handleStepClick("Payment Success")}
                    className="flex-1 flex flex-col justify-between items-center group cursor-pointer hover:-translate-y-0.5 transition-all text-center pt-20"
                  >
                    <div className="space-y-1 bg-slate-950/80 px-2 py-1.5 border border-border-subtle rounded-lg">
                      <span className="text-[10px] font-bold text-text-muted flex items-center gap-1 justify-center">
                        <span className="w-4 h-4 bg-emerald-500/10 border border-emerald-500/20 text-primary rounded flex items-center justify-center font-bold">6</span>
                        <span>Success</span>
                      </span>
                      <p className="text-xs font-bold text-text-bright">6.48M</p>
                    </div>

                    <div className="mt-auto pb-2">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-900 border border-border-subtle text-text-muted group-hover:text-primary transition-colors">
                        69.7%
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Cumulative conversion view */}
            {funnelTab === "Cumulative" && (
              <div className="space-y-4 py-4 text-xs font-semibold">
                <span className="text-[10px] font-bold text-text-muted uppercase">Cumulative Funnel Conversion Rate Progression</span>
                <div className="space-y-3.5">
                  {[
                    { name: "App Opened", pct: 100, count: "149.2M" },
                    { name: "Search Completed", pct: 66.2, count: "98.7M" },
                    { name: "Product Viewed", pct: 41.1, count: "61.3M" },
                    { name: "Add to Cart", pct: 16.0, count: "23.9M" },
                    { name: "Checkout Started", pct: 6.23, count: "9.3M" },
                    { name: "Payment Success", pct: 4.34, count: "6.48M" }
                  ].map((item, idx) => (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-text-bright">{idx + 1}. {item.name} ({item.count})</span>
                        <span className="text-primary font-mono">{item.pct}% cumulative</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-border-subtle/50">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trends, Platform, Geography, Experiment impact overview */}
            {funnelTab === "Trends" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2 text-xs">
                
                {/* Platform performance */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-border-subtle/80 flex flex-col justify-between gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Platform breakdown</span>
                    <Smartphone className="w-4 h-4 text-accent-blue" />
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex justify-between"><span>Android:</span><span className="font-bold text-text-bright">85M users (4.1% conv)</span></div>
                    <div className="flex justify-between"><span>iOS:</span><span className="font-bold text-accent-purple">40M users (6.2% conv)</span></div>
                    <div className="flex justify-between"><span>Web:</span><span className="font-bold text-text-muted">24M users (3.2% conv)</span></div>
                  </div>
                </div>

                {/* Regional conversion */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-border-subtle/80 flex flex-col justify-between gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Regional Conversion</span>
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex justify-between"><span>Mumbai:</span><span className="font-bold text-emerald-400">5.8% conv</span></div>
                    <div className="flex justify-between"><span>Delhi:</span><span className="font-bold text-text-bright">5.4% conv</span></div>
                    <div className="flex justify-between"><span>Bangalore:</span><span className="font-bold text-primary">6.1% conv</span></div>
                    <div className="flex justify-between"><span>Hyderabad:</span><span className="font-bold text-text-muted">4.7% conv</span></div>
                  </div>
                </div>

                {/* Experiment impact */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-border-subtle/80 flex flex-col justify-between gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Experiment Impact</span>
                    <Sparkles className="w-4 h-4 text-accent-purple" />
                  </div>
                  <p className="font-bold text-text-bright block truncate">New Checkout Flow V2</p>
                  <p className="text-[10px] text-text-muted font-bold font-mono text-primary flex justify-between">
                    <span>Variant B</span>
                    <span>+12.4% checkouts</span>
                  </p>
                  <div className="text-[9px] text-text-muted font-semibold">
                    Influenced +₹18Cr GMV across 22M users.
                  </div>
                </div>

              </div>
            )}
            
            <p className="text-[10px] text-text-muted text-center pt-2 border-t border-border-subtle/40 select-none">
              ⚡ Pro-tip: Click on any step block above to open real-time **Funnel Step Intelligence** metrics & drop root causes.
            </p>
          </div>

          {/* Conversion Over Time line chart */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="text-sm font-bold text-text-bright">Conversion Over Time</h3>
              <p className="text-xs text-text-muted">Daily conversion percentage performance compared to the comparative period.</p>
            </div>

            <div className="h-56 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={9} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={9} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0b0f19", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    labelStyle={{ color: "#f3f4f6", fontWeight: "bold", fontSize: "11px" }}
                    itemStyle={{ fontSize: "11px", color: "#f3f4f6" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "10px" }} />
                  <Line type="monotone" dataKey="conversion" name="Overall Conversion Rate" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="prevConversion" name="Previous Period" stroke="#3b82f6" strokeWidth={2.0} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ================= RIGHT SIDE AREA (1/3) ================= */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* AI Funnel Insights Widget */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3">
              <div>
                <h3 className="text-sm font-bold text-text-bright flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-primary" />
                  AI Funnel Insights
                </h3>
                <p className="text-xs text-text-muted">Automated real-time conversion barrier diagnostics.</p>
              </div>
            </div>

            <div className="space-y-3">
              {insights.map(item => (
                <div 
                  key={item.id} 
                  className={`p-3.5 border rounded-xl flex flex-col gap-2 transition-all ${
                    item.severity === "critical" 
                      ? "bg-red-500/5 border-red-500/15 hover:border-red-500/30" 
                      : item.severity === "warning"
                      ? "bg-amber-500/5 border-amber-500/15 hover:border-amber-500/30"
                      : "bg-slate-900/60 border-border-subtle hover:border-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-bold leading-snug ${
                      item.severity === "critical" ? "text-red-400" : item.severity === "warning" ? "text-amber-400" : "text-primary"
                    }`}>
                      {item.title}
                    </span>
                    <span className={`text-[8px] font-black uppercase px-1 rounded ${
                      item.severity === "critical" 
                        ? "bg-red-500/10 text-red-400" 
                        : item.severity === "warning" 
                        ? "bg-amber-500/10 text-amber-400" 
                        : "bg-primary/10 text-primary"
                    }`}>
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted leading-relaxed font-semibold">{item.desc}</p>
                  
                  {/* Footer impact details */}
                  <div className="flex justify-between items-center pt-2 border-t border-border-subtle/50 text-[10px] text-text-muted font-bold font-mono">
                    {item.severity === "critical" ? (
                      <span className="text-red-400">{item.impact}</span>
                    ) : (
                      <span className="opacity-0">N/A</span>
                    )}
                    <button 
                      onClick={() => handleActionToast(item.alertInfo)} 
                      className={`px-2.5 py-1 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${
                        item.severity === "critical" 
                          ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20" 
                          : item.severity === "warning"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                          : "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                      }`}
                    >
                      {item.actionText}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drop-off transition table widget */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-text-bright">Drop-off Analysis</h3>
              <p className="text-xs text-text-muted">Quantifying user losses at critical transitions.</p>
            </div>

            <div className="space-y-3.5 text-xs">
              {dropOffs.map((drop, idx) => (
                <div key={idx} className="flex justify-between items-center py-2.5 border-b border-border-subtle/50 last:border-b-0">
                  <div className="space-y-0.5 text-left">
                    <span className="font-bold text-text-bright block truncate max-w-[170px]">{drop.step}</span>
                    <span className="text-[10px] text-text-muted font-mono block">Lost: {drop.count} users</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-red-400 font-mono block">{drop.rate} drop</span>
                    <span className={`text-[9px] font-bold font-mono ${
                      drop.trend === "up" ? "text-red-400" : "text-primary"
                    }`}>
                      {drop.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Segment Analysis conversion rates */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-text-bright">Conversion by Segment</h3>
              <p className="text-xs text-text-muted">A comparison of conversion outputs across target cohorts.</p>
            </div>

            <div className="space-y-3.5 text-xs">
              {segments.map((seg, idx) => (
                <div key={idx} className="flex justify-between items-center py-2.5 border-b border-border-subtle/50 last:border-b-0">
                  <div className="space-y-0.5 text-left">
                    <span className="font-bold text-text-bright block truncate max-w-[170px]">{seg.name}</span>
                    <span className="text-[10px] text-text-muted font-mono block">Entered: {seg.entered}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-primary font-mono block">{seg.conversion}</span>
                    <span className={`text-[9px] font-bold font-mono ${
                      seg.trend === "up" ? "text-primary" : "text-red-400"
                    }`}>
                      {seg.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ================= STEP INTELLIGENCE DRAWER (RIGHT SLIDE OUT) ================= */}
      {selectedStep && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex justify-end">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedStep(null)} />
          
          <div className="relative w-full max-w-md bg-slate-950 border-l border-border-subtle h-full p-6 shadow-2xl flex flex-col gap-6 overflow-y-auto animate-slide-left">
            
            {/* Drawer Header */}
            <div className="flex justify-between items-start border-b border-border-subtle pb-4.5">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Funnel Step Analytics</span>
                <h4 className="text-md font-black text-text-bright tracking-tight mt-1">{selectedStep.title}</h4>
              </div>
              <button 
                onClick={() => setSelectedStep(null)}
                className="p-1 rounded bg-slate-900 border border-border-subtle text-text-muted hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Base metrics info grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-border-subtle/80 rounded-xl p-3.5">
                <span className="text-[9px] font-bold text-text-muted uppercase block">Active Users</span>
                <span className="text-lg font-black text-text-bright font-mono block mt-1">{selectedStep.users}</span>
              </div>
              <div className="bg-slate-900 border border-border-subtle/80 rounded-xl p-3.5">
                <span className="text-[9px] font-bold text-text-muted uppercase block">Step conversion rate</span>
                <span className="text-lg font-black text-primary font-mono block mt-1">{selectedStep.successRate}</span>
              </div>
              <div className="bg-slate-900 border border-border-subtle/80 rounded-xl p-3.5">
                <span className="text-[9px] font-bold text-text-muted uppercase block">Basket Influence</span>
                <span className="text-xs font-bold text-text-bright block mt-2 truncate">{selectedStep.avgItems}</span>
              </div>
              <div className="bg-slate-900 border border-border-subtle/80 rounded-xl p-3.5">
                <span className="text-[9px] font-bold text-text-muted uppercase block">Revenue influence</span>
                <span className="text-xs font-bold text-emerald-400 block mt-2 truncate">{selectedStep.revenue}</span>
              </div>
            </div>

            {/* Top Drop Reasons */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Top Drop Reasons</span>
              <div className="space-y-2 text-xs">
                {selectedStep.dropReasons.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/60 rounded-xl border border-border-subtle/60 flex justify-between items-center">
                    <span className="font-semibold text-text-bright">{item.reason}</span>
                    <span className="font-bold text-red-400 font-mono">{item.pct}% loss</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Affected User segments */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Highly Affected Segments</span>
              <div className="space-y-2 text-xs">
                {selectedStep.segments.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/60 rounded-xl border border-border-subtle/60 flex justify-between items-center">
                    <span className="font-semibold text-text-bright">{item.name}</span>
                    <span className="font-bold text-amber-500 font-mono">+{item.drop}% drop</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Action Recommendations */}
            <div className="space-y-2.5 border-t border-border-subtle/80 pt-4 mt-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Recommended Actions
              </span>
              <div className="space-y-2 text-xs">
                {selectedStep.actions.map((act, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/30 rounded-xl border border-border-subtle/40 text-text-muted flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed text-[11px] font-semibold text-text-bright">{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-4 border-t border-border-subtle/80 mt-auto">
              <button 
                onClick={() => {
                  handleActionToast(`Cohort created for ${selectedStep.title} drops.`);
                  setSelectedStep(null);
                }} 
                className="flex-1 py-2 bg-slate-900 border border-border-subtle hover:border-slate-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Create Cohort
              </button>
              <button 
                onClick={() => {
                  handleActionToast(`Campaign scheduled for ${selectedStep.title} users.`);
                  setSelectedStep(null);
                }}
                className="flex-1 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Start Campaign
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
