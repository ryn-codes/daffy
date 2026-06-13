"use client";

import React, { useState } from "react";
import { 
  Users, 
  CheckCircle, 
  Percent, 
  Clock, 
  DollarSign, 
  GitFork, 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  Play, 
  X, 
  Plus, 
  Share2, 
  Download, 
  Bell, 
  MoreHorizontal, 
  ChevronDown, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  Settings
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

// TypeScript interfaces
interface JourneyNodeData {
  name: string;
  users: string;
  usersVal: number;
  conversion: string;
  avgTime: string;
  revenue: string;
  stepIndex: number;
}

interface DropoffRow {
  step: string;
  dropped: string;
  rate: string;
  impact: string;
  severity: "Critical" | "High" | "Medium" | "Low";
}

interface JourneyPathRow {
  pathName: string;
  users: string;
  conversion: string;
  revenue: string;
  avgTime: string;
}

export default function JourneysTab() {
  // Query Filters States
  const [journeyType, setJourneyType] = useState("Purchase Journey");
  const [startEvent, setStartEvent] = useState("App Opened");
  const [endEvent, setEndEvent] = useState("Order Completed");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [comparePeriod, setComparePeriod] = useState("Previous Period");
  const [platformFilter, setPlatformFilter] = useState("All Platforms");
  const [activeTab, setActiveTab] = useState<"flow" | "tree" | "table">("flow");

  // Interaction States
  const [showCompareMode, setShowCompareMode] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState<JourneyNodeData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showFiltersPopover, setShowFiltersPopover] = useState(false);

  // Compare Mode configurations
  const [compareJourneyA, setCompareJourneyA] = useState("Mobile App");
  const [compareJourneyB, setCompareJourneyB] = useState("Web Desktop");

  // Alert builder settings
  const [alertName, setAlertName] = useState("");
  const [alertStep, setAlertStep] = useState("Search → Product View");
  const [alertThreshold, setAlertThreshold] = useState("30");
  const [alertChannel, setAlertChannel] = useState("Slack (#growth-alerts)");

  // Toggle drop-offs state
  const [showDropoffsToggle, setShowDropoffsToggle] = useState(true);
  const [pathMetricsFilter, setPathMetricsFilter] = useState("Users");
  const [topPathsCount, setTopPathsCount] = useState("Top 3 Paths");

  // Toast trigger helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 8 Horizontally Structured Nodes
  const journeyNodes: JourneyNodeData[] = [
    { name: "App Opened", users: "149.2M", usersVal: 149200000, conversion: "100%", avgTime: "---", revenue: "₹428.3Cr", stepIndex: 1 },
    { name: "Home Page", users: "98.7M", usersVal: 98700000, conversion: "66.2%", avgTime: "8s", revenue: "₹428.3Cr", stepIndex: 2 },
    { name: "Search", users: "61.3M", usersVal: 61300000, conversion: "62.1%", avgTime: "45s", revenue: "₹380.0Cr", stepIndex: 3 },
    { name: "Product View", users: "23.9M", usersVal: 23900000, conversion: "39.0%", avgTime: "2m 14s", revenue: "₹312.4Cr", stepIndex: 4 },
    { name: "Add to Cart", users: "9.3M", usersVal: 9300000, conversion: "38.9%", avgTime: "45s", revenue: "₹182.4Cr", stepIndex: 5 },
    { name: "Checkout", users: "6.8M", usersVal: 6800000, conversion: "73.1%", avgTime: "3m 12s", revenue: "₹140.0Cr", stepIndex: 6 },
    { name: "Payment", users: "6.48M", usersVal: 6480000, conversion: "95.3%", avgTime: "1m 05s", revenue: "₹128.6Cr", stepIndex: 7 },
    { name: "Order Completed", users: "6.48M", usersVal: 6480000, conversion: "100%", avgTime: "12s", revenue: "₹128.6Cr", stepIndex: 8 }
  ];

  // Drop-off analysis dataset
  const dropoffData: DropoffRow[] = [
    { step: "Home Page → Search", dropped: "37.4M", rate: "37.9%", impact: "₹120.3 Cr", severity: "Critical" },
    { step: "Search → Product View", dropped: "37.3M", rate: "61.0%", impact: "₹98.6 Cr", severity: "Critical" },
    { step: "Product View → Add to Cart", dropped: "14.6M", rate: "61.1%", impact: "₹48.7 Cr", severity: "High" },
    { step: "Add to Cart → Checkout", dropped: "2.5M", rate: "26.9%", impact: "₹18.9 Cr", severity: "Medium" },
    { step: "Checkout → Payment", dropped: "320K", rate: "4.7%", impact: "₹3.2 Cr", severity: "Low" }
  ];

  // Journey paths performance details
  const pathPerformanceData: JourneyPathRow[] = [
    { pathName: "Path 1 (Most Common)", users: "89.6M", conversion: "3.92%", revenue: "₹312.4 Cr", avgTime: "11m 24s" },
    { pathName: "Path 2", users: "42.3M", conversion: "4.58%", revenue: "₹89.6 Cr", avgTime: "15m 18s" },
    { pathName: "Path 3", users: "17.1M", conversion: "2.84%", revenue: "₹26.3 Cr", avgTime: "16m 07s" }
  ];

  // Top Paths bullet sequences
  const topPathsBullets = [
    { rank: 1, seq: "Home → Search → Product → Cart → Checkout → Payment → Order", pct: "60.2%", vol: "89.6M" },
    { rank: 2, seq: "Home → Category → Product → Cart → Checkout → Payment → Order", pct: "28.4%", vol: "42.3M" },
    { rank: 3, seq: "Home → Search → Product → Buy Now → Payment → Order", pct: "11.4%", vol: "17.1M" }
  ];

  // User segments in journey
  const segmentsInJourney = [
    { name: "Premium Users", users: "24.8M", conversion: "7.82%", revenue: "₹182.4 Cr", duration: "10m 12s", trend: "up", color: "text-emerald-400" },
    { name: "Frequent Buyers", users: "31.2M", conversion: "6.13%", revenue: "₹128.6 Cr", duration: "9m 45s", trend: "up", color: "text-emerald-400" },
    { name: "New Users", users: "38.6M", conversion: "2.34%", revenue: "₹58.3 Cr", duration: "14m 23s", trend: "up", color: "text-emerald-400" },
    { name: "Deal Seekers", users: "26.9M", conversion: "1.92%", revenue: "₹32.6 Cr", duration: "15m 32s", trend: "down", color: "text-red-400" }
  ];

  // AI Journey smart diagnostics
  const aiJourneyInsights = [
    { 
      title: "Search to Product View improved by 4.2%", 
      desc: "Impact: +₹12.8 Cr revenue influence.", 
      type: "success",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    },
    { 
      title: "High drop at Product View → Add to Cart", 
      desc: "Cause: Price sensitivity, Shipping info missing on PDP.", 
      type: "warning",
      badgeColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    },
    { 
      title: "Buy Now users convert 20% better", 
      desc: "Recommendation: Promote Buy Now shortcuts for hot categories.", 
      type: "info",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20"
    }
  ];

  // Journey over time chart dataset
  const journeyTimelineData = [
    { date: "13 May", AppOpened: 128, AddToCart: 22, Checkout: 16, OrderCompleted: 15.1 },
    { date: "20 May", AppOpened: 134, AddToCart: 26, Checkout: 18, OrderCompleted: 16.8 },
    { date: "27 May", AppOpened: 140, AddToCart: 25, Checkout: 17, OrderCompleted: 16.0 },
    { date: "3 Jun", AppOpened: 138, AddToCart: 29, Checkout: 20, OrderCompleted: 18.5 },
    { date: "10 Jun", AppOpened: 149.2, AddToCart: 31, Checkout: 21, OrderCompleted: 19.8 }
  ];

  // Comparison metrics calculations
  const getCompareJourneyMetrics = (metric: "funnel" | "revenue" | "conversion") => {
    if (metric === "conversion") {
      return {
        labelA: "4.82%",
        labelB: "3.48%",
        diff: "+38.5% in favor of Mobile App"
      };
    } else if (metric === "revenue") {
      return {
        labelA: "₹280.4 Cr",
        labelB: "₹147.9 Cr",
        diff: "+89.5% in favor of Mobile App"
      };
    } else {
      return {
        labelA: "App Opened → Payment: 95.3%",
        labelB: "App Opened → Payment: 84.1%",
        diff: "Mobile checkout path features 11.2% lower drop-off rate"
      };
    }
  };

  return (
    <div className="space-y-6 relative pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-slide-in font-medium text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          {toastMessage}
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-bright">User Journey Analysis</h1>
          <p className="text-sm text-text-muted mt-1">
            Explore user navigation paths, understand behavior patterns, and optimize conversion journeys.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => triggerToast("Journey sequence configuration saved successfully")}
            className="h-[36px] bg-transparent hover:bg-slate-800 text-text-bright border border-slate-800 text-xs font-semibold px-4 rounded-lg transition-colors"
          >
            Save Journey
          </button>
          <button 
            onClick={() => triggerToast("Dashboard sharing link generated & copied")}
            className="h-[36px] bg-transparent hover:bg-slate-800 text-text-bright border border-slate-800 text-xs font-semibold px-4 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button 
            onClick={() => triggerToast("Journeys details report generated")}
            className="h-[36px] bg-transparent hover:bg-slate-800 text-text-bright border border-slate-800 text-xs font-semibold px-4 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => setShowAlertModal(true)}
            className="h-[36px] bg-transparent hover:bg-slate-800 text-text-bright border border-slate-800 text-xs font-semibold px-4 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Bell className="w-4 h-4" />
            Create Alert
          </button>
          <button className="h-[36px] bg-transparent hover:bg-slate-800 text-text-bright border border-slate-800 text-xs font-semibold px-3 rounded-lg transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Query Filter Builder Row */}
      <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl flex flex-wrap items-end gap-4 justify-between backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-4">
          {/* Journey Type select */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Journey Type</span>
            <div className="relative">
              <select
                value={journeyType}
                onChange={(e) => {
                  setJourneyType(e.target.value);
                  triggerToast(`Journey model updated: ${e.target.value}`);
                }}
                className="pl-3 pr-8 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:outline-none text-text-bright cursor-pointer appearance-none min-w-[150px]"
              >
                <option value="Purchase Journey">Purchase Journey</option>
                <option value="Acquisition Journey">Acquisition Journey</option>
                <option value="Product Discovery Journey">Product Discovery Journey</option>
                <option value="Checkout Journey">Checkout Journey</option>
                <option value="Post Purchase Journey">Post Purchase Journey</option>
                <option value="Retention Journey">Retention Journey</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Start Event select */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Start Event</span>
            <div className="relative">
              <select
                value={startEvent}
                onChange={(e) => {
                  setStartEvent(e.target.value);
                  triggerToast(`Start node bound to: ${e.target.value}`);
                }}
                className="pl-3 pr-8 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:outline-none text-text-bright cursor-pointer appearance-none min-w-[130px]"
              >
                <option value="App Opened">App Opened</option>
                <option value="Organic Landing">Organic Landing</option>
                <option value="Ads Landing">Ads Landing</option>
                <option value="Homepage Viewed">Homepage Viewed</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* End Event select */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">End Event</span>
            <div className="relative">
              <select
                value={endEvent}
                onChange={(e) => {
                  setEndEvent(e.target.value);
                  triggerToast(`End node bound to: ${e.target.value}`);
                }}
                className="pl-3 pr-8 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:outline-none text-text-bright cursor-pointer appearance-none min-w-[140px]"
              >
                <option value="Order Completed">Order Completed</option>
                <option value="Payment Completed">Payment Completed</option>
                <option value="Add to Cart">Add to Cart</option>
                <option value="Checkout Started">Checkout Started</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Date Selector */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Date Range</span>
            <button
              onClick={() => triggerToast("Date window configuration clicked")}
              className="flex items-center gap-2 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-text-bright hover:bg-slate-800 transition-colors cursor-pointer min-w-[190px]"
            >
              <Calendar className="w-3.5 h-3.5 text-text-muted" />
              <div className="text-left leading-tight">
                <div className="font-semibold text-text-bright">{dateRange}</div>
                <div className="text-[9px] text-text-muted">13 May - 12 June 2026</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted ml-auto" />
            </button>
          </div>

          {/* Compare Selector */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Compare With</span>
            <div className="relative">
              <select
                value={comparePeriod}
                onChange={(e) => {
                  setComparePeriod(e.target.value);
                  triggerToast(`Comparison interval updated: ${e.target.value}`);
                }}
                className="pl-3 pr-8 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:outline-none text-text-bright cursor-pointer appearance-none min-w-[130px]"
              >
                <option value="Previous Period">Previous Period</option>
                <option value="Previous Year">Previous Year</option>
                <option value="No Comparison">No Comparison</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Platform filter */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Platform</span>
            <div className="relative">
              <select
                value={platformFilter}
                onChange={(e) => {
                  setPlatformFilter(e.target.value);
                  triggerToast(`Platform segment filter applied: ${e.target.value}`);
                }}
                className="pl-3 pr-8 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:outline-none text-text-bright cursor-pointer appearance-none min-w-[120px]"
              >
                <option value="All Platforms">All Platforms</option>
                <option value="Mobile App (Android)">Android App</option>
                <option value="Mobile App (iOS)">iOS App</option>
                <option value="Desktop Web">Desktop Web</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Add Filter button */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Filters</span>
            <button
              onClick={() => {
                setShowCompareMode(!showCompareMode);
                triggerToast("Compare Journeys mode toggled! Select paths at the top comparison block.");
              }}
              className={`flex items-center gap-2 px-3 py-2 text-xs border rounded-lg cursor-pointer transition-colors ${
                showCompareMode 
                  ? "bg-primary/10 border-primary/30 text-primary" 
                  : "bg-slate-900 border-slate-800 text-text-bright hover:bg-slate-800"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Compare Journeys</span>
            </button>
          </div>
        </div>

        {/* View mode icons selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 w-full sm:w-auto justify-end sm:justify-start">
          <button 
            onClick={() => setActiveTab("flow")}
            className={`p-1.5 rounded transition-all text-xs font-semibold flex items-center gap-1 ${
              activeTab === "flow" 
                ? "bg-primary text-white" 
                : "text-text-muted hover:text-text-bright hover:bg-slate-900"
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Flow Map</span>
          </button>
          <button 
            onClick={() => setActiveTab("tree")}
            className={`p-1.5 rounded transition-all text-xs font-semibold flex items-center gap-1 ${
              activeTab === "tree" 
                ? "bg-primary text-white" 
                : "text-text-muted hover:text-text-bright hover:bg-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tree View</span>
          </button>
          <button 
            onClick={() => setActiveTab("table")}
            className={`p-1.5 rounded transition-all text-xs font-semibold flex items-center gap-1 ${
              activeTab === "table" 
                ? "bg-primary text-white" 
                : "text-text-muted hover:text-text-bright hover:bg-slate-900"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row (6 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Session card */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-muted">Total Sessions</span>
            <Users className="w-4.5 h-4.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-text-bright">149.2M</div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <span className="text-emerald-400 font-semibold">↑ 12.6%</span>
              <span className="text-text-muted">vs previous period</span>
            </div>
          </div>
        </div>

        {/* Completed Journeys card */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-primary/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-muted">Completed Journeys</span>
            <CheckCircle className="w-4.5 h-4.5 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-text-bright">6.48M</div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <span className="text-emerald-400 font-semibold">↑ 8.3%</span>
              <span className="text-text-muted">vs previous period</span>
            </div>
          </div>
        </div>

        {/* Overall Conversion card */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-purple-500/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-muted">Overall Conv. Rate</span>
            <Percent className="w-4.5 h-4.5 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-emerald-400">4.32%</div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <span className="text-emerald-400 font-semibold">↑ 8.6%</span>
              <span className="text-text-muted">vs previous period</span>
            </div>
          </div>
        </div>

        {/* Avg Journey Duration card */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-pink-500/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-muted">Avg. Journey Time</span>
            <Clock className="w-4.5 h-4.5 text-pink-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-text-bright">12m 34s</div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <span className="text-emerald-400 font-semibold">↓ 4.6%</span>
              <span className="text-text-muted">vs previous period</span>
            </div>
          </div>
        </div>

        {/* Revenue attributed card */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-blue-500/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-muted">Revenue Generated</span>
            <DollarSign className="w-4.5 h-4.5 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-text-bright">₹428.3 Cr</div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <span className="text-emerald-400 font-semibold">↑ 9.4%</span>
              <span className="text-text-muted">vs previous period</span>
            </div>
          </div>
        </div>

        {/* Bounce Rate card */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-red-500/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-muted">Bounce Rate (Step 1)</span>
            <AlertTriangle className="w-4.5 h-4.5 text-red-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-red-400">38.7%</div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <span className="text-red-400 font-semibold">↑ 6.2%</span>
              <span className="text-text-muted">vs previous period</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compare Journeys panel */}
      {showCompareMode && (
        <div className="bg-slate-900 border border-primary/20 rounded-2xl p-5 shadow-2xl relative animate-slide-in">
          <button 
            onClick={() => setShowCompareMode(false)}
            className="absolute top-4 right-4 text-text-muted hover:text-text-bright"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-text-bright flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                Journey Comparison Mode
              </h3>
              <p className="text-[11px] text-text-muted">Compare step conversions, session volume, and attributed revenues across platforms.</p>
            </div>
            <div className="flex items-center gap-2.5">
              <select 
                value={compareJourneyA}
                onChange={(e) => {
                  setCompareJourneyA(e.target.value);
                  triggerToast(`Journey A updated: ${e.target.value}`);
                }}
                className="px-2.5 py-1.5 text-[11px] bg-slate-950 border border-slate-800 rounded-lg text-text-bright cursor-pointer"
              >
                <option value="Mobile App">Mobile App</option>
                <option value="Web Desktop">Web Desktop</option>
                <option value="Android Smartphone">Android Smartphone</option>
                <option value="iOS Smartphone">iOS Smartphone</option>
              </select>
              <span className="text-[10px] text-text-muted uppercase font-bold font-mono">VS</span>
              <select 
                value={compareJourneyB}
                onChange={(e) => {
                  setCompareJourneyB(e.target.value);
                  triggerToast(`Journey B updated: ${e.target.value}`);
                }}
                className="px-2.5 py-1.5 text-[11px] bg-slate-950 border border-slate-800 rounded-lg text-text-bright cursor-pointer"
              >
                <option value="Mobile App">Mobile App</option>
                <option value="Web Desktop">Web Desktop</option>
                <option value="Android Smartphone">Android Smartphone</option>
                <option value="iOS Smartphone">iOS Smartphone</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-[10px] text-text-muted uppercase font-bold">Overall Conversion</span>
              <div className="flex justify-between items-baseline pt-1">
                <div className="text-xs text-text-muted">{compareJourneyA}: <span className="font-semibold text-text-bright">{getCompareJourneyMetrics("conversion").labelA}</span></div>
                <div className="text-xs text-text-muted">{compareJourneyB}: <span className="font-semibold text-text-bright">{getCompareJourneyMetrics("conversion").labelB}</span></div>
              </div>
              <div className="pt-2 border-t border-slate-900/50 text-[10px] text-emerald-400 font-semibold">
                {getCompareJourneyMetrics("conversion").diff}
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-[10px] text-text-muted uppercase font-bold">Revenue Attributed</span>
              <div className="flex justify-between items-baseline pt-1">
                <div className="text-xs text-text-muted">{compareJourneyA}: <span className="font-semibold text-text-bright">{getCompareJourneyMetrics("revenue").labelA}</span></div>
                <div className="text-xs text-text-muted">{compareJourneyB}: <span className="font-semibold text-text-bright">{getCompareJourneyMetrics("revenue").labelB}</span></div>
              </div>
              <div className="pt-2 border-t border-slate-900/50 text-[10px] text-emerald-400 font-semibold">
                {getCompareJourneyMetrics("revenue").diff}
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-[10px] text-text-muted uppercase font-bold">Funnel Velocity Difference</span>
              <div className="flex justify-between items-baseline pt-1 flex-col gap-0.5">
                <div className="text-[10px] text-text-muted">{compareJourneyA}: <span className="font-semibold text-text-bright">{getCompareJourneyMetrics("funnel").labelA}</span></div>
                <div className="text-[10px] text-text-muted">{compareJourneyB}: <span className="font-semibold text-text-bright">{getCompareJourneyMetrics("funnel").labelB}</span></div>
              </div>
              <div className="pt-2 border-t border-slate-900/50 text-[10px] text-emerald-400 font-semibold">
                {getCompareJourneyMetrics("funnel").diff}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Journey Flow Map canvas (Sankey SVG style wrapper) */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <GitFork className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-bright">User Journey Flow Map</h2>
              <p className="text-xs text-text-muted">Visualize the most common user paths from entry to conversion.</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 text-[11px] text-text-muted">
              <span>Display</span>
              <select
                value={topPathsCount}
                onChange={(e) => setTopPathsCount(e.target.value)}
                className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-text-bright cursor-pointer"
              >
                <option value="Top 3 Paths">Top 3 Paths</option>
                <option value="Top 5 Paths">Top 5 Paths</option>
                <option value="All Paths">All Paths</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 text-[11px] text-text-muted">
              <span>Show Drop-offs</span>
              <button
                onClick={() => setShowDropoffsToggle(!showDropoffsToggle)}
                className={`w-8 h-4 rounded-full transition-all relative ${
                  showDropoffsToggle ? "bg-emerald-500" : "bg-slate-800"
                }`}
              >
                <div 
                  className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${
                    showDropoffsToggle ? "left-4.5" : "left-0.5"
                  }`} 
                />
              </button>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-text-muted">
              <span>Path Metrics</span>
              <select
                value={pathMetricsFilter}
                onChange={(e) => setPathMetricsFilter(e.target.value)}
                className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-text-bright cursor-pointer"
              >
                <option value="Users">Users</option>
                <option value="Percentage">Percentage</option>
                <option value="Revenue">Revenue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Large Scrollable Flow Canvas */}
        <div className="relative overflow-x-auto py-6">
          <div className="min-w-[1100px] flex items-center justify-between gap-1 relative pl-28 pr-32">
            
            {/* Left side Legend panel inside canvas */}
            <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-center gap-2 bg-slate-950/40 p-2.5 border border-slate-850 rounded-xl z-20">
              <span className="text-[9px] uppercase font-bold text-text-muted">Top 3 Paths</span>
              <div className="space-y-1.5 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="text-text-bright font-medium">60.2%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                  <span className="text-text-bright font-medium">28.4%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                  <span className="text-text-bright font-medium">11.4%</span>
                </div>
              </div>
            </div>

            {/* Right side conversion indicator panel */}
            <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-center items-center bg-slate-950/40 p-3 border border-slate-850 rounded-xl z-20 w-28 text-center gap-0.5">
              <span className="text-[9px] uppercase font-bold text-text-muted">Conversion</span>
              <div className="text-base font-extrabold text-text-bright mt-0.5">6.48M</div>
              <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                4.32%
              </div>
              <span className="text-[7px] text-text-muted uppercase font-semibold">Overall Conv.</span>
            </div>

            {/* Horizontal Nodes Sequence */}
            {journeyNodes.map((node, idx) => {
              const isActive = selectedNode?.name === node.name;
              
              // Color highlight class names based on index/outcome
              let headerColor = "bg-slate-900 border-slate-800 text-text-bright";
              if (node.name === "Order Completed") {
                headerColor = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
              }

              return (
                <React.Fragment key={idx}>
                  {/* Step Node Card */}
                  <div 
                    onClick={() => {
                      setSelectedNode(node);
                      triggerToast(`Inspecting flow analytics for step: '${node.name}'`);
                    }}
                    className={`flex-shrink-0 w-[105px] bg-slate-950 border rounded-xl p-2.5 cursor-pointer relative hover:border-primary transition-all z-10 text-left ${
                      isActive 
                        ? "border-primary ring-1 ring-primary/45 shadow-lg shadow-primary/10" 
                        : "border-slate-800"
                    } ${headerColor}`}
                  >
                    <div className="text-[8px] uppercase font-bold text-text-muted flex items-center gap-1 truncate">
                      <span className="text-[9px] text-primary font-bold">{node.stepIndex}</span>
                      {node.name}
                    </div>
                    <div className="text-sm font-extrabold text-text-bright mt-1 font-mono">{node.users}</div>
                    <div className="text-[10px] text-text-muted mt-0.5 font-semibold font-mono">{node.conversion}</div>
                  </div>

                  {/* Bezier ribbon connector between steps */}
                  {idx < journeyNodes.length - 1 && (
                    <div className="flex-grow min-w-[32px] h-14 relative flex flex-col justify-center">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        <defs>
                          <linearGradient id={`gradPath1-${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.25" />
                          </linearGradient>
                          <linearGradient id={`gradPath2-${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
                          </linearGradient>
                          <linearGradient id={`gradPath3-${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.15" />
                          </linearGradient>
                        </defs>

                        {/* Bezier ribbons */}
                        <path 
                          d="M -2 14 C 15 14, 15 18, 34 18 L 34 26 C 15 26, 15 20, -2 20 Z" 
                          fill={`url(#gradPath1-${idx})`} 
                          stroke="#10B981" 
                          strokeWidth="0.5" 
                          strokeOpacity="0.3"
                        />
                        <path 
                          d="M -2 24 C 15 24, 15 28, 34 28 L 34 33 C 15 33, 15 28, -2 28 Z" 
                          fill={`url(#gradPath2-${idx})`} 
                          stroke="#3B82F6" 
                          strokeWidth="0.5" 
                          strokeOpacity="0.3"
                        />
                        <path 
                          d="M -2 36 C 15 36, 15 38, 34 38 L 34 40 C 15 40, 15 38, -2 38 Z" 
                          fill={`url(#gradPath3-${idx})`} 
                          stroke="#8B5CF6" 
                          strokeWidth="0.5" 
                          strokeOpacity="0.2"
                        />
                      </svg>
                      
                      {/* Drop-offs percentage footer */}
                      {showDropoffsToggle && (
                        <div className="absolute top-[48px] left-1/2 -translate-x-1/2 z-10 text-center pointer-events-auto w-24">
                          <span className="text-[8px] font-bold text-red-400 block truncate">
                            {idx === 0 ? "50.5M" : idx === 1 ? "37.4M" : idx === 2 ? "37.3M" : idx === 3 ? "14.6M" : idx === 4 ? "2.5M" : idx === 5 ? "320K" : "0"}
                          </span>
                          <span className="text-[7px] text-red-500 font-semibold block leading-none">
                            {idx === 0 ? "33.8% drop" : idx === 1 ? "37.9% drop" : idx === 2 ? "61.0% drop" : idx === 3 ? "61.1% drop" : idx === 4 ? "26.9% drop" : idx === 5 ? "4.7% drop" : "0% drop"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}

          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span>Click on any step card node to isolate flow drops, conversions, and view detailed user details.</span>
          </div>
          <span className="font-semibold text-emerald-400">● Realtime Sync</span>
        </div>
      </div>

      {/* Row 4 Analytics deck (4-columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Drop-off Analysis */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-3">
              <h2 className="text-sm font-bold text-text-bright">Drop-off Analysis</h2>
              <p className="text-[10px] text-text-muted">Identify where users abandon their journey.</p>
            </div>
            
            <div className="overflow-y-auto max-h-[180px] pr-1">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-slate-800 text-text-muted text-[8px] uppercase font-bold">
                    <th className="py-1">Step</th>
                    <th className="py-1 text-right">Lost</th>
                    <th className="py-1 text-right">Rate</th>
                    <th className="py-1 text-center">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {dropoffData.map((row, idx) => {
                    const isCrit = row.severity === "Critical";
                    const isHigh = row.severity === "High";
                    const badgeClass = isCrit 
                      ? "bg-red-500/10 text-red-400 border-red-500/20" 
                      : isHigh 
                        ? "bg-orange-500/10 text-orange-400 border-orange-500/20" 
                        : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
                    return (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2 font-medium text-text-bright">{row.step}</td>
                        <td className="py-2 text-right font-mono text-text-muted">{row.dropped}</td>
                        <td className="py-2 text-right font-mono font-bold text-red-400">{row.rate}</td>
                        <td className="py-2 text-center">
                          <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded border ${badgeClass}`}>
                            {row.severity}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-[8px] text-text-muted pt-2 border-t border-slate-800 flex justify-between">
            <span>Critical impact: Search → PDP</span>
            <span className="text-red-400 font-semibold font-mono">₹120.3Cr Risk</span>
          </div>
        </div>

        {/* Card 2: Journey Path Performance */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-3">
              <h2 className="text-sm font-bold text-text-bright">Journey Path Performance</h2>
              <p className="text-[10px] text-text-muted">Key statistics by different user paths.</p>
            </div>

            <div className="overflow-y-auto max-h-[180px] pr-1">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-slate-800 text-text-muted text-[8px] uppercase font-bold">
                    <th className="py-1">Path</th>
                    <th className="py-1 text-right">Users</th>
                    <th className="py-1 text-right">Conv.</th>
                    <th className="py-1 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {pathPerformanceData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 font-medium text-text-bright">{row.pathName}</td>
                      <td className="py-2.5 text-right font-mono text-text-muted">{row.users}</td>
                      <td className="py-2.5 text-right font-mono font-semibold text-emerald-400">{row.conversion}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-text-bright">{row.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-[8px] text-text-muted pt-2 border-t border-slate-800">
            Path 1 drives 73.1% of total attributed revenue
          </div>
        </div>

        {/* Card 3: Journey Heatmap */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4">
              <h2 className="text-sm font-bold text-text-bright">Journey Heatmap</h2>
              <p className="text-[10px] text-text-muted">Users count intensity across steps.</p>
            </div>

            {/* Heatmap grid */}
            <div className="space-y-2">
              <div className="flex items-center text-[8px] uppercase font-bold text-text-muted">
                <span className="w-12">Path</span>
                <div className="flex-1 flex justify-between">
                  <span>S1</span>
                  <span>S2</span>
                  <span>S3</span>
                  <span>S4</span>
                  <span>S5</span>
                  <span>S6</span>
                  <span>S7</span>
                  <span>S8</span>
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-1.5">
                {/* Path 1 */}
                <div className="flex items-center text-xs">
                  <span className="w-12 text-[9px] text-text-muted font-bold">Path 1</span>
                  <div className="flex-1 flex gap-1 h-5">
                    <div className="flex-1 bg-emerald-500 rounded-sm" title="149.2M" />
                    <div className="flex-1 bg-emerald-600 rounded-sm" title="98.7M" />
                    <div className="flex-1 bg-emerald-700 rounded-sm" title="61.3M" />
                    <div className="flex-1 bg-emerald-800 rounded-sm" title="23.9M" />
                    <div className="flex-1 bg-emerald-900 rounded-sm" title="9.3M" />
                    <div className="flex-1 bg-emerald-950 rounded-sm" title="6.8M" />
                    <div className="flex-1 bg-emerald-950 rounded-sm" title="6.48M" />
                    <div className="flex-1 bg-emerald-950 rounded-sm" title="6.48M" />
                  </div>
                </div>

                {/* Path 2 */}
                <div className="flex items-center text-xs">
                  <span className="w-12 text-[9px] text-text-muted font-bold">Path 2</span>
                  <div className="flex-1 flex gap-1 h-5">
                    <div className="flex-1 bg-blue-500 rounded-sm" />
                    <div className="flex-1 bg-blue-600 rounded-sm" />
                    <div className="flex-1 bg-blue-700 rounded-sm" />
                    <div className="flex-1 bg-blue-800 rounded-sm" />
                    <div className="flex-1 bg-blue-900 rounded-sm" />
                    <div className="flex-1 bg-blue-950 rounded-sm" />
                    <div className="flex-1 bg-blue-950 rounded-sm" />
                    <div className="flex-1 bg-slate-950 rounded-sm" />
                  </div>
                </div>

                {/* Path 3 */}
                <div className="flex items-center text-xs">
                  <span className="w-12 text-[9px] text-text-muted font-bold">Path 3</span>
                  <div className="flex-1 flex gap-1 h-5">
                    <div className="flex-1 bg-purple-500 rounded-sm" />
                    <div className="flex-1 bg-purple-600 rounded-sm" />
                    <div className="flex-1 bg-purple-700 rounded-sm" />
                    <div className="flex-1 bg-purple-800 rounded-sm" />
                    <div className="flex-1 bg-purple-900 rounded-sm" />
                    <div className="flex-1 bg-slate-950 rounded-sm" />
                    <div className="flex-1 bg-slate-950 rounded-sm" />
                    <div className="flex-1 bg-slate-950 rounded-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[8px] text-text-muted">
            <span>Low Users</span>
            <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-950 to-emerald-500 rounded-sm" />
            <span>High Users</span>
          </div>
        </div>

        {/* Card 4: Top Paths bullets list */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-3">
              <h2 className="text-sm font-bold text-text-bright">Top Paths</h2>
              <p className="text-[10px] text-text-muted">Most common user paths.</p>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[170px] pr-1 text-[11px]">
              {topPathsBullets.map((path) => (
                <div key={path.rank} className="space-y-1 pb-2 border-b border-slate-850 last:border-0">
                  <div className="flex items-center justify-between font-bold text-text-bright">
                    <span className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-800 text-[8px] font-mono flex items-center justify-center text-primary">{path.rank}</span>
                      Path {path.rank}
                    </span>
                    <span className="text-primary font-mono">{path.pct} ({path.vol})</span>
                  </div>
                  <p className="text-[10px] text-text-muted leading-tight font-medium pl-4">
                    {path.seq}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => triggerToast("Loading user path sequences exploration view...")}
            className="text-[10px] text-primary hover:underline text-left font-semibold flex items-center gap-1 mt-1"
          >
            View All Paths →
          </button>
        </div>
      </div>

      {/* Row 5 bottom analytics deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* User Segments in Journey */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-3">
              <h2 className="text-sm font-bold text-text-bright">User Segments in Journey</h2>
              <p className="text-[10px] text-text-muted">Journey performance by user segments.</p>
            </div>

            <div className="overflow-y-auto max-h-[180px] pr-1">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-slate-800 text-text-muted text-[8px] uppercase font-bold">
                    <th className="py-1">Segment</th>
                    <th className="py-1 text-right">Conv.</th>
                    <th className="py-1 text-right">Revenue</th>
                    <th className="py-1 text-center">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {segmentsInJourney.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 font-medium text-text-bright">{row.name}</td>
                      <td className="py-2.5 text-right font-mono text-emerald-400 font-semibold">{row.conversion}</td>
                      <td className="py-2.5 text-right font-mono text-text-muted">{row.revenue}</td>
                      <td className="py-2.5 text-center">
                        <span className={`font-bold ${row.color}`}>
                          {row.trend === "up" ? "↑" : "↓"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-[8px] text-text-muted pt-2 border-t border-slate-800">
            Premium users convert 1.8x better than overall baseline
          </div>
        </div>

        {/* Journey Over Time line chart */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-3 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-text-bright">Journey Over Time</h2>
                <p className="text-[10px] text-text-muted">Total users progressing through journey over time.</p>
              </div>
              <span className="text-[8px] bg-slate-950 border border-slate-850 px-1.5 py-0.5 rounded text-text-muted font-bold uppercase">Daily</span>
            </div>

            <div className="h-40 w-full mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={journeyTimelineData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0b0f19", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    itemStyle={{ fontSize: "10px" }}
                  />
                  <Line type="monotone" dataKey="AppOpened" stroke="#10B981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="AddToCart" stroke="#3B82F6" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="Checkout" stroke="#8B5CF6" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="OrderCompleted" stroke="#F59E0B" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-[8px] text-text-muted pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> App Open</span>
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" /> Cart Adds</span>
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" /> Checkout</span>
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" /> Success</span>
          </div>
        </div>

        {/* Funnel conversion cumulative progress bars */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-3">
              <h2 className="text-sm font-bold text-text-bright">Funnel Conversion</h2>
              <p className="text-[10px] text-text-muted">Step-by-step conversion breakdown.</p>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[180px] pr-1 text-[11px]">
              {journeyNodes.map((node) => (
                <div key={node.stepIndex} className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-text-bright">{node.stepIndex}. {node.name}</span>
                    <span className="text-text-muted text-[10px] font-mono">{node.users} ({node.conversion})</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: node.conversion }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[8px] text-text-muted pt-2 border-t border-slate-800">
            Baseline conversion computed on all sessions
          </div>
        </div>

        {/* AI Journey Insights */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-3">
              <h2 className="text-sm font-bold text-text-bright">AI Journey Insights</h2>
              <p className="text-[10px] text-text-muted">Smart insights to improve user journeys.</p>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[185px] pr-1 text-[11px]">
              {aiJourneyInsights.map((insight, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-850 p-2.5 rounded-lg space-y-1 flex flex-col">
                  <div className="flex items-center gap-1.5 justify-between">
                    <span className="font-bold text-text-bright leading-tight">{insight.title}</span>
                    <span className={`px-1 py-0.5 rounded text-[7px] font-bold border flex-shrink-0 uppercase ${insight.badgeColor}`}>
                      {insight.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted leading-tight">{insight.desc}</p>
                  <button 
                    onClick={() => triggerToast(`AI Diagnosis details panel activated: ${insight.title}`)}
                    className="text-[9px] text-primary hover:underline font-semibold mt-1 self-start cursor-pointer"
                  >
                    {insight.type === "success" ? "View Analysis" : insight.type === "warning" ? "View Users" : "View Details"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => triggerToast("Launching Journey AI Diagnostics Center...")}
            className="text-[10px] text-primary hover:underline text-left font-semibold flex items-center gap-1 mt-1.5"
          >
            View All Insights →
          </button>
        </div>
      </div>

      {/* Info panel footer */}
      <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-950 border border-slate-850 rounded-lg text-primary">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-bright">About Journey Flows</h4>
            <p className="text-[10px] text-text-muted mt-0.5">
              Flow maps represent the visual path transitions users follow. Green highlights steps with high conversions, and drop-offs represent users exiting the path.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-semibold">
          <button 
            onClick={() => triggerToast("Launching walkthrough guide: Journeys 101...")}
            className="text-text-muted hover:text-text-bright flex items-center gap-1"
          >
            <Play className="w-3.5 h-3.5" />
            Learn Journeys
          </button>
          <button 
            onClick={() => triggerToast("Opening Journeys documentation...")}
            className="text-text-muted hover:text-text-bright flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            View documentation
          </button>
        </div>
      </div>

      {/* Dynamic Popover/Overlay showing Step details when node is selected */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setSelectedNode(null)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl h-full flex flex-col justify-between z-10 animate-slide-left p-6">
            <div className="space-y-6 overflow-y-auto max-h-[85vh] pr-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-850">
                    <GitFork className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-bright">Step {selectedNode.stepIndex}: {selectedNode.name}</h3>
                    <span className="text-[8px] bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-text-muted font-bold uppercase">Node analytics</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-text-muted hover:text-text-bright transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Node statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/60 border border-slate-850 p-3 rounded-lg text-left">
                  <span className="text-[10px] text-text-muted uppercase font-bold">Step Traffic</span>
                  <div className="text-base font-bold text-text-bright mt-0.5">{selectedNode.users}</div>
                </div>
                <div className="bg-slate-950/60 border border-slate-850 p-3 rounded-lg text-left">
                  <span className="text-[10px] text-text-muted uppercase font-bold">Step Conversion</span>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">{selectedNode.conversion}</div>
                </div>
                <div className="bg-slate-950/60 border border-slate-850 p-3 rounded-lg text-left">
                  <span className="text-[10px] text-text-muted uppercase font-bold">Median Duration</span>
                  <div className="text-base font-bold text-text-bright mt-0.5">{selectedNode.avgTime}</div>
                </div>
                <div className="bg-slate-950/60 border border-slate-850 p-3 rounded-lg text-left">
                  <span className="text-[10px] text-text-muted uppercase font-bold">Influenced GMV</span>
                  <div className="text-base font-bold text-text-bright mt-0.5">{selectedNode.revenue}</div>
                </div>
              </div>

              {/* Step friction insights */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-text-bright border-b border-slate-800 pb-2">Drop-off Friction Diagnostics</h4>
                <div className="space-y-3 text-xs">
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-850">
                    <span className="text-[8px] uppercase font-bold text-red-400">Top Drop-off Exit Destination</span>
                    <p className="text-text-bright font-semibold mt-1">App Close / Abandonment (64.2%)</p>
                  </div>

                  <div className="p-2.5 rounded bg-slate-950 border border-slate-850">
                    <span className="text-[8px] uppercase font-bold text-text-muted">Primary Exit Causes</span>
                    <ul className="list-disc pl-4 mt-1 space-y-1 text-[10px] text-text-muted">
                      <li>Device performance / app lag spikes</li>
                      <li>Category filters confusion</li>
                      <li>Item recommendations unrelated to search intent</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 flex gap-3">
              <button 
                onClick={() => {
                  setSelectedNode(null);
                  triggerToast(`Alert configured for ${selectedNode.name} drop-off rate.`);
                }}
                className="flex-1 bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                Monitor Drop-offs
              </button>
              <button 
                onClick={() => {
                  setSelectedNode(null);
                  triggerToast(`Users list sync initiated for step: ${selectedNode.name}`);
                }}
                className="flex-1 bg-transparent hover:bg-slate-800 text-text-bright border border-slate-800 text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                Inspect User Profiles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Alert Modal Dial */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          <div 
            onClick={() => setShowAlertModal(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
          />

          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 z-10 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-text-bright">Create Journey Alert</h3>
              </div>
              <button 
                onClick={() => setShowAlertModal(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-text-muted hover:text-text-bright transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alert fields */}
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] text-text-muted uppercase font-bold">Alert Title</label>
                <input
                  type="text"
                  value={alertName}
                  onChange={(e) => setAlertName(e.target.value)}
                  placeholder="e.g., Checkout Drop-off Spike Alert"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-text-bright focus:outline-none focus:border-primary placeholder-text-muted"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-text-muted uppercase font-bold">Journey Step Transition</label>
                <select
                  value={alertStep}
                  onChange={(e) => setAlertStep(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-text-bright focus:outline-none"
                >
                  <option value="Home Page → Search">Home Page → Search</option>
                  <option value="Search → Product View">Search → Product View</option>
                  <option value="Product View → Add to Cart">Product View → Add to Cart</option>
                  <option value="Add to Cart → Checkout">Add to Cart → Checkout</option>
                  <option value="Checkout → Payment">Checkout → Payment</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-text-muted uppercase font-bold">Drop-off Threshold (%)</label>
                <input
                  type="number"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-text-bright focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-text-muted uppercase font-bold">Notification Targets</label>
                <select
                  value={alertChannel}
                  onChange={(e) => setAlertChannel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-text-bright focus:outline-none"
                >
                  <option value="Slack (#growth-alerts)">Slack (#growth-alerts)</option>
                  <option value="Slack (#ops-warnings)">Slack (#ops-warnings)</option>
                  <option value="Email (PM team)">Email (PM team)</option>
                </select>
              </div>
            </div>

            {/* Modal actions */}
            <div className="border-t border-slate-800 pt-4 flex justify-end gap-3">
              <button 
                onClick={() => setShowAlertModal(false)}
                className="bg-transparent hover:bg-slate-800 border border-slate-800 text-text-bright text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (!alertName.trim()) {
                    triggerToast("Error: Alert title cannot be blank!");
                    return;
                  }
                  setShowAlertModal(false);
                  triggerToast(`Alert '${alertName}' successfully activated and registered!`);
                }}
                className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
