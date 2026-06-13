"use client";

import React, { useState } from "react";
import { 
  FlaskConical, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Activity, 
  Users,
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
  TrendingDown,
  Play,
  Zap,
  Percent,
  Lock,
  Layers,
  Heart,
  Check
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";
import { useSimulation } from "@/context/SimulationContext";

// TypeScript types
interface ExperimentDetails {
  id: string;
  name: string;
  status: "Draft" | "Approved" | "Running" | "Analysis" | "Completed" | "Rolled Out";
  created: string;
  owner: string;
  team: string;
  duration: string;
  hypothesis: string;
  expectedGmv: string;
  expectedLift: string;
  affectedUsers: string;
  revOpportunity: string;
  type: string;
  controlVersion: string;
  variantVersion: string;
  split: string;
  platform: string;
  region: string;
  startDate: string;
  endDate: string;
}

export default function ExperimentsTab() {
  const { isSimulating, experimentExposedOffset } = useSimulation();
  const [activeExperimentId, setActiveExperimentId] = useState("EXP-2026-0458");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [statusState, setStatusState] = useState<"Running" | "Rolled Out" | "Stopped">("Running");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Experiment specs
  const activeExp: ExperimentDetails = {
    id: "EXP-2026-0458",
    name: "UPI Quick Verify Checkout Redesign",
    status: statusState === "Running" ? "Running" : statusState === "Rolled Out" ? "Rolled Out" : "Completed",
    created: "12 June 2026",
    owner: "Aryan Chandra",
    team: "Checkout Growth",
    duration: statusState === "Running" ? "Day 18 / Planned 30 Days" : "Day 30 / Planned 30 Days",
    hypothesis: "If we reduce UPI verification friction by removing one confirmation step, then checkout completion rate will increase because users abandon during payment verification. Expected Impact: +8-12% checkout conversion.",
    expectedGmv: "₹12.5 Cr/month",
    expectedLift: "+8.5%",
    affectedUsers: "2.5 Million",
    revOpportunity: "₹1.8 Cr/month",
    type: "A/B Test",
    controlVersion: "Checkout v3.4 (Old UPI Flow)",
    variantVersion: "Checkout v3.5 (Quick Verify)",
    split: "50% Control / 50% Variant A",
    platform: "Android App",
    region: "India",
    startDate: "12 June 2026",
    endDate: "12 July 2026"
  };

  // Alternate experiments in repository
  const experimentsList = [
    { id: "EXP-2026-0458", name: "UPI Quick Verify Checkout Redesign", status: "Running" },
    { id: "EXP-2026-0391", name: "Recommended Items Placement", status: "Completed" },
    { id: "EXP-2026-0212", name: "Search Bar Auto-Suggest", status: "Rolled Out" },
    { id: "EXP-2026-0104", name: "Home Banner Carousel Cycle Rate", status: "Completed" }
  ];

  // Lifecycle status steps
  const lifecycleSteps = ["Draft", "Approved", "Running", "Analysis", "Completed", "Rolled Out"];
  const getActiveStepIdx = () => {
    if (activeExp.status === "Running") return 2;
    if (activeExp.status === "Analysis") return 3;
    if (activeExp.status === "Completed") return 4;
    return 5;
  };

  // Primary Metrics
  const baseControlRate = 5.0;
  const controlRateVal = isSimulating 
    ? baseControlRate + Math.sin(experimentExposedOffset / 3000) * 0.12 
    : baseControlRate;
  
  const baseVariantRate = 6.2;
  const variantRateVal = isSimulating 
    ? baseVariantRate + Math.cos(experimentExposedOffset / 4000) * 0.15 
    : baseVariantRate;

  const dynamicLiftVal = ((variantRateVal - controlRateVal) / controlRateVal) * 100;
  
  const northStarMetric = {
    name: "Checkout Completion Rate",
    control: `${controlRateVal.toFixed(2)}%`,
    variant: `${variantRateVal.toFixed(2)}%`,
    lift: `${dynamicLiftVal >= 0 ? "+" : ""}${dynamicLiftVal.toFixed(1)}%`,
    confidence: isSimulating 
      ? `${(99.4 + Math.sin(experimentExposedOffset / 5000) * 0.15).toFixed(2)}%` 
      : "99.4%",
    status: dynamicLiftVal > 5 ? "Significant Winner" : "Inconclusive"
  };

  // Secondary metrics
  const secondaryMetrics = [
    { 
      name: "Add To Cart Rate", 
      control: isSimulating ? `${(34 + Math.sin(experimentExposedOffset / 6000) * 0.5).toFixed(1)}%` : "34%", 
      variant: isSimulating ? `${(38 + Math.cos(experimentExposedOffset / 7000) * 0.6).toFixed(1)}%` : "38%", 
      lift: isSimulating 
        ? `+${(((38 + Math.cos(experimentExposedOffset / 7000) * 0.6) - (34 + Math.sin(experimentExposedOffset / 6000) * 0.5)) / (34 + Math.sin(experimentExposedOffset / 6000) * 0.5) * 100).toFixed(1)}%` 
        : "+11.0%", 
      color: "text-emerald-400" 
    },
    { 
      name: "Payment Success Rate", 
      control: isSimulating ? `${(91 + Math.cos(experimentExposedOffset / 8000) * 0.3).toFixed(1)}%` : "91%", 
      variant: isSimulating ? `${(94 + Math.sin(experimentExposedOffset / 9000) * 0.4).toFixed(1)}%` : "94%", 
      lift: isSimulating 
        ? `+${(((94 + Math.sin(experimentExposedOffset / 9000) * 0.4) - (91 + Math.cos(experimentExposedOffset / 8000) * 0.3)) / (91 + Math.cos(experimentExposedOffset / 8000) * 0.3) * 100).toFixed(1)}%` 
        : "+3.0%", 
      color: "text-emerald-400" 
    },
    { 
      name: "Average Order Value", 
      control: isSimulating ? `₹${Math.round(1450 + Math.sin(experimentExposedOffset / 10000) * 20)}` : "₹1450", 
      variant: isSimulating ? `₹${Math.round(1510 + Math.cos(experimentExposedOffset / 11000) * 25)}` : "₹1510", 
      lift: isSimulating 
        ? `+${(((1510 + Math.cos(experimentExposedOffset / 11000) * 25) - (1450 + Math.sin(experimentExposedOffset / 10000) * 20)) / (1450 + Math.sin(experimentExposedOffset / 10000) * 20) * 100).toFixed(1)}%` 
        : "+4.1%", 
      color: "text-emerald-400" 
    },
    { 
      name: "Refund Rate", 
      control: isSimulating ? `${(2.1 + Math.sin(experimentExposedOffset / 12000) * 0.05).toFixed(2)}%` : "2.1%", 
      variant: isSimulating ? `${(2.0 + Math.cos(experimentExposedOffset / 13000) * 0.04).toFixed(2)}%` : "2.0%", 
      lift: isSimulating 
        ? `${(((2.0 + Math.cos(experimentExposedOffset / 13000) * 0.04) - (2.1 + Math.sin(experimentExposedOffset / 12000) * 0.05)) / (2.1 + Math.sin(experimentExposedOffset / 12000) * 0.05) * 100).toFixed(1)}%` 
        : "-4.8%", 
      color: "text-emerald-400", 
      isDrop: true 
    }
  ];

  // Variant performance comparison matrix
  const performanceMatrix = [
    { 
      metric: "Checkout Conversion", 
      control: isSimulating ? `${controlRateVal.toFixed(2)}%` : "5.0%", 
      variant: isSimulating ? `${variantRateVal.toFixed(2)}%` : "6.2%", 
      lift: isSimulating ? `${dynamicLiftVal >= 0 ? "+" : ""}${dynamicLiftVal.toFixed(1)}%` : "+24.0%", 
      color: "text-emerald-400" 
    },
    { 
      metric: "Payment Success", 
      control: isSimulating ? `${(91 + Math.cos(experimentExposedOffset / 8000) * 0.3).toFixed(1)}%` : "91.0%", 
      variant: isSimulating ? `${(94 + Math.sin(experimentExposedOffset / 9000) * 0.4).toFixed(1)}%` : "94.0%", 
      lift: isSimulating 
        ? `+${(((94 + Math.sin(experimentExposedOffset / 9000) * 0.4) - (91 + Math.cos(experimentExposedOffset / 8000) * 0.3)) / (91 + Math.cos(experimentExposedOffset / 8000) * 0.3) * 100).toFixed(1)}%` 
        : "+3.3%", 
      color: "text-emerald-400" 
    },
    { 
      metric: "Revenue/User", 
      control: isSimulating ? `₹${(72 + Math.sin(experimentExposedOffset / 10000) * 1.5).toFixed(1)}` : "₹72.0", 
      variant: isSimulating ? `₹${(81 + Math.cos(experimentExposedOffset / 11000) * 2.0).toFixed(1)}` : "₹81.0", 
      lift: isSimulating 
        ? `+${(((81 + Math.cos(experimentExposedOffset / 11000) * 2.0) - (72 + Math.sin(experimentExposedOffset / 10000) * 1.5)) / (72 + Math.sin(experimentExposedOffset / 10000) * 1.5) * 100).toFixed(1)}%` 
        : "+12.5%", 
      color: "text-emerald-400" 
    },
    { 
      metric: "API Latency", 
      control: isSimulating ? `${(1.8 + Math.sin(experimentExposedOffset / 12000) * 0.05).toFixed(2)}s` : "1.8s", 
      variant: isSimulating ? `${(1.6 + Math.cos(experimentExposedOffset / 13000) * 0.04).toFixed(2)}s` : "1.6s", 
      lift: isSimulating 
        ? `${(((1.6 + Math.cos(experimentExposedOffset / 13000) * 0.04) - (1.8 + Math.sin(experimentExposedOffset / 12000) * 0.05)) / (1.8 + Math.sin(experimentExposedOffset / 12000) * 0.05) * 100).toFixed(1)}%` 
        : "-11.1%", 
      color: "text-emerald-400", 
      isDrop: true 
    }
  ];

  // Segment level analysis table
  const segmentAnalysis = [
    { segment: "New Users", lift: isSimulating ? `+${(32 + Math.sin(experimentExposedOffset / 4000) * 0.8).toFixed(1)}%` : "+32.0%", color: "text-emerald-400" },
    { segment: "Returning Users", lift: isSimulating ? `+${(18 + Math.cos(experimentExposedOffset / 5000) * 0.5).toFixed(1)}%` : "+18.0%", color: "text-emerald-400" },
    { segment: "Android Users", lift: isSimulating ? `+${(28 + Math.sin(experimentExposedOffset / 6000) * 0.7).toFixed(1)}%` : "+28.0%", color: "text-emerald-400" },
    { segment: "iOS Users", lift: isSimulating ? `+${(8 + Math.cos(experimentExposedOffset / 7000) * 0.3).toFixed(1)}%` : "+8.0%", color: "text-emerald-400" },
    { segment: "Tier-1 Cities", lift: isSimulating ? `+${(25 + Math.sin(experimentExposedOffset / 8000) * 0.6).toFixed(1)}%` : "+25.0%", color: "text-emerald-400" },
    { segment: "Tier-3 Cities", lift: isSimulating ? `+${(15 + Math.cos(experimentExposedOffset / 9000) * 0.4).toFixed(1)}%` : "+15.0%", color: "text-emerald-400" }
  ];

  // Funnel comparison Control vs Variant
  const funnelComparison = [
    { step: "Cart Added", control: 100, variant: 100 },
    { step: "Payment Started", control: isSimulating ? parseFloat((82 + Math.sin(experimentExposedOffset / 5000) * 0.8).toFixed(1)) : 82, variant: isSimulating ? parseFloat((88 + Math.cos(experimentExposedOffset / 6000) * 0.9).toFixed(1)) : 88 },
    { step: "UPI Verification", control: isSimulating ? parseFloat((72 + Math.cos(experimentExposedOffset / 7000) * 0.7).toFixed(1)) : 72, variant: isSimulating ? parseFloat((85 + Math.sin(experimentExposedOffset / 8000) * 0.8).toFixed(1)) : 85 },
    { step: "Order Completed", control: controlRateVal, variant: variantRateVal }
  ];

  // Guardrail metrics
  const guardrailMetrics = [
    { name: "App Crash Rate", status: "Healthy", color: "text-emerald-400" },
    { name: "Payment Failure", status: "Improved", color: "text-emerald-400" },
    { name: "Customer Complaints", status: "No Impact", color: "text-emerald-400" },
    { name: "Latency", status: "Improved", color: "text-emerald-400" }
  ];

  // Timeline check list
  const historyTimeline = [
    { date: "12 Jun", label: "Experiment Started" },
    { date: "15 Jun", label: "Reached 500K users exposed" },
    { date: "20 Jun", label: "Initial positive lift signal detected" },
    { date: "25 Jun", label: "Statistical Significance (99.4%) Achieved" },
    { date: "30 Jun", label: "Decision Pending (Day 18 checks)" }
  ];

  // Charts Recharts dataset mapping
  const chartData = [
    { name: "Checkout Rate", Control: controlRateVal, Variant: variantRateVal },
    { name: "Cart Adds", Control: isSimulating ? parseFloat((34 + Math.sin(experimentExposedOffset / 6000) * 0.5).toFixed(1)) : 34, Variant: isSimulating ? parseFloat((38 + Math.cos(experimentExposedOffset / 7000) * 0.6).toFixed(1)) : 38 },
    { name: "Payment Success", Control: isSimulating ? parseFloat((91 + Math.cos(experimentExposedOffset / 8000) * 0.3).toFixed(1)) : 91, Variant: isSimulating ? parseFloat((94 + Math.sin(experimentExposedOffset / 9000) * 0.4).toFixed(1)) : 94 }
  ];

  return (
    <div className="space-y-6 relative pb-12">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-slide-in font-medium text-xs">
          <Check className="w-4 h-4 text-emerald-500" />
          {toastMessage}
        </div>
      )}

      {/* Header Card (LifeCycle status horizontal tracker) */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 text-primary">
              <FlaskConical className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-text-bright">{activeExp.name}</h1>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded border ${
                  activeExp.status === "Running" 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                    : activeExp.status === "Rolled Out" 
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-400" 
                      : "bg-slate-800 border-slate-700 text-text-muted"
                }`}>
                  ● {activeExp.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[11px] text-text-muted">
                <span>ID: <span className="font-mono text-text-bright">{activeExp.id}</span></span>
                <span>Created: <span className="text-text-bright">{activeExp.created}</span></span>
                <span>Owner: <span className="text-text-bright font-semibold">{activeExp.owner}</span></span>
                <span>Team: <span className="text-text-bright">{activeExp.team}</span></span>
                <span>Timeline: <span className="text-text-bright font-medium">{isSimulating ? "Live testing in-progress" : activeExp.duration}</span></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={activeExperimentId}
              onChange={(e) => {
                setActiveExperimentId(e.target.value);
                triggerToast(`Switched active workspace experiment view: ${e.target.value}`);
              }}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-850 rounded-lg text-text-bright focus:outline-none cursor-pointer"
            >
              {experimentsList.map(exp => (
                <option key={exp.id} value={exp.id}>{exp.name} ({exp.id})</option>
              ))}
            </select>
            <button 
              onClick={() => triggerToast("Sharing experiment brief generated")}
              className="p-2 bg-transparent hover:bg-slate-800 text-text-bright border border-slate-800 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Progress Timeline */}
        <div className="pt-3 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-[10px] text-text-muted uppercase font-bold relative pb-2.5">
            {lifecycleSteps.map((step, idx) => {
              const activeIdx = getActiveStepIdx();
              const isPast = idx < activeIdx;
              const isCurrent = idx === activeIdx;
              return (
                <div key={idx} className="flex flex-col items-center flex-1 relative z-10">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border font-mono text-[9px] ${
                    isPast 
                      ? "bg-emerald-500 border-emerald-400 text-white" 
                      : isCurrent 
                        ? "bg-slate-900 border-primary text-primary font-bold shadow-md shadow-primary/20" 
                        : "bg-slate-950 border-slate-800 text-text-muted"
                  }`}>
                    {isPast ? "✓" : idx + 1}
                  </div>
                  <span className={`mt-1.5 ${isCurrent ? "text-primary font-bold" : isPast ? "text-text-bright" : "text-text-muted"}`}>
                    {step}
                  </span>
                </div>
              );
            })}
            
            {/* Background connection bar */}
            <div className="absolute top-2.5 left-8 right-8 h-0.5 bg-slate-950 z-0">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500" 
                style={{ width: `${(getActiveStepIdx() / (lifecycleSteps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Executive Summary & Business Predictors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hypothesis statement */}
        <div className="lg:col-span-1 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold text-text-muted tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-primary" />
              Hypothesis Definition
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              If we reduce UPI verification friction by removing one confirmation step,
            </p>
            <p className="text-xs text-text-bright font-semibold pl-3 border-l-2 border-primary py-0.5">
              Then checkout completion rate will increase,
            </p>
            <p className="text-xs text-text-muted leading-relaxed">
              Because users abandon during payment verification.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-850 mt-4 flex justify-between items-center text-[10px]">
            <span className="text-text-muted">Expected Conversion Lift:</span>
            <span className="font-bold text-emerald-400">+8.0% - 12.0%</span>
          </div>
        </div>

        {/* Predictor cards (2 cols width) */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/20 transition-all">
            <span className="text-[10px] uppercase font-bold text-text-muted">Expected GMV Impact</span>
            <div className="mt-4">
              <div className="text-lg font-extrabold text-emerald-400">{activeExp.expectedGmv}</div>
              <span className="text-[9px] text-text-muted block mt-0.5">Increment per month</span>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-primary/20 transition-all">
            <span className="text-[10px] uppercase font-bold text-text-muted">Target Conversion Lift</span>
            <div className="mt-4">
              <div className="text-lg font-extrabold text-primary">{activeExp.expectedLift}</div>
              <span className="text-[9px] text-text-muted block mt-0.5">Target Lift goal</span>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-purple-500/20 transition-all">
            <span className="text-[10px] uppercase font-bold text-text-muted">Affected Users</span>
            <div className="mt-4">
              <div className="text-lg font-extrabold text-purple-400 font-mono">
                {isSimulating 
                  ? `${((2.5 * 1000000 + experimentExposedOffset) / 1000000).toFixed(6)}M` 
                  : activeExp.affectedUsers}
              </div>
              <span className="text-[9px] text-text-muted block mt-0.5">checkout traffic scope</span>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-pink-500/20 transition-all">
            <span className="text-[10px] uppercase font-bold text-text-muted">Incremental Revenue</span>
            <div className="mt-4">
              <div className="text-lg font-extrabold text-pink-400">
                {isSimulating 
                  ? `₹${(1.8 + experimentExposedOffset / 5000000).toFixed(5)} Cr/mo` 
                  : activeExp.revOpportunity}
              </div>
              <span className="text-[9px] text-text-muted block mt-0.5">Estimated ARR contribution</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Configuration & Targeting & Traffic Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Experiment Design Details */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-2.5 mb-3">
              <h2 className="text-xs uppercase font-bold text-text-muted tracking-wider">Experiment Configuration</h2>
            </div>
            
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-850/60">
                <span className="text-text-muted">Experiment Type</span>
                <span className="text-text-bright font-semibold">{activeExp.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850/60">
                <span className="text-text-muted">Control Variant</span>
                <span className="text-text-bright font-semibold truncate max-w-[150px]">{activeExp.controlVersion}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850/60">
                <span className="text-text-muted">Test Variant A</span>
                <span className="text-emerald-400 font-semibold truncate max-w-[150px]">{activeExp.variantVersion}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850/60">
                <span className="text-text-muted">Primary Platform</span>
                <span className="text-text-bright font-semibold">{activeExp.platform}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-muted">Timeline Window</span>
                <span className="text-text-bright font-semibold">{activeExp.startDate} - {activeExp.endDate}</span>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-text-muted font-medium pt-2 border-t border-slate-800">
            Sticky Assignment: random hash lookup on User ID
          </div>
        </div>

        {/* Middle: Audience Targeting Rules */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-2.5 mb-3 flex items-center justify-between">
              <h2 className="text-xs uppercase font-bold text-text-muted tracking-wider">Audience Targeting</h2>
              <span className="text-[8px] bg-slate-950 border border-slate-850 px-1.5 py-0.5 rounded text-text-bright">Targeting: Active</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-text-bright">Country = India</span>
                <span className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-text-bright">Device = Android</span>
                <span className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-text-bright">Method = UPI</span>
                <span className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-text-bright">Orders &gt; 1</span>
              </div>
              <div className="pt-2 border-t border-slate-850/60 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-text-muted">Eligible Sessions</span>
                  <span className="font-mono text-text-bright font-semibold">12.4 Million</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Exposed Sessions</span>
                  <span className="font-mono text-text-bright font-semibold">2.5 Million</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-text-muted">Control group size</span>
                  <span className="text-text-bright">
                    {isSimulating 
                      ? `${((1.25 * 1000000 + experimentExposedOffset / 2) / 1000000).toFixed(6)}M` 
                      : "1.25M"}
                  </span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-text-muted">Variant group size</span>
                  <span className="text-text-bright">
                    {isSimulating 
                      ? `${((1.25 * 1000000 + experimentExposedOffset / 2) / 1000000).toFixed(6)}M` 
                      : "1.25M"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-text-muted pt-2 border-t border-slate-800 flex justify-between">
            <span>Overall exposure allocation:</span>
            <span className="font-bold text-primary">20% of total traffic</span>
          </div>
        </div>

        {/* Right: Traffic Allocation Visual splits */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-2.5 mb-4">
              <h2 className="text-xs uppercase font-bold text-text-muted tracking-wider">Traffic Allocation Split</h2>
            </div>

            <div className="space-y-4">
              {/* Control split */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-text-bright">Control Variant (50%)</span>
                  <span className="font-mono text-text-muted">
                    {isSimulating 
                      ? Math.floor(1250000 + experimentExposedOffset / 2).toLocaleString() 
                      : "1,250,000"}{" "}
                    Users
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-900">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "50%" }} />
                </div>
                <span className="text-[8px] text-text-muted block font-mono">MD5 Hash Range: 0000 - 4999</span>
              </div>

              {/* Variant A split */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-emerald-400">Variant A (50%)</span>
                  <span className="font-mono text-text-muted">
                    {isSimulating 
                      ? Math.floor(1250000 + experimentExposedOffset / 2).toLocaleString() 
                      : "1,250,000"}{" "}
                    Users
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-900">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "50%" }} />
                </div>
                <span className="text-[8px] text-text-muted block font-mono">MD5 Hash Range: 5000 - 9999</span>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-text-muted pt-2 border-t border-slate-800">
            Split assignment calculation is computed on edge nodes client-side
          </div>
        </div>
      </div>

      {/* Row 3: Primary Metrics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* North Star Metric */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between lg:col-span-1">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-text-bright">{northStarMetric.name}</h2>
                <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block">Primary North Star</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">{northStarMetric.status}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                <span className="text-[9px] text-text-muted uppercase font-bold">Control Rate</span>
                <div className="text-xl font-bold text-text-bright font-mono mt-0.5">{northStarMetric.control}</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                <span className="text-[9px] text-text-muted uppercase font-bold">Variant Rate</span>
                <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{northStarMetric.variant}</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold">Observed Lift: {northStarMetric.lift}</span>
              <span className="text-text-muted">Confidence: <span className="font-bold text-emerald-400">{northStarMetric.confidence}</span></span>
            </div>
          </div>
        </div>

        {/* Secondary Metrics Grid (2 cols width) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {secondaryMetrics.map((metric, idx) => (
            <div key={idx} className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-text-muted">{metric.name}</span>
                <span className={`text-[10px] font-bold ${metric.isDrop ? "text-red-400" : "text-emerald-400"}`}>{metric.lift} lift</span>
              </div>
              <div className="flex justify-between items-baseline mt-4">
                <div className="text-xs text-text-muted">Control: <span className="font-mono font-bold text-text-bright">{metric.control}</span></div>
                <div className="text-xs text-text-muted">Variant: <span className="font-mono font-bold text-text-bright">{metric.variant}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Variant Performance Comparison Table */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5">
        <div className="border-b border-slate-800 pb-3 mb-4">
          <h2 className="text-base font-bold text-text-bright">Metric Comparison Matrix</h2>
          <p className="text-xs text-text-muted">Detailed comparison across conversion, checkouts and latencies.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-text-muted text-[8px] uppercase font-bold tracking-wider">
                <th className="py-2.5">Metric</th>
                <th className="py-2.5 text-right">Control</th>
                <th className="py-2.5 text-right">Variant A</th>
                <th className="py-2.5 text-right">Observed Lift</th>
                <th className="py-2.5 text-center">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-text-bright">
              {performanceMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-850/30 transition-colors">
                  <td className="py-3 font-semibold">{row.metric}</td>
                  <td className="py-3 text-right font-mono text-text-muted">{row.control}</td>
                  <td className="py-3 text-right font-mono font-bold text-text-bright">{row.variant}</td>
                  <td className={`py-3 text-right font-mono font-bold ${row.isDrop ? "text-red-400" : "text-emerald-400"}`}>
                    {row.lift}
                  </td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                      row.isDrop 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    }`}>
                      {row.isDrop ? "Improved" : "Winner"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 5: Statistical Significance Engine details */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5">
        <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-text-bright">Statistical Analysis Engine</h2>
            <p className="text-xs text-text-muted">Calculations verify that observed lifts are not due to sample anomalies.</p>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded">
            99.4% Significance Confirmed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-text-muted">
          {/* Probability Variant Wins */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold">Probability Variant A Wins</span>
            <div className="text-xl font-bold text-emerald-400 font-mono">{northStarMetric.confidence}</div>
            <span className="text-[9px] block">Confidence threshold exceeded</span>
          </div>

          {/* Minimum Detectable Effect */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold">Minimum Detectable Effect</span>
            <div className="text-xl font-bold text-text-bright font-mono">5.0%</div>
            <span className="text-[9px] block">Baseline sensitivity goal</span>
          </div>

          {/* Observed Effect */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold">Observed Lift Effect</span>
            <div className="text-xl font-bold text-emerald-400 font-mono">{northStarMetric.lift}</div>
            <span className="text-[9px] block">Observed North Star impact</span>
          </div>

          {/* Confidence Interval */}
          <div className="space-y-1">
            <span className="block text-[10px] text-text-muted uppercase font-bold">Confidence Interval (95%)</span>
            <div className="text-xl font-bold text-text-bright font-mono">
              {isSimulating 
                ? `+${(dynamicLiftVal - 6.0).toFixed(1)}% to +${(dynamicLiftVal + 6.0).toFixed(1)}%` 
                : "+18.0% to +30.0%"}
            </div>
            <span className="text-[9px] block">Bounds limit lift variance</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-800/60 pt-4 text-xs text-text-muted">
          <div>Sample Size: <span className="font-semibold text-text-bright font-mono">{isSimulating ? `${((2.5 * 1000000 + experimentExposedOffset) / 1000000).toFixed(2)}M Users` : "2.5M Users"}</span></div>
          <div>Statistical Power: <span className="font-semibold text-text-bright font-mono">{isSimulating ? `${Math.min(99, Math.max(90, Math.round(95 + Math.sin(experimentExposedOffset / 4500) * 2)))}%` : "95%"}</span></div>
          <div>Calculated p-value: <span className="font-semibold text-emerald-400 font-mono">{isSimulating ? (0.003 * (99.4 / parseFloat(northStarMetric.confidence))).toFixed(4) : "0.003"}</span></div>
          <div>Confidence Threshold limit: <span className="font-semibold text-text-bright font-mono">95.0%</span></div>
        </div>
      </div>

      {/* Row 6: Segment Level Analysis & Funnel Impact Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Segment Table */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[340px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-3">
              <h2 className="text-sm font-bold text-text-bright">Segment Level Analysis</h2>
              <p className="text-[10px] text-text-muted">Averages hide insights. Variant performance segmented across user cohorts.</p>
            </div>

            <div className="overflow-y-auto max-h-[190px] pr-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-850 text-text-muted text-[8px] uppercase font-bold tracking-wider">
                    <th className="py-1">Segment</th>
                    <th className="py-1 text-right">Observed Lift</th>
                    <th className="py-1 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {segmentAnalysis.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-2 font-medium text-text-bright">{row.segment}</td>
                      <td className="py-2 text-right font-mono text-emerald-400 font-semibold">{row.lift}</td>
                      <td className="py-2 text-center">
                        <span className="px-1.5 py-0.5 rounded text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                          Significant
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-[8px] text-text-muted pt-2 border-t border-slate-800">
            Android users show the highest positive impact (+28%)
          </div>
        </div>

        {/* Right Funnel comparison */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[340px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-3">
              <h2 className="text-sm font-bold text-text-bright">Funnel Conversion Impact</h2>
              <p className="text-[10px] text-text-muted">Conversion steps comparison between Control and Variant A.</p>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[200px] pr-1 text-[11px]">
              {funnelComparison.map((row, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-text-bright">{row.step}</span>
                    <div className="space-x-2 font-mono text-[10px]">
                      <span className="text-text-muted">Control: {row.control}%</span>
                      <span className="text-emerald-400 font-bold">Variant: {row.variant}%</span>
                    </div>
                  </div>
                  <div className="space-y-1 pt-0.5">
                    {/* Control bar */}
                    <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${row.control}%` }} />
                    </div>
                    {/* Variant bar */}
                    <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${row.variant}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[8px] text-text-muted pt-2 border-t border-slate-800 flex justify-between">
            <span>Unified checkout conversion funnel comparison</span>
            <span className="flex items-center gap-2">
              <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Control</span>
              <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Variant</span>
            </span>
          </div>
        </div>
      </div>

      {/* Row 7: Guardrails & Live Monitoring & Experience details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guardrails */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-2.5 mb-3">
              <h2 className="text-xs font-bold text-text-bright uppercase tracking-wider">Guardrail Metrics</h2>
            </div>
            
            <div className="space-y-2.5">
              {guardrailMetrics.map((metric, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-950/60 rounded border border-slate-850">
                  <span className="text-text-muted">{metric.name}</span>
                  <span className={`font-bold flex items-center gap-1 ${metric.color}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {metric.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[8px] text-text-muted">No negative guardrails impacts detected. Experiment is safe.</div>
        </div>

        {/* Live monitoring */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-2.5 mb-3">
              <h2 className="text-xs font-bold text-text-bright uppercase tracking-wider">Live Monitoring</h2>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-850/65">
                <span className="text-text-muted">Exposed Today</span>
                <span className="font-mono text-text-bright font-semibold">320K users</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850/65">
                <span className="text-text-muted">Conversion Today</span>
                <span className="font-mono text-emerald-400 font-bold">6.4%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850/65">
                <span className="text-text-muted">Anomaly Check</span>
                <span className="text-emerald-400 font-semibold">No anomalies</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-muted">Experiment Health</span>
                <span className="text-emerald-400 font-bold">Healthy</span>
              </div>
            </div>
          </div>
          <div className="text-[9px] text-emerald-400 font-semibold font-mono">Live checkouts tracking synched</div>
        </div>

        {/* Variant Experience Details */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-2.5 mb-3">
              <h2 className="text-xs font-bold text-text-bright uppercase tracking-wider">Variant Experience Design</h2>
            </div>

            <div className="space-y-3 text-[11px] overflow-y-auto max-h-[190px] pr-1">
              <div className="p-2 bg-slate-950 rounded border border-slate-850/80">
                <span className="text-[9px] uppercase font-bold text-text-muted">Control: {activeExp.controlVersion}</span>
                <p className="text-[10px] text-text-bright mt-0.5 leading-tight">Old UPI verification flow requiring OTP confirmations. Renders 4 screen steps.</p>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-emerald-500/25">
                <span className="text-[9px] uppercase font-bold text-emerald-400">Variant A: {activeExp.variantVersion}</span>
                <p className="text-[10px] text-text-bright mt-0.5 leading-tight">Removed OTP confirmation screens, added UPI fast auto verification. Renders 2 screen steps.</p>
              </div>
            </div>
          </div>
          <div className="text-[8px] text-text-muted">Tracked Events: checkout_started, upi_entered, payment_success.</div>
        </div>
      </div>

      {/* Row 8: AI Recommendations & Rollout controls */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-text-bright flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              AI Recommendation Engine
            </h3>
            <span className="text-[9px] text-emerald-400 font-bold font-mono px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded">
              Ready to ship
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 flex-1 max-w-2xl text-xs text-text-muted">
              <h4 className="font-bold text-emerald-400 text-sm">Ship Variant A (Quick Verify Checkout)</h4>
              <p className="leading-relaxed">
                Variant A shows a <span className="text-emerald-400 font-bold font-mono">+24.0%</span> checkout conversion lift (99.4% confidence). No negative app crash or latency impacts detected.
              </p>
              <div className="flex items-center gap-4 text-[10px] text-text-muted pt-1">
                <span>Estimated annual revenue lift: <span className="font-bold text-emerald-400">₹21.6 Cr</span></span>
                <span>Power Index: <span className="font-semibold text-text-bright">95%</span></span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => {
                  setStatusState("Rolled Out");
                  triggerToast("Rollout initialized: Variant A deployed to 100% checkout traffic!");
                }}
                className="h-[36px] bg-[#00D084] hover:bg-emerald-600 text-slate-950 font-extrabold text-xs px-4 rounded-lg flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                Rollout to 100%
              </button>
              <button 
                onClick={() => triggerToast("Experiment runtime extended for 14 days")}
                className="h-[36px] bg-transparent hover:bg-slate-800 text-text-bright border border-slate-800 text-xs font-semibold px-4 rounded-lg transition-colors cursor-pointer"
              >
                Keep Running
              </button>
              <button 
                onClick={() => {
                  setStatusState("Stopped");
                  triggerToast("Experiment halted. Rerouting checkout flow back to Control.");
                }}
                className="h-[36px] bg-transparent hover:bg-red-950/20 text-red-400 border border-red-500/30 text-xs font-semibold px-4 rounded-lg transition-colors cursor-pointer"
              >
                Stop Experiment
              </button>
              <button 
                onClick={() => triggerToast("Experiment archived to company knowledge repository")}
                className="h-[36px] bg-transparent hover:bg-slate-800 text-text-bright border border-slate-800 text-xs font-semibold px-4 rounded-lg transition-colors cursor-pointer"
              >
                Archive Learning
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 9: Experiment History & Learning Repository */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* History timeline list */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-3">
              <h2 className="text-sm font-bold text-text-bright">Experiment History Timeline</h2>
              <p className="text-[10px] text-text-muted">Campaign audit logs tracking test progression checkpoints.</p>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[170px] pr-1 text-[11px]">
              {historyTimeline.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start border-b border-slate-900/50 pb-2 last:border-0">
                  <span className="font-bold text-primary font-mono w-12 flex-shrink-0 text-right">{item.date}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                    <span className="text-text-bright leading-tight">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[8px] text-text-muted pt-2 border-t border-slate-800">
            Last modified by Aryan Chandra, 25 mins ago
          </div>
        </div>

        {/* Learning repository */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-3">
              <h2 className="text-sm font-bold text-text-bright">Organizational Learning Archive</h2>
              <p className="text-[10px] text-text-muted">Archived findings generated from this checkout experiment.</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-2 rounded border border-slate-850">
                  <span className="text-[8px] uppercase font-bold text-text-muted">Discovered friction</span>
                  <p className="font-semibold text-text-bright mt-0.5">Payment checkout verification</p>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-850">
                  <span className="text-[8px] uppercase font-bold text-text-muted">Solution applied</span>
                  <p className="font-semibold text-emerald-400 mt-0.5">UPI Quick Auto Verification</p>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded border border-slate-850">
                <span className="text-[8px] uppercase font-bold text-text-muted block">Reusable growth insight</span>
                <p className="text-[11px] text-text-bright mt-1 leading-snug">
                  Payment authorization is the highest drop-off stage of checkout funnels. Eliminating OTP validation screens for secure UPI aliases increases checkout completions by over 20% without increasing transaction disputes.
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => triggerToast("Loading organization-wide checkout learning library...")}
            className="text-[10px] text-primary hover:underline text-left font-semibold flex items-center gap-1"
          >
            View all checkout archives →
          </button>
        </div>
      </div>
    </div>
  );
}
