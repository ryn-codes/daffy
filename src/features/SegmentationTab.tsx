"use client";

import React, { useState } from "react";
import { 
  Activity, 
  Users, 
  TrendingUp, 
  BarChart, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon, 
  Globe, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Plus, 
  Share2, 
  Download, 
  MoreHorizontal, 
  ChevronDown, 
  Filter, 
  X, 
  HelpCircle, 
  Layers, 
  Calendar,
  Check,
  Zap,
  Percent,
  Play,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Info
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
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
interface SegmentDataRow {
  name: string;
  events: string;
  eventsVal: number;
  users: string;
  usersVal: number;
  eventsPerUser: number;
  pctEvents: number;
  trend: number[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bounceRate: string;
  avgDuration: string;
  conversion: string;
  revenue: string;
}

interface FilterCondition {
  field: string;
  operator: string;
  value: string;
}

export default function SegmentationTab() {
  // Query Builder states
  const [selectedEvent, setSelectedEvent] = useState("page_view");
  const [segmentProperty, setSegmentProperty] = useState("Device Type");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [comparePeriod, setComparePeriod] = useState("Previous Period");
  const [breakdownBy, setBreakdownBy] = useState("Select Property");
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");

  // Interaction states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [showCompareMode, setShowCompareMode] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<SegmentDataRow | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compare A vs B State
  const [compareSegmentA, setCompareSegmentA] = useState("Android Smartphone");
  const [compareSegmentB, setCompareSegmentB] = useState("iOS Smartphone");

  // Filter builder conditions
  const [filters, setFilters] = useState<FilterCondition[]>([
    { field: "Country", operator: "=", value: "India" },
    { field: "City", operator: "=", value: "Bangalore" },
    { field: "Orders", operator: ">", value: "5" }
  ]);

  // Create modal rules
  const [newSegmentName, setNewSegmentName] = useState("");
  const [newSegmentRules, setNewSegmentRules] = useState([
    { field: "Category", operator: "=", value: "Electronics" },
    { field: "Orders", operator: ">", value: "5" },
    { field: "Revenue", operator: ">", value: "50000" }
  ]);

  // Active insights segment filter
  const [insightsSegment, setInsightsSegment] = useState("Mobile");

  // Property Breakdown selector
  const [breakdownProperty, setBreakdownProperty] = useState("Operating System");

  // Toast trigger helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Base Segment Dataset matching mockup
  const segmentDataset: SegmentDataRow[] = [
    { 
      name: "Mobile", 
      events: "107.6M", eventsVal: 107600000,
      users: "17.9M", usersVal: 17900000,
      eventsPerUser: 6.0, pctEvents: 72.3, 
      trend: [12, 15, 13, 16, 14, 18, 17], 
      icon: Smartphone, color: "#10B981",
      bounceRate: "41.2%", avgDuration: "3m 24s", conversion: "7.8%", revenue: "₹240Cr"
    },
    { 
      name: "Desktop", 
      events: "23.4M", eventsVal: 23400000,
      users: "4.7M", usersVal: 4700000,
      eventsPerUser: 5.0, pctEvents: 15.7, 
      trend: [5, 4.8, 5.2, 5.5, 5.1, 5.8, 5.4], 
      icon: Laptop, color: "#3B82F6",
      bounceRate: "32.1%", avgDuration: "5m 12s", conversion: "9.4%", revenue: "₹180Cr"
    },
    { 
      name: "Tablet", 
      events: "10.2M", eventsVal: 10200000,
      users: "1.8M", usersVal: 1800000,
      eventsPerUser: 5.7, pctEvents: 6.9, 
      trend: [1.8, 1.9, 1.7, 2.0, 1.8, 2.2, 2.1], 
      icon: Tablet, color: "#8B5CF6",
      bounceRate: "39.8%", avgDuration: "4m 08s", conversion: "6.2%", revenue: "₹40Cr"
    },
    { 
      name: "Android Smartphone", 
      events: "57.3M", eventsVal: 57300000,
      users: "10.2M", usersVal: 10200000,
      eventsPerUser: 5.6, pctEvents: 38.6, 
      trend: [8, 8.5, 9.2, 8.8, 9.5, 9.1, 9.8], 
      icon: Smartphone, color: "#10B981",
      bounceRate: "43.5%", avgDuration: "3m 05s", conversion: "7.2%", revenue: "₹130Cr"
    },
    { 
      name: "iOS Smartphone", 
      events: "40.3M", eventsVal: 40300000,
      users: "6.4M", usersVal: 6400000,
      eventsPerUser: 6.3, pctEvents: 27.1, 
      trend: [5.8, 6.2, 6.8, 6.4, 7.0, 6.9, 7.4], 
      icon: Smartphone, color: "#EC4899",
      bounceRate: "37.6%", avgDuration: "3m 48s", conversion: "8.9%", revenue: "₹110Cr"
    },
    { 
      name: "Web Desktop", 
      events: "19.1M", eventsVal: 19100000,
      users: "4.0M", usersVal: 4000000,
      eventsPerUser: 4.8, pctEvents: 12.8, 
      trend: [3.4, 3.8, 4.0, 3.7, 4.1, 3.9, 4.3], 
      icon: Laptop, color: "#3B82F6",
      bounceRate: "31.4%", avgDuration: "5m 25s", conversion: "9.8%", revenue: "₹150Cr"
    },
    { 
      name: "Web Tablet", 
      events: "4.3M", eventsVal: 4300000,
      users: "0.7M", usersVal: 700000,
      eventsPerUser: 6.1, pctEvents: 2.9, 
      trend: [0.65, 0.8, 0.85, 0.78, 0.9, 0.82, 0.95], 
      icon: Tablet, color: "#8B5CF6",
      bounceRate: "38.5%", avgDuration: "4m 20s", conversion: "6.8%", revenue: "₹18Cr"
    },
    { 
      name: "Others", 
      events: "7.5M", eventsVal: 7500000,
      users: "1.2M", usersVal: 1200000,
      eventsPerUser: 6.25, pctEvents: 5.1, 
      trend: [0.9, 1.1, 1.0, 1.2, 1.1, 1.3, 1.25], 
      icon: HelpCircle, color: "#F59E0B",
      bounceRate: "42.0%", avgDuration: "2m 50s", conversion: "5.4%", revenue: "₹12Cr"
    }
  ];

  // Donut chart representation
  const distributionDonutData = [
    { name: "Mobile", value: 72.3, count: "107.6M", color: "#10B981" },
    { name: "Desktop", value: 15.7, count: "23.4M", color: "#3B82F6" },
    { name: "Tablet", value: 6.9, count: "10.2M", color: "#8B5CF6" },
    { name: "Others", value: 5.1, count: "7.5M", color: "#F59E0B" }
  ];

  // Trends Over Time mapping from May 13 to June 10
  const trendChartData = [
    { date: "13 May", Mobile: 18.2, Desktop: 4.1, Tablet: 1.8, Others: 0.9 },
    { date: "20 May", Mobile: 21.4, Desktop: 4.5, Tablet: 1.9, Others: 1.0 },
    { date: "27 May", Mobile: 23.8, Desktop: 4.9, Tablet: 2.1, Others: 1.2 },
    { date: "3 Jun", Mobile: 22.1, Desktop: 4.7, Tablet: 2.0, Others: 1.1 },
    { date: "10 Jun", Mobile: 24.6, Desktop: 5.1, Tablet: 2.3, Others: 1.3 }
  ];

  // Property breakdown horizontal bars options
  const propertyBreakdownMock: Record<string, { label: string; pct: number; count: string; color: string }[]> = {
    "Operating System": [
      { label: "Android", pct: 68.4, count: "73.6M", color: "#10B981" },
      { label: "iOS", pct: 27.1, count: "29.1M", color: "#EC4899" },
      { label: "Windows", pct: 3.2, count: "3.5M", color: "#3B82F6" },
      { label: "Others", pct: 1.3, count: "1.4M", color: "#F59E0B" }
    ],
    "Device Type": [
      { label: "Mobile", pct: 72.3, count: "107.6M", color: "#10B981" },
      { label: "Desktop", pct: 15.7, count: "23.4M", color: "#3B82F6" },
      { label: "Tablet", pct: 6.9, count: "10.2M", color: "#8B5CF6" },
      { label: "Smart TV/Other", pct: 5.1, count: "7.5M", color: "#F59E0B" }
    ],
    "Country": [
      { label: "India", pct: 64.7, count: "96.2M", color: "#10B981" },
      { label: "USA", pct: 12.4, count: "18.4M", color: "#3B82F6" },
      { label: "UK", pct: 4.5, count: "6.7M", color: "#8B5CF6" },
      { label: "Others", pct: 18.4, count: "27.4M", color: "#F59E0B" }
    ]
  };

  // Geographics Split
  const geographySplit = [
    { country: "India", events: "96.2M", pct: "64.7%" },
    { country: "USA", events: "18.4M", pct: "12.4%" },
    { country: "UK", events: "6.7M", pct: "4.5%" },
    { country: "Canada", events: "4.2M", pct: "2.8%" },
    { country: "Australia", events: "3.8M", pct: "2.6%" }
  ];

  // Device Category metrics
  const deviceCategoryPerformance = [
    { category: "Mobile", bounceRate: "41.2%", avgDuration: "3m 24s", conversion: "7.8%", revenue: "₹240Cr" },
    { category: "Desktop", bounceRate: "32.1%", avgDuration: "5m 12s", conversion: "9.4%", revenue: "₹180Cr" },
    { category: "Tablet", bounceRate: "39.8%", avgDuration: "4m 08s", conversion: "6.2%", revenue: "₹40Cr" }
  ];

  // Segment Insights calculations based on selection
  const getInsightsData = (segName: string) => {
    const matched = segmentDataset.find(s => s.name.toLowerCase() === segName.toLowerCase()) || segmentDataset[0];
    return {
      events: matched.events,
      users: matched.users,
      conversion: matched.conversion,
      eventsPerUser: matched.eventsPerUser.toFixed(1),
      pctTotal: `${matched.pctEvents}%`
    };
  };

  const insightsData = getInsightsData(insightsSegment);

  // Sparkline generator
  const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
    const width = 80;
    const height = 24;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min === 0 ? 1 : max - min;
    const points = data
      .map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height + 2;
        return `${x},${y}`;
      })
      .join(" ");
    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };

  // Segment A vs Segment B comparison details
  const getCompareMetric = (metric: "conversion" | "ltv" | "revenue" | "retention") => {
    const sA = segmentDataset.find(s => s.name === compareSegmentA) || segmentDataset[3];
    const sB = segmentDataset.find(s => s.name === compareSegmentB) || segmentDataset[4];

    if (metric === "conversion") {
      const valA = parseFloat(sA.conversion);
      const valB = parseFloat(sB.conversion);
      const diff = valB - valA;
      const pctDiff = ((diff / valA) * 100).toFixed(1);
      return {
        labelA: sA.conversion,
        labelB: sB.conversion,
        leader: diff > 0 ? compareSegmentB : compareSegmentA,
        diffText: `${Math.abs(diff).toFixed(1)}% (${diff > 0 ? "+" : ""}${pctDiff}%)`
      };
    } else if (metric === "ltv") {
      const valA = sA.name.includes("iOS") ? 6300 : 5600;
      const valB = sB.name.includes("iOS") ? 6300 : 5600;
      const diff = valB - valA;
      const pctDiff = ((diff / valA) * 100).toFixed(1);
      return {
        labelA: `₹${valA.toLocaleString()}`,
        labelB: `₹${valB.toLocaleString()}`,
        leader: diff > 0 ? compareSegmentB : compareSegmentA,
        diffText: `₹${Math.abs(diff).toLocaleString()} (${diff > 0 ? "+" : ""}${pctDiff}%)`
      };
    } else if (metric === "revenue") {
      const valA = parseFloat(sA.revenue.replace(/[₹Cr]/g, ""));
      const valB = parseFloat(sB.revenue.replace(/[₹Cr]/g, ""));
      const diff = valB - valA;
      const pctDiff = ((diff / valA) * 100).toFixed(1);
      return {
        labelA: sA.revenue,
        labelB: sB.revenue,
        leader: diff > 0 ? compareSegmentB : compareSegmentA,
        diffText: `₹${Math.abs(diff).toFixed(1)}Cr (${diff > 0 ? "+" : ""}${pctDiff}%)`
      };
    } else {
      const valA = sA.name.includes("iOS") ? 34.8 : 28.6;
      const valB = sB.name.includes("iOS") ? 34.8 : 28.6;
      const diff = valB - valA;
      const pctDiff = ((diff / valA) * 100).toFixed(1);
      return {
        labelA: `${valA}%`,
        labelB: `${valB}%`,
        leader: diff > 0 ? compareSegmentB : compareSegmentA,
        diffText: `${Math.abs(diff).toFixed(1)}% (${diff > 0 ? "+" : ""}${pctDiff}%)`
      };
    }
  };

  return (
    <div className="space-y-6 relative pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-slide-in font-medium text-xs">
          <Check className="w-4 h-4 text-emerald-500" />
          {toastMessage}
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-bright">Segmentation Explorer</h1>
          <p className="text-sm text-text-muted mt-1">
            Compare user behavior across different dimensions, identify growth opportunities, and analyze segment performance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="h-[36px] bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold px-4 rounded-lg flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/10"
          >
            <Plus className="w-4 h-4" />
            Create Segment
          </button>
          <button 
            onClick={() => triggerToast("Current Segment parameters saved successfully as 'Custom User Group'")}
            className="h-[36px] bg-transparent hover:bg-slate-800 text-text-bright border border-slate-800 text-xs font-semibold px-4 rounded-lg transition-colors"
          >
            Save Segment
          </button>
          <button 
            onClick={() => triggerToast("Sharing dashboard link generated and copied to clipboard")}
            className="h-[36px] bg-transparent hover:bg-slate-800 text-text-bright border border-slate-800 text-xs font-semibold px-3 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => triggerToast("Export queue started. File download will begin in background")}
            className="h-[36px] bg-transparent hover:bg-slate-800 text-text-bright border border-slate-800 text-xs font-semibold px-3 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <div className="relative group">
            <button className="h-[36px] bg-transparent hover:bg-slate-800 text-text-bright border border-slate-800 text-xs font-semibold px-3 rounded-lg transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Query Configuration Builder Bar */}
      <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl flex flex-wrap items-end gap-4 justify-between backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-4">
          {/* Analyze Event dropdown */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Inspect Event</span>
            <div className="relative">
              <select
                value={selectedEvent}
                onChange={(e) => {
                  setSelectedEvent(e.target.value);
                  triggerToast(`Query updated: Inspecting event '${e.target.value}'`);
                }}
                className="pl-3 pr-8 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:outline-none text-text-bright cursor-pointer appearance-none min-w-[140px]"
              >
                <option value="all">All Events</option>
                <option value="page_view">page_view</option>
                <option value="search_started">search_started</option>
                <option value="search_completed">search_completed</option>
                <option value="product_viewed">product_viewed</option>
                <option value="add_to_cart">add_to_cart</option>
                <option value="wishlist_added">wishlist_added</option>
                <option value="checkout_started">checkout_started</option>
                <option value="payment_completed">payment_completed</option>
                <option value="order_completed">order_completed</option>
                <option value="refund_created">refund_created</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Segment By dropdown */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Segment By</span>
            <div className="relative">
              <select
                value={segmentProperty}
                onChange={(e) => {
                  setSegmentProperty(e.target.value);
                  setBreakdownProperty(e.target.value === "Device Type" ? "Device Type" : e.target.value === "Operating System" ? "Operating System" : "Country");
                  triggerToast(`Group-by field changed to ${e.target.value}`);
                }}
                className="pl-3 pr-8 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:outline-none text-text-bright cursor-pointer appearance-none min-w-[140px]"
              >
                <option value="Device Type">Device Type</option>
                <option value="Operating System">Operating System</option>
                <option value="Country">Country</option>
                <option value="City">City</option>
                <option value="Age Group">Age Group</option>
                <option value="Acquisition Channel">Acquisition Channel</option>
                <option value="Marketing Campaign">Marketing Campaign</option>
                <option value="Category">Category</option>
                <option value="Customer Tier">Customer Tier</option>
                <option value="Payment Method">Payment Method</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Date Range</span>
            <div className="relative">
              <button
                onClick={() => triggerToast("Date range configuration clicked")}
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
          </div>

          {/* Compare with selector */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Compare With</span>
            <div className="relative">
              <select
                value={comparePeriod}
                onChange={(e) => {
                  setComparePeriod(e.target.value);
                  triggerToast(`Comparison interval updated to '${e.target.value}'`);
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

          {/* Additional Filters Builder Button */}
          <div className="space-y-1 relative">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Additional Filters</span>
            <button
              onClick={() => setShowFilterPopover(!showFilterPopover)}
              className={`flex items-center gap-2 px-3 py-2 text-xs border rounded-lg cursor-pointer transition-colors ${
                filters.length > 0 
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                  : "bg-slate-900 border-slate-800 text-text-bright hover:bg-slate-800"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{filters.length > 0 ? `${filters[0].field} = ${filters[0].value}` : "Add Filters"}</span>
              {filters.length > 1 && (
                <span className="bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded text-[10px]">
                  +{filters.length - 1} more
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </button>

            {/* Filter builder popover overlay */}
            {showFilterPopover && (
              <div className="absolute left-0 mt-2 z-30 w-72 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-text-bright">Filter Builder</span>
                  <button onClick={() => setShowFilterPopover(false)} className="text-text-muted hover:text-text-bright">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {filters.map((filter, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-1 bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
                      <span className="text-emerald-400 font-semibold uppercase text-[9px] mr-1">{idx === 0 ? "WHERE" : "AND"}</span>
                      <span className="text-text-bright">{filter.field}</span>
                      <span className="text-text-muted font-mono">{filter.operator}</span>
                      <span className="text-text-bright font-bold">{filter.value}</span>
                      <button 
                        onClick={() => {
                          setFilters(filters.filter((_, i) => i !== idx));
                          triggerToast(`Removed filter: ${filter.field}`);
                        }}
                        className="text-red-400 hover:text-red-300 p-0.5 ml-auto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {filters.length === 0 && (
                    <div className="text-[10px] text-text-muted py-2 text-center">No active filter constraints.</div>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => {
                      setFilters([...filters, { field: "Revenue", operator: ">", value: "₹10,000" }]);
                      triggerToast("Added filter constraint");
                    }}
                    className="text-[10px] text-primary hover:underline flex items-center gap-1 font-semibold"
                  >
                    + Add Rule
                  </button>
                  <button 
                    onClick={() => {
                      setShowFilterPopover(false);
                      triggerToast("Successfully applied 3 analytical filters to segmentation query");
                    }}
                    className="ml-auto bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-md"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Breakdown Select */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Breakdown</span>
            <div className="relative">
              <select
                value={breakdownBy}
                onChange={(e) => {
                  setBreakdownBy(e.target.value);
                  if (e.target.value !== "Select Property") {
                    setBreakdownProperty(e.target.value);
                  }
                  triggerToast(`Query breakdown structured by ${e.target.value}`);
                }}
                className="pl-3 pr-8 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:outline-none text-text-bright cursor-pointer appearance-none min-w-[130px]"
              >
                <option value="Select Property">Select Property</option>
                <option value="Brand">Brand</option>
                <option value="Category">Category</option>
                <option value="Price Range">Price Range</option>
                <option value="Device">Device</option>
                <option value="OS">OS</option>
                <option value="Region">Region</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* View Mode Chart controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 w-full sm:w-auto justify-end sm:justify-start">
          <button 
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded transition-all text-xs font-semibold flex items-center gap-1 ${
              viewMode === "table" 
                ? "bg-primary text-white" 
                : "text-text-muted hover:text-text-bright hover:bg-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Table</span>
          </button>
          <button 
            onClick={() => setViewMode("chart")}
            className={`p-1.5 rounded transition-all text-xs font-semibold flex items-center gap-1 ${
              viewMode === "chart" 
                ? "bg-primary text-white" 
                : "text-text-muted hover:text-text-bright hover:bg-slate-900"
            }`}
          >
            <BarChart className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Visual Chart</span>
          </button>
        </div>
      </div>

      {/* KPI Command Center Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Total Events */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-muted">Total Events</span>
            <Activity className="w-4.5 h-4.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-text-bright">148.7M</div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <span className="text-emerald-400 font-semibold flex items-center">↑ 18.6%</span>
              <span className="text-text-muted">vs previous 30d</span>
            </div>
          </div>
        </div>

        {/* Card 2: Unique Users */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-primary/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-muted">Unique Users</span>
            <Users className="w-4.5 h-4.5 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-text-bright">24.8M</div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <span className="text-emerald-400 font-semibold">↑ 12.4%</span>
              <span className="text-text-muted">vs previous 30d</span>
            </div>
          </div>
        </div>

        {/* Card 3: Avg Events/User */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-purple-500/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-muted">Avg. Events / User</span>
            <TrendingUp className="w-4.5 h-4.5 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-text-bright">6.0</div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <span className="text-emerald-400 font-semibold">↑ 5.3%</span>
              <span className="text-text-muted">vs previous 30d</span>
            </div>
          </div>
        </div>

        {/* Card 4: Users In Segment */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-pink-500/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-muted">Users In Segment</span>
            <Layers className="w-4.5 h-4.5 text-pink-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-text-bright">24.6M</div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <span className="text-pink-400 font-semibold">98.5%</span>
              <span className="text-text-muted">of total users</span>
            </div>
          </div>
        </div>

        {/* Card 5: Top Segment */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-blue-500/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-muted">Top Segment</span>
            <Smartphone className="w-4.5 h-4.5 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-text-bright">Mobile</div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <span className="text-blue-400 font-semibold">72.3%</span>
              <span className="text-text-muted">of total events</span>
            </div>
          </div>
        </div>

        {/* Card 6: Most Active Segment */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-yellow-500/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-muted">Most Active Segment</span>
            <Zap className="w-4.5 h-4.5 text-yellow-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-text-bright">Android</div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <span className="text-yellow-400 font-semibold">38.6%</span>
              <span className="text-text-muted">events contribution</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytics Segment Comparison Mode Panel */}
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
                Segment Comparison Mode
              </h3>
              <p className="text-[11px] text-text-muted">Comparing behavioral conversions, retention index and revenue streams side-by-side.</p>
            </div>
            <div className="flex items-center gap-2.5">
              <select 
                value={compareSegmentA}
                onChange={(e) => {
                  setCompareSegmentA(e.target.value);
                  triggerToast(`Comparison updated: Segment A set to ${e.target.value}`);
                }}
                className="px-2.5 py-1.5 text-[11px] bg-slate-950 border border-slate-800 rounded-lg text-text-bright cursor-pointer"
              >
                {segmentDataset.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
              <span className="text-[10px] text-text-muted uppercase font-bold font-mono">VS</span>
              <select 
                value={compareSegmentB}
                onChange={(e) => {
                  setCompareSegmentB(e.target.value);
                  triggerToast(`Comparison updated: Segment B set to ${e.target.value}`);
                }}
                className="px-2.5 py-1.5 text-[11px] bg-slate-950 border border-slate-800 rounded-lg text-text-bright cursor-pointer"
              >
                {segmentDataset.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Conversion diff card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-[10px] text-text-muted uppercase font-bold">Conversion Rate</span>
              <div className="flex justify-between items-baseline pt-1">
                <div className="text-xs text-text-muted">{compareSegmentA}: <span className="font-semibold text-text-bright">{getCompareMetric("conversion").labelA}</span></div>
                <div className="text-xs text-text-muted">{compareSegmentB}: <span className="font-semibold text-text-bright">{getCompareMetric("conversion").labelB}</span></div>
              </div>
              <div className="pt-2 border-t border-slate-900/50 flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-semibold">Diff: {getCompareMetric("conversion").diffText}</span>
                <span className="text-[9px] text-text-muted font-semibold">Leader: {getCompareMetric("conversion").leader}</span>
              </div>
            </div>

            {/* Average LTV card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-[10px] text-text-muted uppercase font-bold">Average LTV</span>
              <div className="flex justify-between items-baseline pt-1">
                <div className="text-xs text-text-muted">{compareSegmentA}: <span className="font-semibold text-text-bright">{getCompareMetric("ltv").labelA}</span></div>
                <div className="text-xs text-text-muted">{compareSegmentB}: <span className="font-semibold text-text-bright">{getCompareMetric("ltv").labelB}</span></div>
              </div>
              <div className="pt-2 border-t border-slate-900/50 flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-semibold">Diff: {getCompareMetric("ltv").diffText}</span>
                <span className="text-[9px] text-text-muted font-semibold">Leader: {getCompareMetric("ltv").leader}</span>
              </div>
            </div>

            {/* Total Revenue card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-[10px] text-text-muted uppercase font-bold">Total Revenue</span>
              <div className="flex justify-between items-baseline pt-1">
                <div className="text-xs text-text-muted">{compareSegmentA}: <span className="font-semibold text-text-bright">{getCompareMetric("revenue").labelA}</span></div>
                <div className="text-xs text-text-muted">{compareSegmentB}: <span className="font-semibold text-text-bright">{getCompareMetric("revenue").labelB}</span></div>
              </div>
              <div className="pt-2 border-t border-slate-900/50 flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-semibold">Diff: {getCompareMetric("revenue").diffText}</span>
                <span className="text-[9px] text-text-muted font-semibold">Leader: {getCompareMetric("revenue").leader}</span>
              </div>
            </div>

            {/* Retention W4 card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-[10px] text-text-muted uppercase font-bold">Retention (Week 4)</span>
              <div className="flex justify-between items-baseline pt-1">
                <div className="text-xs text-text-muted">{compareSegmentA}: <span className="font-semibold text-text-bright">{getCompareMetric("retention").labelA}</span></div>
                <div className="text-xs text-text-muted">{compareSegmentB}: <span className="font-semibold text-text-bright">{getCompareMetric("retention").labelB}</span></div>
              </div>
              <div className="pt-2 border-t border-slate-900/50 flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-semibold">Diff: {getCompareMetric("retention").diffText}</span>
                <span className="text-[9px] text-text-muted font-semibold">Leader: {getCompareMetric("retention").leader}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Segment Comparison Table & Segment Distribution Donut & Insights Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Card - Segment Comparison (70%) */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-text-bright">Segment Comparison</h2>
                <p className="text-xs text-text-muted">Compare key metrics across segments.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowCompareMode(true);
                    triggerToast("Segment Comparison Mode enabled! Select A vs B at the top card");
                  }}
                  className="bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Compare Segments
                </button>
              </div>
            </div>

            {viewMode === "table" ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-text-muted text-[10px] uppercase font-bold tracking-wider">
                      <th className="py-2.5 pr-4">Segment</th>
                      <th className="py-2.5 px-3 text-right">Events</th>
                      <th className="py-2.5 px-3 text-right">Users</th>
                      <th className="py-2.5 px-3 text-right">Events/User</th>
                      <th className="py-2.5 px-3 text-right">% Events</th>
                      <th className="py-2.5 px-3 text-center">Trend</th>
                      <th className="py-2.5 pl-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {segmentDataset.map((row) => {
                      const Icon = row.icon;
                      return (
                        <tr 
                          key={row.name}
                          onClick={() => setSelectedSegment(row)}
                          className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                        >
                          <td className="py-3 pr-4 font-semibold text-text-bright flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-800">
                              <Icon className="w-3.5 h-3.5 text-text-muted group-hover:text-primary transition-colors" />
                            </div>
                            <span>{row.name}</span>
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-medium text-text-bright">{row.events}</td>
                          <td className="py-3 px-3 text-right font-mono text-text-muted">{row.users}</td>
                          <td className="py-3 px-3 text-right font-mono text-text-muted">{row.eventsPerUser.toFixed(1)}</td>
                          <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-400">{row.pctEvents}%</td>
                          <td className="py-3 px-3 text-center">
                            <div className="inline-block">
                              <Sparkline data={row.trend} color={row.color} />
                            </div>
                          </td>
                          <td className="py-3 pl-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => triggerToast(`Actions context menu for segment '${row.name}' triggered.`)}
                              className="p-1 hover:bg-slate-800 rounded text-text-muted hover:text-text-bright transition-colors"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Visual chart view fallback for Segment Comparison */
              <div className="h-80 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendChartData} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0b0f19", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                      labelStyle={{ color: "#f3f4f6", fontWeight: "bold", fontSize: "11px" }}
                      itemStyle={{ fontSize: "11px" }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                    <Line type="monotone" dataKey="Mobile" stroke="#10B981" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="Desktop" stroke="#3B82F6" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="Tablet" stroke="#8B5CF6" strokeWidth={2} />
                    <Line type="monotone" dataKey="Others" stroke="#F59E0B" strokeWidth={1.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <div className="mt-4 border-t border-slate-800 pt-3 text-[10px] text-text-muted flex justify-between items-center">
            <span>Flipkart Growth Explorer Synthetic Feed</span>
            <span className="font-semibold text-emerald-400">● Live Synchronization</span>
          </div>
        </div>

        {/* Middle Card - Segment Distribution Donut (30%) */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4">
              <h2 className="text-base font-bold text-text-bright">Segment Distribution</h2>
              <p className="text-xs text-text-muted">Percentage distribution of events across segments.</p>
            </div>
            
            {/* Donut chart container with absolute text overlay */}
            <div className="relative flex items-center justify-center h-48 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {distributionDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0b0f19", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    itemStyle={{ fontSize: "11px", color: "#f3f4f6" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-text-bright font-mono leading-none">148.7M</span>
                <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider mt-1">Total Events</span>
              </div>
            </div>

            {/* Customized donut legend splits */}
            <div className="mt-5 space-y-2.5">
              {distributionDonutData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-text-bright font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="text-text-bright font-semibold">{item.value}%</span>
                    <span className="text-text-muted">({item.count})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 border-t border-slate-800 pt-3 text-[10px] text-text-muted">
            Values are updated every 2 hours
          </div>
        </div>

        {/* Right Card Stack - Segment Insights & Properties Breakdown (30%) */}
        <div className="space-y-6 lg:col-span-1">
          {/* Top Segment Insights Card */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between min-h-[260px]">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h2 className="text-sm font-bold text-text-bright">Top Segment Insights</h2>
                <select
                  value={insightsSegment}
                  onChange={(e) => setInsightsSegment(e.target.value)}
                  className="px-2 py-1 text-[10px] bg-slate-950 border border-slate-800 rounded text-text-bright cursor-pointer"
                >
                  <option value="Mobile">Mobile</option>
                  <option value="Desktop">Desktop</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="space-y-3">
                {/* Events metric */}
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/50">
                  <span className="text-text-muted text-[10px] font-medium">Events</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-text-bright">{insightsData.events}</span>
                    <span className="text-emerald-400 text-[10px] font-bold">▲ 18%</span>
                  </div>
                </div>

                {/* Users metric */}
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/50">
                  <span className="text-text-muted text-[10px] font-medium">Users</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-text-bright">{insightsData.users}</span>
                    <span className="text-emerald-400 text-[10px] font-bold">▲ 12%</span>
                  </div>
                </div>

                {/* Conversion metric */}
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/50">
                  <span className="text-text-muted text-[10px] font-medium">Conversion</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-emerald-400">{insightsData.conversion}</span>
                    <span className="text-emerald-400 text-[10px] font-bold">▲ 13.2%</span>
                  </div>
                </div>

                {/* Events per user metric */}
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/50">
                  <span className="text-text-muted text-[10px] font-medium">Events/User</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-text-bright">{insightsData.eventsPerUser}</span>
                    <span className="text-emerald-400 text-[10px] font-bold">▲ 4.8%</span>
                  </div>
                </div>

                {/* Percentage total events */}
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/50">
                  <span className="text-text-muted text-[10px] font-medium">% Total Events</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-text-bright">{insightsData.pctTotal}</span>
                    <span className="text-emerald-400 text-[10px] font-bold">▲ 2.1%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Breakdown Card */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h2 className="text-sm font-bold text-text-bright">Properties Breakdown</h2>
              <select
                value={breakdownProperty}
                onChange={(e) => setBreakdownProperty(e.target.value)}
                className="px-2 py-1 text-[10px] bg-slate-950 border border-slate-800 rounded text-text-bright cursor-pointer"
              >
                <option value="Operating System">Operating System</option>
                <option value="Device Type">Device Type</option>
                <option value="Country">Country</option>
              </select>
            </div>

            <div className="space-y-4">
              {(propertyBreakdownMock[breakdownProperty] || propertyBreakdownMock["Operating System"]).map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-text-bright font-medium">{item.label}</span>
                    <span className="text-text-muted text-[11px] font-mono">{item.pct}% ({item.count})</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-900">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Bottom row analytics grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* User Overlap Card (Venn Diagram) */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4">
              <h2 className="text-sm font-bold text-text-bright">User Overlap</h2>
              <p className="text-[10px] text-text-muted">Users present in multiple segments</p>
            </div>
            
            {/* Interactive SVG Venn Diagram */}
            <div className="flex items-center justify-center h-36 relative mt-1">
              <svg width="180" height="130" viewBox="0 0 180 130" className="overflow-visible">
                <defs>
                  <linearGradient id="gradMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.15" />
                  </linearGradient>
                  <linearGradient id="gradDesktop" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.15" />
                  </linearGradient>
                </defs>

                {/* Mobile Segment Circle */}
                <circle 
                  cx="70" 
                  cy="65" 
                  r="48" 
                  fill="url(#gradMobile)" 
                  stroke="#10B981" 
                  strokeWidth="1.5" 
                  className="hover:stroke-emerald-400 hover:fill-opacity-50 transition-all cursor-pointer"
                  onClick={() => triggerToast("Mobile segment selected: 17.9M users")}
                />
                
                {/* Desktop Segment Circle */}
                <circle 
                  cx="115" 
                  cy="65" 
                  r="45" 
                  fill="url(#gradDesktop)" 
                  stroke="#3B82F6" 
                  strokeWidth="1.5" 
                  className="hover:stroke-blue-400 hover:fill-opacity-50 transition-all cursor-pointer"
                  onClick={() => triggerToast("Desktop segment selected: 4.7M users")}
                />

                {/* Circle labels inside circles */}
                <text x="50" y="55" fill="#10B981" fontSize="10" fontWeight="bold" textAnchor="middle">Mobile</text>
                <text x="50" y="70" fill="#f3f4f6" fontSize="9" fontWeight="bold" textAnchor="middle">17.9M</text>

                <text x="132" y="55" fill="#3B82F6" fontSize="10" fontWeight="bold" textAnchor="middle">Desktop</text>
                <text x="132" y="70" fill="#f3f4f6" fontSize="9" fontWeight="bold" textAnchor="middle">4.7M</text>

                {/* Overlap center indicator */}
                <rect x="78" y="52" width="28" height="24" rx="4" fill="#090d16" stroke="#475569" strokeWidth="1" />
                <text x="92" y="62" fill="#e2e8f0" fontSize="8" fontWeight="bold" textAnchor="middle">2.1M</text>
                <text x="92" y="71" fill="#94a3b8" fontSize="6" fontWeight="semibold" textAnchor="middle">Overlap</text>
              </svg>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-2.5 flex items-center justify-between text-[10px] text-text-muted">
            <span>Total Unique Users</span>
            <span className="font-mono font-bold text-text-bright">24.8M</span>
          </div>
        </div>

        {/* Trends Over Time Card (Line Chart) */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px] lg:col-span-1">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-text-bright">Trends Over Time</h2>
                <p className="text-[10px] text-text-muted">Event volume trend across top segments.</p>
              </div>
              <span className="text-[8px] bg-slate-950 border border-slate-850 px-1.5 py-0.5 rounded text-text-muted uppercase font-bold">Daily</span>
            </div>

            <div className="h-40 w-full mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendChartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0b0f19", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    itemStyle={{ fontSize: "10px" }}
                  />
                  <Line type="monotone" dataKey="Mobile" stroke="#10B981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Desktop" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Tablet" stroke="#8B5CF6" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="Others" stroke="#F59E0B" strokeWidth={1} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-[8px] text-text-muted pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Mobile</span>
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" /> Desktop</span>
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" /> Tablet</span>
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" /> Others</span>
          </div>
        </div>

        {/* Geography Split Card */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4">
              <h2 className="text-sm font-bold text-text-bright">Geography Split</h2>
              <p className="text-[10px] text-text-muted">Event distribution by top countries</p>
            </div>

            <div className="space-y-2 mt-1">
              <div className="flex justify-between border-b border-slate-800/40 pb-1.5 text-[9px] uppercase font-bold text-text-muted tracking-wider">
                <span>Country</span>
                <span className="text-right">Events</span>
                <span className="text-right">% Events</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {geographySplit.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs py-0.5 border-b border-slate-900/50">
                    <span className="text-text-bright font-medium flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-text-muted" />
                      {item.country}
                    </span>
                    <span className="font-mono text-text-bright text-right font-medium">{item.events}</span>
                    <span className="font-mono text-emerald-400 text-right font-semibold">{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => triggerToast("Loading detailed geographics matrix dashboard...")}
            className="text-[10px] text-primary hover:underline text-left font-semibold flex items-center gap-1 mt-2.5"
          >
            View all countries →
          </button>
        </div>

        {/* Device Category Performance Card */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4">
              <h2 className="text-sm font-bold text-text-bright">Device Category Performance</h2>
              <p className="text-[10px] text-text-muted">Key engagement metrics by device categories.</p>
            </div>

            <div className="space-y-2.5 mt-1">
              <div className="flex justify-between border-b border-slate-800/40 pb-1.5 text-[9px] uppercase font-bold text-text-muted tracking-wider">
                <span>Device</span>
                <span className="text-right">Bounce</span>
                <span className="text-right">Session</span>
                <span className="text-right">Conv.</span>
                <span className="text-right">Revenue</span>
              </div>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {deviceCategoryPerformance.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] py-1 border-b border-slate-900/50">
                    <span className="text-text-bright font-semibold">{item.category}</span>
                    <span className="font-mono text-text-muted text-right">{item.bounceRate}</span>
                    <span className="font-mono text-text-muted text-right">{item.avgDuration}</span>
                    <span className="font-mono text-emerald-400 text-right font-semibold">{item.conversion}</span>
                    <span className="font-mono text-text-bright text-right font-medium">{item.revenue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={() => triggerToast("Routing to Device Category Command Center analytics...")}
            className="text-[10px] text-primary hover:underline text-left font-semibold flex items-center gap-1 mt-2.5"
          >
            View detailed performance →
          </button>
        </div>
      </div>

      {/* Info Panel Footer */}
      <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-950 border border-slate-850 rounded-lg text-primary">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-bright">About Segmentation</h4>
            <p className="text-[10px] text-text-muted mt-0.5">
              Use segmentation to group users by shared characteristics and analyze their behavior. Create custom segments using events and user properties.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-semibold">
          <button 
            onClick={() => triggerToast("Launching walkthrough guide: Segmentation Explorer 101...")}
            className="text-text-muted hover:text-text-bright flex items-center gap-1"
          >
            <Play className="w-3.5 h-3.5" />
            Learn segmentation
          </button>
          <button 
            onClick={() => triggerToast("Opening Best Practices index...")}
            className="text-text-muted hover:text-text-bright flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            View guide
          </button>
        </div>
      </div>

      {/* Segment Details Drawer (Slide-out right drawer) */}
      {selectedSegment && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setSelectedSegment(null)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer content panel */}
          <div className="relative w-full max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl h-full flex flex-col justify-between z-10 animate-slide-left p-6">
            <div className="space-y-6 overflow-y-auto max-h-[85vh] pr-1">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-850">
                    <Layers className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-bright">{selectedSegment.name} Details</h3>
                    <span className="text-[9px] bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-text-muted font-bold uppercase">Segment View</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSegment(null)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-text-muted hover:text-text-bright transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Segment statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/60 border border-slate-850 p-3 rounded-lg text-left">
                  <span className="text-[10px] text-text-muted uppercase font-bold">Total Events</span>
                  <div className="text-base font-bold text-text-bright mt-0.5">{selectedSegment.events}</div>
                </div>
                <div className="bg-slate-950/60 border border-slate-850 p-3 rounded-lg text-left">
                  <span className="text-[10px] text-text-muted uppercase font-bold">Matching Users</span>
                  <div className="text-base font-bold text-text-bright mt-0.5">{selectedSegment.users}</div>
                </div>
                <div className="bg-slate-950/60 border border-slate-850 p-3 rounded-lg text-left">
                  <span className="text-[10px] text-text-muted uppercase font-bold">Conversion Rate</span>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">{selectedSegment.conversion}</div>
                </div>
                <div className="bg-slate-950/60 border border-slate-850 p-3 rounded-lg text-left">
                  <span className="text-[10px] text-text-muted uppercase font-bold">LTV Contribution</span>
                  <div className="text-base font-bold text-text-bright mt-0.5">{selectedSegment.revenue}</div>
                </div>
              </div>

              {/* Segment Characteristics breakdowns */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-text-bright border-b border-slate-800 pb-2">Category Demographics & Platform</h4>
                
                <div className="space-y-3">
                  {/* Top Cities */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-text-muted font-bold uppercase">Top Cities</span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-1 rounded text-text-bright">Bangalore (45.3%)</span>
                      <span className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-1 rounded text-text-bright">Delhi (28.1%)</span>
                      <span className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-1 rounded text-text-bright">Mumbai (26.6%)</span>
                    </div>
                  </div>

                  {/* Device properties */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-text-muted font-bold uppercase">Device Details</span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-1 rounded text-text-bright">Android (68.4%)</span>
                      <span className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-1 rounded text-text-bright">iOS (27.1%)</span>
                      <span className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-1 rounded text-text-bright">Web Browser (4.5%)</span>
                    </div>
                  </div>

                  {/* Retention curve summary */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-text-muted font-bold uppercase">Cohort Retention Index</span>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                      <div className="bg-slate-950 p-2 rounded border border-slate-850">
                        <div className="text-[9px] text-text-muted font-semibold">Week 1</div>
                        <div className="font-bold text-text-bright mt-0.5">42.0%</div>
                      </div>
                      <div className="bg-slate-950 p-2 rounded border border-slate-850">
                        <div className="text-[9px] text-text-muted font-semibold">Week 4</div>
                        <div className="font-bold text-emerald-400 mt-0.5">28.0%</div>
                      </div>
                      <div className="bg-slate-950 p-2 rounded border border-slate-850">
                        <div className="text-[9px] text-text-muted font-semibold">Week 12</div>
                        <div className="font-bold text-text-bright mt-0.5">8.0%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer footer buttons */}
            <div className="border-t border-slate-800 pt-4 flex gap-3">
              <button 
                onClick={() => {
                  setSelectedSegment(null);
                  triggerToast(`Cohort successfully created from segment '${selectedSegment.name}'!`);
                }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create Cohort
              </button>
              <button 
                onClick={() => {
                  setSelectedSegment(null);
                  triggerToast(`User compilation CSV containing ${selectedSegment.users} profiles export queued.`);
                }}
                className="flex-1 bg-transparent hover:bg-slate-800 text-text-bright border border-slate-800 text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export Users
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Segment Modal Dialog */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setShowCreateModal(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 z-10 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-text-bright">Create New Segment</h3>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-text-muted hover:text-text-bright transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Selection shortcut */}
            <div className="space-y-1.5">
              <span className="block text-[10px] text-text-muted uppercase font-bold">Use Rules Template</span>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => {
                    setNewSegmentName("Premium Electronics Buyers");
                    setNewSegmentRules([
                      { field: "Category", operator: "=", value: "Electronics" },
                      { field: "Orders", operator: ">", value: "5" },
                      { field: "Revenue", operator: ">", value: "50000" }
                    ]);
                    triggerToast("Template loaded: Premium Electronics Buyers");
                  }}
                  className="bg-slate-950 border border-slate-850 hover:border-slate-700 text-text-bright text-[10px] px-2 py-1.5 rounded transition-all font-semibold"
                >
                  Premium Electronics
                </button>
                <button 
                  onClick={() => {
                    setNewSegmentName("Repeat Electronics Buyers");
                    setNewSegmentRules([
                      { field: "Category", operator: "=", value: "Electronics" },
                      { field: "PurchaseCount", operator: ">", value: "3" },
                      { field: "LastActive", operator: "<", value: "7d" }
                    ]);
                    triggerToast("Template loaded: Repeat Electronics Buyers");
                  }}
                  className="bg-slate-950 border border-slate-850 hover:border-slate-700 text-text-bright text-[10px] px-2 py-1.5 rounded transition-all font-semibold"
                >
                  Repeat Electronics
                </button>
                <button 
                  onClick={() => {
                    setNewSegmentName("Inactive Premium Customers");
                    setNewSegmentRules([
                      { field: "tier", operator: "=", value: "Premium" },
                      { field: "isActive", operator: "=", value: "false" },
                      { field: "riskStatus", operator: "=", value: "At Risk" }
                    ]);
                    triggerToast("Template loaded: Inactive Premium Customers");
                  }}
                  className="bg-slate-950 border border-slate-850 hover:border-slate-700 text-text-bright text-[10px] px-2 py-1.5 rounded transition-all font-semibold"
                >
                  Inactive Premium
                </button>
              </div>
            </div>

            {/* Segment Name Input */}
            <div className="space-y-1">
              <label className="block text-[10px] text-text-muted uppercase font-bold">Segment Name</label>
              <input
                type="text"
                value={newSegmentName}
                onChange={(e) => setNewSegmentName(e.target.value)}
                placeholder="e.g. Premium Electronics Buyers"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-text-bright focus:outline-none focus:border-primary placeholder-text-muted"
              />
            </div>

            {/* Segment Rules config list */}
            <div className="space-y-2">
              <label className="block text-[10px] text-text-muted uppercase font-bold">Segment Definition Rules</label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {newSegmentRules.map((rule, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-xs">
                    <span className="text-emerald-400 font-semibold text-[9px] uppercase">{idx === 0 ? "WHERE" : "AND"}</span>
                    <span className="text-text-bright font-semibold">{rule.field}</span>
                    <span className="text-text-muted font-mono">{rule.operator}</span>
                    <span className="text-text-bright">{rule.value}</span>
                    <button 
                      onClick={() => {
                        setNewSegmentRules(newSegmentRules.filter((_, i) => i !== idx));
                        triggerToast(`Deleted segment rule constraint: ${rule.field}`);
                      }}
                      className="text-red-400 hover:text-red-300 ml-auto p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                  setNewSegmentRules([...newSegmentRules, { field: "Location", operator: "=", value: "India" }]);
                  triggerToast("Added custom rule condition slot");
                }}
                className="text-[10px] text-primary hover:underline font-semibold flex items-center gap-1"
              >
                + Add Rule Condition
              </button>
            </div>

            {/* Modal actions */}
            <div className="border-t border-slate-800 pt-4 flex justify-end gap-3">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="bg-transparent hover:bg-slate-800 border border-slate-800 text-text-bright text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (!newSegmentName.trim()) {
                    triggerToast("Error: Segment name cannot be blank!");
                    return;
                  }
                  setShowCreateModal(false);
                  triggerToast(`Segment '${newSegmentName}' successfully saved & indexed in background database!`);
                }}
                className="bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
