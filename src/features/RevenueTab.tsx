"use client";

import React, { useState } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Award, 
  Layers,
  ChevronDown,
  Calendar,
  Filter,
  Plus,
  Share2,
  Download,
  Bell,
  MoreHorizontal,
  X,
  Sparkles,
  Info,
  Globe,
  MapPin,
  Clock,
  ArrowRight,
  TrendingUp as TrendUpIcon,
  AlertTriangle,
  Play,
  HelpCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line
} from "recharts";
import { useSimulation } from "@/context/SimulationContext";

// TypeScript interfaces
interface TopCustomerRow {
  customer: string;
  plan: string;
  mrr: string;
  arr: string;
  since: string;
  contact: string;
  status: string;
  invoices: { id: string; date: string; amount: string; status: string }[];
}

export default function RevenueTab() {
  const { isSimulating, mrrOffset } = useSimulation();
  // Global Filters states
  const [dateRange, setDateRange] = useState("Last 12 Months");
  const [comparePeriod, setComparePeriod] = useState("Previous Period");
  const [billingFreq, setBillingFreq] = useState("All");
  const [planType, setPlanType] = useState("All");
  const [customerSegment, setCustomerSegment] = useState("All Segments");
  const [geography, setGeography] = useState("All");
  const [viewBy, setViewBy] = useState("Monthly");

  // Interaction states
  const [selectedCustomer, setSelectedCustomer] = useState<TopCustomerRow | null>(null);
  const [showCreateAlertModal, setShowCreateAlertModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [compositionFilter, setCompositionFilter] = useState<string | null>(null);

  // Alert Modal configs
  const [alertName, setAlertName] = useState("");
  const [alertMetric, setAlertMetric] = useState("MRR drops >10%");
  const [alertThreshold, setAlertThreshold] = useState("10");
  const [alertTargetChannel, setAlertTargetChannel] = useState("Slack (#rev-ops-alerts)");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sparkline visual render
  const MiniSparkline = ({ data, color }: { data: number[]; color: string }) => {
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

  // Data constants matching mockup exactly
  const mrrSparklineData = [872, 910, 930, 990, 1020, 1060, 1090, 1116, 1150, 1210, 1250, 1287];
  const ltvSparklineData = [42000, 42500, 43100, 43900, 44200, 44800, 45100, 45900, 46200, 47100, 47900, 48552];

  // Donut Plan Composition
  const donutData = [
    { name: "Enterprise", value: 56.0, count: "$721K", color: "#00D084" },
    { name: "Pro SaaS", value: 29.4, count: "$379K", color: "#3B82F6" },
    { name: "Starter", value: 10.2, count: "$132K", color: "#8B5CF6" },
    { name: "Free", value: 4.4, count: "$55K", color: "#F59E0B" }
  ];

  // Geography split
  const regionData = [
    { region: "United States", mrr: "$512K", pct: "39.8%", change: "+12.8%", color: "text-emerald-400" },
    { region: "India", mrr: "$289K", pct: "22.4%", change: "+18.6%", color: "text-emerald-400" },
    { region: "United Kingdom", mrr: "$138K", pct: "10.7%", change: "+9.3%", color: "text-emerald-400" },
    { region: "Canada", mrr: "$92K", pct: "7.1%", change: "+14.1%", color: "text-emerald-400" },
    { region: "Australia", mrr: "$78K", pct: "5.9%", change: "+11.7%", color: "text-emerald-400" },
    { region: "Germany", mrr: "$54K", pct: "4.1%", change: "+10.2%", color: "text-emerald-400" }
  ];

  // Revenue Growth Trend Line & Area
  const growthTrendData = [
    { month: "Jul 25", Actual: 872, Forecast: null },
    { month: "Aug 25", Actual: 910, Forecast: null },
    { month: "Sep 25", Actual: 940, Forecast: null },
    { month: "Oct 25", Actual: 990, Forecast: null },
    { month: "Nov 25", Actual: 1020, Forecast: null },
    { month: "Dec 25", Actual: 1060, Forecast: null },
    { month: "Jan 26", Actual: 1090, Forecast: null },
    { month: "Feb 26", Actual: 1116, Forecast: null },
    { month: "Mar 26", Actual: 1150, Forecast: null },
    { month: "Apr 26", Actual: 1210, Forecast: null },
    { month: "May 26", Actual: 1250, Forecast: null },
    { month: "Jun 26", Actual: 1287, Forecast: 1287 },
    { month: "Jul 26", Actual: null, Forecast: 1330 },
    { month: "Aug 26", Actual: null, Forecast: 1380 },
    { month: "Sep 26", Actual: null, Forecast: 1420 },
    { month: "Oct 26", Actual: null, Forecast: 1470 },
    { month: "Nov 26", Actual: null, Forecast: 1510 },
    { month: "Dec 26", Actual: null, Forecast: 1540 }
  ];

  // MRR Movement waterfall data representation
  const waterfallData = [
    { name: "Starting (May)", range: [0, 1116], display: "$1.116M", color: "#3B82F6" },
    { name: "New Business", range: [1116, 1330], display: "+$214K", color: "#00D084" },
    { name: "Expansion", range: [1330, 1508], display: "+$178K", color: "#00D084" },
    { name: "Contraction", range: [1410, 1508], display: "-$98K", color: "#EC4899" },
    { name: "Churn", range: [1287, 1410], display: "-$165K", color: "#EF4444" },
    { name: "Ending (Jun)", range: [0, 1287], display: "$1.287M", color: "#3B82F6" }
  ];

  // Billing Cohort analysis matrix
  const cohortMatrix = [
    { cohort: "Jun 2025", count: "1,243", m0: "100%", m1: "96%", m2: "94%", m3: "91%", m6: "86%", m9: "82%", m12: "76%" },
    { cohort: "May 2025", count: "1,226", m0: "100%", m1: "95%", m2: "92%", m3: "89%", m6: "84%", m9: "79%", m12: "-" },
    { cohort: "Apr 2025", count: "1,287", m0: "100%", m1: "94%", m2: "91%", m3: "87%", m6: "82%", m9: "-", m12: "-" },
    { cohort: "Mar 2025", count: "1,156", m0: "100%", m1: "93%", m2: "90%", m3: "85%", m6: "-", m9: "-", m12: "-" },
    { cohort: "Feb 2025", count: "1,043", m0: "100%", m1: "92%", m2: "89%", m3: "-", m6: "-", m9: "-", m12: "-" }
  ];

  // LTV Acquisition Channels
  const channelData = [
    { channel: "Organic Search", customers: "8,126", ltv: "$62,342", revenue: "$506K", change: "↑ 16.8%", color: "text-emerald-400" },
    { channel: "Paid Search", customers: "4,325", ltv: "$48,231", revenue: "$208K", change: "↑ 12.2%", color: "text-emerald-400" },
    { channel: "Direct", customers: "3,452", ltv: "$52,814", revenue: "$182K", change: "↑ 8.6%", color: "text-emerald-400" },
    { channel: "Referral", customers: "1,982", ltv: "$68,917", revenue: "$137K", change: "↑ 20.3%", color: "text-emerald-400" },
    { channel: "Social Media", customers: "1,678", ltv: "$37,421", revenue: "$63K", change: "↑ 11.5%", color: "text-emerald-400" },
    { channel: "Affiliate", customers: "932", ltv: "$41,229", revenue: "$38K", change: "↑ 7.8%", color: "text-emerald-400" }
  ];

  // Top Customers list details drawer mappings
  const topCustomersDataset: TopCustomerRow[] = [
    { 
      customer: "TechNova Solutions", plan: "Enterprise", mrr: "$24,900", arr: "$298,800", since: "Jan 2024",
      contact: "Sarah Jenkins (CFO)", status: "Active",
      invoices: [
        { id: "INV-2026-004", date: "01 Jun 2026", amount: "$24,900", status: "Paid" },
        { id: "INV-2026-003", date: "01 May 2026", amount: "$24,900", status: "Paid" }
      ]
    },
    { 
      customer: "InnovateX Labs", plan: "Enterprise", mrr: "$19,500", arr: "$234,000", since: "Mar 2024",
      contact: "Marcus Chen (VP Eng)", status: "Active",
      invoices: [
        { id: "INV-2026-005", date: "05 Jun 2026", amount: "$19,500", status: "Paid" }
      ]
    },
    { 
      customer: "DataCore Systems", plan: "Enterprise", mrr: "$8,700", arr: "$104,400", since: "Apr 2024",
      contact: "Linda Lovelace (CPO)", status: "Active",
      invoices: [
        { id: "INV-2026-006", date: "10 Jun 2026", amount: "$8,700", status: "Paid" }
      ]
    },
    { 
      customer: "CloudScale Inc.", plan: "Pro SaaS", mrr: "$7,900", arr: "$94,800", since: "Feb 2024",
      contact: "Devon Miller (CTO)", status: "Active",
      invoices: [
        { id: "INV-2026-007", date: "12 Jun 2026", amount: "$7,900", status: "Paid" }
      ]
    },
    { 
      customer: "ByteFlow Analytics", plan: "Pro SaaS", mrr: "$6,400", arr: "$76,800", since: "May 2024",
      contact: "Priya Nair (Founder)", status: "Active",
      invoices: [
        { id: "INV-2026-008", date: "13 Jun 2026", amount: "$6,400", status: "Paid" }
      ]
    }
  ];

  // Alerts & insights diagnostics details
  const alertsData = [
    { title: "MRR growth increased by 15.4% this month.", desc: "New enterprise signups drove 62% of the growth.", type: "success", btn: "View Analysis" },
    { title: "Churn rate increased by 0.6% warning.", desc: "Mainly due to cancellations in the Starter plan.", type: "warning", btn: "View Customers" },
    { title: "Expansion revenue grew by 22.6%.", desc: "Upsells from Pro to Enterprise plans increased by 14%.", type: "info", btn: "View Details" }
  ];

  // Revenue Forecast 6 months dataset
  const forecastChartData = [
    { month: "Jul 26", Actual: 1287, Forecast: 1330 },
    { month: "Aug 26", Actual: null, Forecast: 1380 },
    { month: "Sep 26", Actual: null, Forecast: 1420 },
    { month: "Oct 26", Actual: null, Forecast: 1490 },
    { month: "Nov 26", Actual: null, Forecast: 1610 },
    { month: "Dec 26", Actual: null, Forecast: 1780 }
  ];

  return (
    <div className="space-y-6 relative pb-12">
      {/* Toast feedback widget */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-slide-in font-medium text-xs">
          <Info className="w-4 h-4 text-emerald-500" />
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-bright">Revenue Intelligence</h1>
          <p className="text-sm text-text-muted mt-1">
            Analyze revenue growth, customer value, retention, churn, and monetization performance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => triggerToast("Revenue dashboard configuration template saved successfully")}
            className="h-[36px] bg-transparent hover:bg-slate-800 text-text-bright border border-slate-800 text-xs font-semibold px-4 rounded-lg transition-colors"
          >
            Save Dashboard
          </button>
          <button 
            onClick={() => triggerToast("Sharing link generated & copied to clipboard")}
            className="h-[36px] bg-transparent hover:bg-slate-800 text-text-bright border border-slate-800 text-xs font-semibold px-4 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button 
            onClick={() => triggerToast("Monetization report PDF export started in background")}
            className="h-[36px] bg-transparent hover:bg-slate-800 text-text-bright border border-slate-800 text-xs font-semibold px-4 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => setShowCreateAlertModal(true)}
            className="h-[36px] bg-transparent hover:bg-slate-800 text-text-bright border border-slate-800 text-xs font-semibold px-4 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Bell className="w-4 h-4" />
            + Create Alert
          </button>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl flex flex-wrap items-end gap-4 justify-between backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-4">
          {/* Date Range select */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Date Range</span>
            <button
              onClick={() => triggerToast("Date window configuration clicked")}
              className="flex items-center gap-2 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-text-bright hover:bg-slate-800 transition-colors cursor-pointer min-w-[200px]"
            >
              <Calendar className="w-3.5 h-3.5 text-text-muted" />
              <div className="text-left leading-tight">
                <div className="font-semibold text-text-bright">{dateRange}</div>
                <div className="text-[9px] text-text-muted">14 Jun 2025 - 13 Jun 2026</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted ml-auto" />
            </button>
          </div>

          {/* Compare Period select */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Compare With</span>
            <div className="relative">
              <select
                value={comparePeriod}
                onChange={(e) => {
                  setComparePeriod(e.target.value);
                  triggerToast(`Comparisons metrics adjusted to: ${e.target.value}`);
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

          {/* Billing Frequency select */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Billing Frequency</span>
            <div className="relative">
              <select
                value={billingFreq}
                onChange={(e) => {
                  setBillingFreq(e.target.value);
                  triggerToast(`Billing filter adjusted: ${e.target.value}`);
                }}
                className="pl-3 pr-8 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:outline-none text-text-bright cursor-pointer appearance-none min-w-[110px]"
              >
                <option value="All">All Tiers</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Plan Type select */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Plan Type</span>
            <div className="relative">
              <select
                value={planType}
                onChange={(e) => {
                  setPlanType(e.target.value);
                  setCompositionFilter(e.target.value === "All" ? null : e.target.value);
                  triggerToast(`Plan display restricted: ${e.target.value}`);
                }}
                className="pl-3 pr-8 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:outline-none text-text-bright cursor-pointer appearance-none min-w-[120px]"
              >
                <option value="All">All Plans</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Pro SaaS">Pro SaaS</option>
                <option value="Starter">Starter</option>
                <option value="Free">Free</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Customer Segment select */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Customer Segment</span>
            <div className="relative">
              <select
                value={customerSegment}
                onChange={(e) => {
                  setCustomerSegment(e.target.value);
                  triggerToast(`Segment cohort filtered: ${e.target.value}`);
                }}
                className="pl-3 pr-8 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:outline-none text-text-bright cursor-pointer appearance-none min-w-[140px]"
              >
                <option value="All Segments">All Segments</option>
                <option value="High Value">High Value</option>
                <option value="Enterprise">Enterprise Accounts</option>
                <option value="SMB">SMB Tiers</option>
                <option value="Trial">Trial Users</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Geography select */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Country / Region</span>
            <div className="relative">
              <select
                value={geography}
                onChange={(e) => {
                  setGeography(e.target.value);
                  triggerToast(`Regional context mapped: ${e.target.value}`);
                }}
                className="pl-3 pr-8 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:outline-none text-text-bright cursor-pointer appearance-none min-w-[110px]"
              >
                <option value="All">Global</option>
                <option value="India">India</option>
                <option value="US">United States</option>
                <option value="Europe">Europe</option>
                <option value="APAC">APAC</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Add Filter tag */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Filters</span>
            <button
              onClick={() => triggerToast("Additional SQL filters dialog opened")}
              className="flex items-center gap-1.5 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-text-bright hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-text-muted" />
              <span>+ Add Filter</span>
            </button>
          </div>
        </div>

        {/* View by Monthly toggle selector */}
        <div className="flex items-center gap-1.5 text-[11px] text-text-muted w-full sm:w-auto justify-end sm:justify-start">
          <span>View By</span>
          <div className="relative">
            <select
              value={viewBy}
              onChange={(e) => {
                setViewBy(e.target.value);
                triggerToast(`Chart aggregation updated: ${e.target.value}`);
              }}
              className="pl-3 pr-8 py-1.5 text-xs bg-slate-900 border border-slate-850 rounded-lg focus:outline-none text-text-bright cursor-pointer appearance-none min-w-[95px]"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* KPI Cards Row (6 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: MRR */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-muted">Monthly Rec. Revenue</span>
            <DollarSign className="w-4.5 h-4.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2.5">
            <div className="text-xl font-bold text-text-bright font-mono">
              {isSimulating 
                ? `$${((1287142 + mrrOffset) / 1000000).toFixed(6)}M` 
                : "$1.287M"}
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px]">
              <span className="text-emerald-400 font-semibold flex items-center">↑ 15.4%</span>
              <MiniSparkline data={mrrSparklineData} color="#00D084" />
            </div>
          </div>
        </div>

        {/* Card 2: ARR */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-primary/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-muted">Annual Run Rate</span>
            <TrendingUp className="w-4.5 h-4.5 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2.5">
            <div className="text-xl font-bold text-text-bright font-mono">
              {isSimulating 
                ? `$${((15445704 + mrrOffset * 12) / 1000000).toFixed(6)}M` 
                : "$15.44M"}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <span className="text-emerald-400 font-semibold">↑ 18.2%</span>
              <span className="text-text-muted">{isSimulating ? "Ticking YoY" : "YoY baseline"}</span>
            </div>
          </div>
        </div>

        {/* Card 3: NRR */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-purple-500/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-muted">Net Revenue Retention</span>
            <Layers className="w-4.5 h-4.5 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2.5">
            <div className="text-xl font-bold text-emerald-400">118%</div>
            <div className="flex items-center gap-1 mt-1 text-[8px] text-text-muted justify-between">
              <span className="text-emerald-400">Exp: +22%</span>
              <span className="text-red-400">Churn: -4%</span>
              <span className="text-red-400">Down: -3%</span>
            </div>
          </div>
        </div>

        {/* Card 4: LTV */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-pink-500/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-muted">Customer Lifetime Value</span>
            <Award className="w-4.5 h-4.5 text-pink-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2.5">
            <div className="text-xl font-bold text-text-bright">$48,552</div>
            <div className="flex items-center justify-between mt-1 text-[10px]">
              <span className="text-text-muted">Avg customer LTV</span>
              <MiniSparkline data={ltvSparklineData} color="#ec4899" />
            </div>
          </div>
        </div>

        {/* Card 5: AOV */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-blue-500/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-muted">Avg Order Value</span>
            <CreditCard className="w-4.5 h-4.5 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2.5">
            <div className="text-xl font-bold text-text-bright">$79.5</div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <span className="text-emerald-400 font-semibold">↑ 4.3%</span>
              <span className="text-text-muted">vs previous period</span>
            </div>
          </div>
        </div>

        {/* Card 6: Revenue Churn */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-red-500/20 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-muted">Revenue Churn Rate</span>
            <TrendingDown className="w-4.5 h-4.5 text-red-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2.5">
            <div className="text-xl font-bold text-red-400">2.48%</div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <span className="text-red-400 font-semibold">↓ 0.8%</span>
              <span className="text-text-muted">cancellations drop</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 Main Chart Split (Revenue Over Time & Revenue Composition Donut & Geography Table) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Revenue Over Time Chart (50% / 2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-text-bright">Revenue Over Time</h2>
                <p className="text-xs text-text-muted">Track revenue growth and trend over time.</p>
              </div>
              <span className="text-[8px] bg-slate-950 border border-slate-850 px-1.5 py-0.5 rounded text-text-muted font-bold uppercase">Granularity: Monthly</span>
            </div>

            <div className="h-64 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthTrendData} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D084" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#00D084" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0b0f19", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    labelStyle={{ color: "#f3f4f6", fontWeight: "bold", fontSize: "11px" }}
                    itemStyle={{ fontSize: "11px" }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                  <Area type="monotone" dataKey="Actual" stroke="#00D084" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Historical MRR" />
                  <Line type="monotone" dataKey="Forecast" stroke="#3B82F6" strokeDasharray="5 5" strokeWidth={2} name="Forecast Prediction" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-3 border-t border-slate-800 text-center">
            <div>
              <span className="block text-[8px] uppercase text-text-muted font-bold">Current MRR</span>
              <span className="text-xs font-bold text-text-bright">$1.287M <span className="text-[9px] text-emerald-400 font-normal">15.4%</span></span>
            </div>
            <div>
              <span className="block text-[8px] uppercase text-text-muted font-bold">Previous MRR</span>
              <span className="text-xs font-semibold text-text-muted">$1.116M</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase text-text-muted font-bold">Highest MRR</span>
              <span className="text-xs font-semibold text-text-muted">$1.362M <span className="text-[7px] text-text-muted font-normal block font-sans">May 26</span></span>
            </div>
            <div>
              <span className="block text-[8px] uppercase text-text-muted font-bold">Lowest MRR</span>
              <span className="text-xs font-semibold text-text-muted">$872K <span className="text-[7px] text-text-muted font-normal block font-sans">Jul 25</span></span>
            </div>
            <div>
              <span className="block text-[8px] uppercase text-text-muted font-bold">Growth Rate</span>
              <span className="text-xs font-bold text-emerald-400">38.6% <span className="text-[7px] text-text-muted font-normal block font-sans">in 12 Mo</span></span>
            </div>
          </div>
        </div>

        {/* Middle: Plan Composition Donut (25% / 1 col) */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4">
              <h2 className="text-base font-bold text-text-bright">Revenue Composition</h2>
              <p className="text-xs text-text-muted">Breakdown of MRR by plan type.</p>
            </div>

            {/* Donut slice container */}
            <div className="relative flex items-center justify-center h-44 mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke={compositionFilter === entry.name ? "#fff" : "none"}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0b0f19", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    itemStyle={{ fontSize: "11px", color: "#f3f4f6" }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-extrabold text-text-bright font-mono leading-none">$1.287M</span>
                <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider mt-1">Total MRR</span>
              </div>
            </div>

            {/* Legend Plan items */}
            <div className="mt-4 space-y-2">
              {donutData.map((plan) => (
                <div 
                  key={plan.name}
                  onClick={() => {
                    setCompositionFilter(compositionFilter === plan.name ? null : plan.name);
                    triggerToast(`Filtered dashboard view to plan: ${plan.name}`);
                  }}
                  className={`flex items-center justify-between text-xs cursor-pointer hover:bg-slate-850 p-1.5 rounded transition-colors ${
                    compositionFilter === plan.name ? "bg-slate-850 ring-1 ring-slate-800" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: plan.color }} />
                    <span className="text-text-bright font-medium">{plan.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="text-text-bright font-bold">{plan.count}</span>
                    <span className="text-text-muted">({plan.value}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[8px] text-text-muted mt-2">
            Click slice row to filter workspace components
          </div>
        </div>

        {/* Right: Revenue Geography (25% / 1 col) */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-3">
              <h2 className="text-base font-bold text-text-bright">Revenue by Region</h2>
              <p className="text-xs text-text-muted">MRR distribution across top regions.</p>
            </div>

            <div className="overflow-y-auto max-h-[220px] pr-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-850 text-text-muted text-[8px] uppercase font-bold tracking-wider">
                    <th className="py-1.5 pr-2">Region</th>
                    <th className="py-1.5 px-2 text-right">MRR</th>
                    <th className="py-1.5 px-2 text-right">% Total</th>
                    <th className="py-1.5 pl-2 text-center">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {regionData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-2 pr-2 font-medium text-text-bright flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-text-muted" />
                        {row.region}
                      </td>
                      <td className="py-2 px-2 text-right font-mono text-text-bright font-medium">{row.mrr}</td>
                      <td className="py-2 px-2 text-right font-mono text-text-muted">{row.pct}</td>
                      <td className="py-2 pl-2 text-center font-mono font-semibold text-emerald-400 text-[10px]">
                        {row.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={() => triggerToast("Loading detailed geographics revenue maps...")}
            className="text-[10px] text-primary hover:underline text-left font-semibold flex items-center gap-1 mt-2.5"
          >
            View all regions →
          </button>
        </div>
      </div>

      {/* Row 3 Analytics Grid (MRR Waterfall & Cohorts Matrix & LTV Channel) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waterfall analysis chart */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[340px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-3">
              <h2 className="text-base font-bold text-text-bright">MRR Movement</h2>
              <p className="text-xs text-text-muted">Understand how MRR has changed.</p>
            </div>

            <div className="h-44 w-full mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfallData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={8} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={8} tickLine={false} domain={[0, 1600]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="range" radius={[4, 4, 0, 0]}>
                    {waterfallData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-1.5 text-center border-t border-slate-800 pt-2.5 text-[9px]">
            <div>
              <span className="block text-text-muted font-semibold">New Biz</span>
              <span className="font-bold text-emerald-400">+$214K</span>
            </div>
            <div>
              <span className="block text-text-muted font-semibold">Expansion</span>
              <span className="font-bold text-emerald-400">+$178K</span>
            </div>
            <div>
              <span className="block text-text-muted font-semibold">Contraction</span>
              <span className="font-bold text-red-400">-$98K</span>
            </div>
            <div>
              <span className="block text-text-muted font-semibold">Churn</span>
              <span className="font-bold text-red-400">-$165K</span>
            </div>
            <div>
              <span className="block text-text-muted font-semibold">Net Change</span>
              <span className="font-bold text-emerald-400">+$171K</span>
            </div>
          </div>
        </div>

        {/* Billing Cohort Analysis Matrix Heatmap */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[340px]">
          <div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-3">
              <div>
                <h2 className="text-base font-bold text-text-bright">Billing Cohort Analysis</h2>
                <p className="text-xs text-text-muted">Analyze MRR retention by customer cohort.</p>
              </div>
              <select className="px-2 py-0.5 text-[9px] bg-slate-950 border border-slate-800 text-text-muted rounded">
                <option>MRR Retention %</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px]">
                <thead>
                  <tr className="border-b border-slate-850 text-text-muted text-[8px] uppercase font-bold tracking-wider">
                    <th className="py-1">Cohort</th>
                    <th className="py-1 text-right">Cust</th>
                    <th className="py-1 text-center">M0</th>
                    <th className="py-1 text-center">M1</th>
                    <th className="py-1 text-center">M2</th>
                    <th className="py-1 text-center">M3</th>
                    <th className="py-1 text-center">M6</th>
                    <th className="py-1 text-center">M9</th>
                    <th className="py-1 text-center">M12</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/50">
                  {cohortMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/30 transition-colors">
                      <td className="py-2.5 font-semibold text-text-bright">{row.cohort}</td>
                      <td className="py-2.5 text-right font-mono text-text-muted">{row.count}</td>
                      {/* Color code heatmap based on rates */}
                      {[row.m0, row.m1, row.m2, row.m3, row.m6, row.m9, row.m12].map((cell, cIdx) => {
                        const val = parseInt(cell.replace("%", ""));
                        let bgStyle = "bg-transparent";
                        if (!isNaN(val)) {
                          const opacity = val / 100;
                          bgStyle = `bg-emerald-500/[${(opacity * 0.4).toFixed(2)}] text-emerald-400 font-bold border border-emerald-500/10`;
                        }
                        return (
                          <td 
                            key={cIdx} 
                            className={`py-2.5 text-center font-mono text-[9px] ${bgStyle}`}
                            style={{ 
                              backgroundColor: !isNaN(val) ? `rgba(16, 185, 129, ${val / 300})` : "transparent",
                              color: !isNaN(val) ? `rgba(255, 255, 255, ${0.4 + val/200})` : "#64748b"
                            }}
                          >
                            {cell}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={() => triggerToast("Launching cohort retention details analytics panel...")}
            className="text-[10px] text-primary hover:underline text-left font-semibold flex items-center gap-1 mt-2.5"
          >
            View full cohort analysis →
          </button>
        </div>

        {/* LTV by acquisition Channel table */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[340px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-3">
              <h2 className="text-base font-bold text-text-bright">LTV by Acquisition Channel</h2>
              <p className="text-xs text-text-muted">Average LTV of customers by acquisition channel.</p>
            </div>

            <div className="overflow-y-auto max-h-[220px] pr-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-850 text-text-muted text-[8px] uppercase font-bold tracking-wider">
                    <th className="py-1.5 pr-2">Channel</th>
                    <th className="py-1.5 px-2 text-right">Customers</th>
                    <th className="py-1.5 px-2 text-right">Avg LTV</th>
                    <th className="py-1.5 px-2 text-right">Revenue</th>
                    <th className="py-1.5 pl-2 text-center">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {channelData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-2.5 pr-2 font-medium text-text-bright truncate max-w-[85px]">{row.channel}</td>
                      <td className="py-2.5 px-2 text-right font-mono text-text-muted">{row.customers}</td>
                      <td className="py-2.5 px-2 text-right font-mono text-text-bright font-medium">{row.ltv}</td>
                      <td className="py-2.5 px-2 text-right font-mono text-text-bright font-bold">{row.revenue}</td>
                      <td className="py-2.5 pl-2 text-center font-mono font-bold text-emerald-400 text-[10px]">
                        {row.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={() => triggerToast("Loading detailed acquisition channel LTV report...")}
            className="text-[10px] text-primary hover:underline text-left font-semibold flex items-center gap-1 mt-2.5"
          >
            View all channels →
          </button>
        </div>
      </div>

      {/* Row 4 Bottom analytics grids (Top customers & alerts & forecast) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top customers table */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-3">
              <h2 className="text-sm font-bold text-text-bright">Top Revenue Generating Customers</h2>
              <p className="text-[10px] text-text-muted">Customers contributing the highest revenue.</p>
            </div>

            <div className="overflow-y-auto max-h-[175px] pr-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-850 text-text-muted text-[8px] uppercase font-bold tracking-wider">
                    <th className="py-1">Customer</th>
                    <th className="py-1">Plan</th>
                    <th className="py-1 text-right">MRR</th>
                    <th className="py-1 text-right">ARR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {topCustomersDataset.map((row, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => setSelectedCustomer(row)}
                      className="hover:bg-slate-850/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-2.5 font-bold text-text-bright truncate max-w-[105px] group-hover:text-primary transition-colors">
                        {row.customer}
                      </td>
                      <td className="py-2.5 text-text-muted">{row.plan}</td>
                      <td className="py-2.5 text-right font-mono text-text-bright font-medium">{row.mrr}</td>
                      <td className="py-2.5 text-right font-mono text-text-muted">{row.arr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={() => triggerToast("Loading customers directory query builder...")}
            className="text-[10px] text-primary hover:underline text-left font-semibold flex items-center gap-1 mt-2.5"
          >
            View all customers →
          </button>
        </div>

        {/* Alerts & Insights */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-3">
              <h2 className="text-sm font-bold text-text-bright">Revenue Alerts & Insights</h2>
              <p className="text-[10px] text-text-muted">Revenue intelligence alerts and growth drivers.</p>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[175px] pr-1">
              {alertsData.map((alert, idx) => {
                const isSuccess = alert.type === "success";
                const isWarn = alert.type === "warning";
                const badgeColor = isSuccess 
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                  : isWarn 
                    ? "bg-red-500/10 border-red-500/30 text-red-400 font-bold" 
                    : "bg-blue-500/10 border-blue-500/30 text-blue-400";
                return (
                  <div key={idx} className="bg-slate-950/60 border border-slate-850 p-2.5 rounded-lg space-y-1 flex flex-col">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="font-bold text-text-bright text-[11px] leading-snug">{alert.title}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase flex-shrink-0 ${badgeColor}`}>
                        {alert.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-text-muted leading-tight">{alert.desc}</p>
                    <button 
                      onClick={() => triggerToast(`Insight active logs loaded: ${alert.title}`)}
                      className="text-[9px] text-primary font-bold hover:underline self-start mt-0.5"
                    >
                      {alert.btn}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => triggerToast("Loading billing event alerts log...")}
            className="text-[10px] text-primary hover:underline text-left font-semibold flex items-center gap-1 mt-2.5"
          >
            View all alerts →
          </button>
        </div>

        {/* Forecast Card */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-2 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-text-bright">Revenue Forecast</h2>
                <p className="text-[10px] text-text-muted">Projected MRR for the next 6 months.</p>
              </div>
              <span className="text-[7px] text-emerald-400 font-mono font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded">AI Forecast</span>
            </div>

            <div className="h-32 w-full mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastChartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={8} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={8} tickLine={false} domain={[1200, 1800]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0b0f19", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    itemStyle={{ fontSize: "10px" }}
                  />
                  <Line type="monotone" dataKey="Actual" stroke="#00D084" strokeWidth={2} name="Historical" />
                  <Line type="monotone" dataKey="Forecast" stroke="#3B82F6" strokeDasharray="4 4" strokeWidth={2} name="Forecast" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-text-muted">
            <span>Dec 2026 Forecast Target</span>
            <span className="font-mono font-extrabold text-emerald-400">$1.78M MRR</span>
          </div>
        </div>
      </div>

      {/* Info panel footer */}
      <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-950 border border-slate-850 rounded-lg text-primary">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-bright">About Revenue Intelligence</h4>
            <p className="text-[10px] text-text-muted mt-0.5">
              MRR and ARR are computed dynamically based on active billing subscriptions. NRR represents subscription retention values including plan expansions, churn, and contractions.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-semibold">
          <button 
            onClick={() => triggerToast("Launching tutorial: MRR vs ARR metrics optimization...")}
            className="text-text-muted hover:text-text-bright flex items-center gap-1"
          >
            <Play className="w-3.5 h-3.5" />
            Learn Revenue Metrics
          </button>
          <button 
            onClick={() => triggerToast("Opening Revenue Best Practices documentation...")}
            className="text-text-muted hover:text-text-bright flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            View documentation
          </button>
        </div>
      </div>

      {/* Customer details right drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setSelectedCustomer(null)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer content panel */}
          <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl h-full flex flex-col justify-between z-10 animate-slide-left p-6">
            <div className="space-y-6 overflow-y-auto max-h-[85vh] pr-1">
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-850">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-bright">{selectedCustomer.customer}</h3>
                    <span className="text-[8px] bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-emerald-400 font-bold uppercase">{selectedCustomer.plan} Plan</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-text-muted hover:text-text-bright transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer LTV/MRR values */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/60 border border-slate-850 p-3 rounded-lg">
                  <span className="text-[10px] text-text-muted uppercase font-bold">Monthly Recurring Revenue</span>
                  <div className="text-base font-bold text-text-bright mt-0.5">{selectedCustomer.mrr}</div>
                </div>
                <div className="bg-slate-950/60 border border-slate-850 p-3 rounded-lg">
                  <span className="text-[10px] text-text-muted uppercase font-bold">Annual Recurring Revenue</span>
                  <div className="text-base font-bold text-text-bright mt-0.5">{selectedCustomer.arr}</div>
                </div>
                <div className="bg-slate-950/60 border border-slate-850 p-3 rounded-lg col-span-2">
                  <span className="text-[10px] text-text-muted uppercase font-bold">Customer since</span>
                  <div className="text-sm font-semibold text-text-bright mt-0.5">{selectedCustomer.since}</div>
                </div>
              </div>

              {/* Account properties */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-text-bright border-b border-slate-800 pb-2">Account Contact & Billing Profile</h4>
                <div className="space-y-3 text-xs">
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-850">
                    <span className="text-[8px] uppercase font-bold text-text-muted">Primary Billing Contact</span>
                    <p className="text-text-bright font-semibold mt-1">{selectedCustomer.contact}</p>
                  </div>

                  <div className="p-2.5 rounded bg-slate-950 border border-slate-850">
                    <span className="text-[8px] uppercase font-bold text-text-muted">Subscription Status</span>
                    <p className="text-emerald-400 font-bold mt-1">● {selectedCustomer.status}</p>
                  </div>

                  {/* Billing history invoice list */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-text-muted font-bold uppercase">Recent Invoices</span>
                    <div className="space-y-2">
                      {selectedCustomer.invoices.map((inv, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-950 p-2.5 rounded border border-slate-850 text-xs">
                          <div>
                            <span className="font-bold text-text-bright">{inv.id}</span>
                            <span className="text-[10px] text-text-muted block">{inv.date}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-text-bright">{inv.amount}</span>
                            <span className="text-[9px] text-emerald-400 block font-semibold">{inv.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer footer actions */}
            <div className="border-t border-slate-800 pt-4 flex gap-3">
              <button 
                onClick={() => {
                  setSelectedCustomer(null);
                  triggerToast(`Transitioning to Stripe account manager for: ${selectedCustomer.customer}`);
                }}
                className="flex-1 bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Manage Stripe
              </button>
              <button 
                onClick={() => {
                  setSelectedCustomer(null);
                  triggerToast(`Contacting client liaison sarah.j@${selectedCustomer.customer.toLowerCase().replace(/\s/g, "")}.com`);
                }}
                className="flex-1 bg-transparent hover:bg-slate-800 text-text-bright border border-slate-800 text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Contact Billing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Alert Modal */}
      {showCreateAlertModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setShowCreateAlertModal(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
          />

          {/* Modal content */}
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 z-10 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-text-bright">Create Revenue Alert</h3>
              </div>
              <button 
                onClick={() => setShowCreateAlertModal(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-text-muted hover:text-text-bright transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alert builder controls */}
            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] text-text-muted uppercase font-bold">Alert Trigger Title</label>
                <input
                  type="text"
                  value={alertName}
                  onChange={(e) => setAlertName(e.target.value)}
                  placeholder="e.g. Enterprise Churn Warning Alert"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-text-bright focus:outline-none focus:border-primary placeholder-text-muted"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-text-muted uppercase font-bold">Trigger Rule Metric</label>
                <select
                  value={alertMetric}
                  onChange={(e) => setAlertMetric(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-text-bright focus:outline-none"
                >
                  <option value="MRR drops >10%">MRR drops &gt; 10%</option>
                  <option value="Churn increases">Churn increases &gt; 3%</option>
                  <option value="Enterprise revenue decreases">Enterprise contract drop</option>
                  <option value="Starter cancels exceed budget">Starter cancellations exceeds baseline</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-text-muted uppercase font-bold">Threshold limit (%)</label>
                <input
                  type="number"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-text-bright focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-text-muted uppercase font-bold">Dispatch channel destination</label>
                <select
                  value={alertTargetChannel}
                  onChange={(e) => setAlertTargetChannel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-text-bright focus:outline-none"
                >
                  <option value="Slack (#rev-ops-alerts)">Slack (#rev-ops-alerts)</option>
                  <option value="Slack (#general-growth)">Slack (#general-growth)</option>
                  <option value="PagerDuty (Sales tier-1)">PagerDuty (Sales tier-1)</option>
                  <option value="Email (CFO team)">Email (CFO team)</option>
                </select>
              </div>
            </div>

            {/* Modal actions */}
            <div className="border-t border-slate-800 pt-4 flex justify-end gap-3">
              <button 
                onClick={() => setShowCreateAlertModal(false)}
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
                  setShowCreateAlertModal(false);
                  triggerToast(`Revenue alert '${alertName}' successfully activated!`);
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

// Waterfall custom tooltip helper
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs space-y-1 z-50">
        <div className="font-bold text-text-bright">{data.name}</div>
        <div className="text-text-muted">Change: <span className="font-semibold text-text-bright">{data.display}</span></div>
        <div className="text-[10px] text-text-muted">Range: ${data.range[0].toLocaleString()}k - ${data.range[1].toLocaleString()}k</div>
      </div>
    );
  }
  return null;
};
