"use client";

import React, { useState } from "react";
import { 
  Flag, 
  ToggleLeft, 
  ToggleRight, 
  Plus, 
  Trash2, 
  Sliders, 
  AlertCircle, 
  Sparkles,
  Info,
  ChevronDown,
  Calendar,
  Filter,
  Share2,
  Download,
  Bell,
  MoreHorizontal,
  X,
  Zap,
  Percent,
  Play,
  Activity,
  Users,
  Shield,
  Layers,
  HelpCircle,
  Clock,
  RefreshCw,
  GitMerge,
  UserCheck
} from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";

// TypeScript interfaces
interface AuditLogRow {
  timestamp: string;
  user: string;
  action: string;
  before: string;
  after: string;
}

interface FeatureFlagDataRow {
  id: string;
  name: string;
  key: string;
  status: "Active" | "Testing" | "Disabled";
  rolloutPercentage: number;
  environment: string;
  owner: string;
  created: string;
  risk: "Low" | "Medium" | "High";
  description: string;
  service: string;
  repository: string;
  exposedUsers: string;
  conversionLift: string;
  revenueImpact: string;
  type: "Release Flag" | "Experiment Flag" | "Permission Flag" | "Kill Switch" | "Configuration Flag";
  latencyBefore: string;
  latencyAfter: string;
  crashBefore: string;
  crashAfter: string;
  errorBefore: string;
  errorAfter: string;
  dependsOn: string[];
  usedBy: string[];
  auditLogs: AuditLogRow[];
}

export default function FeatureFlagsTab() {
  const { isSimulating, flagEvaluationsOffset } = useSimulation();
  // Environments state
  const [environment, setEnvironment] = useState("Production");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Create / Emergency states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFlagName, setNewFlagName] = useState("");
  const [newFlagKey, setNewFlagKey] = useState("");
  const [newFlagType, setNewFlagType] = useState<any>("Release Flag");

  // Global Emergency Kill Switch
  const [emergencyStatus, setEmergencyStatus] = useState<"Normal" | "Triggered">("Normal");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Static/Mock Database of Enterprise Flags
  const [flags, setFlags] = useState<FeatureFlagDataRow[]>([
    {
      id: "FF-938291",
      name: "Beta Checkout Flow",
      key: "beta_checkout_flow",
      status: "Active",
      rolloutPercentage: 80,
      environment: "Production",
      owner: "Checkout Team",
      created: "12 Jun 2026",
      risk: "Low",
      description: "Enable new checkout architecture, removing OTP screens for secure UPI aliases.",
      service: "Checkout API",
      repository: "checkout-web",
      exposedUsers: "12.4M",
      conversionLift: "+8.2%",
      revenueImpact: "₹4.2 Cr",
      type: "Release Flag",
      latencyBefore: "220ms", latencyAfter: "215ms",
      crashBefore: "0.4%", crashAfter: "0.3%",
      errorBefore: "1.2%", errorAfter: "0.8%",
      dependsOn: ["Checkout API", "Payment Gateway", "UPI Service"],
      usedBy: ["Android App", "Web App", "iOS App"],
      auditLogs: [
        { timestamp: "13:45", user: "Aryan Chandra", action: "Rollout Increased", before: "50%", after: "80%" },
        { timestamp: "12:20", user: "Rahul Verma", action: "Rule Updated", before: "Country = India", after: "India + Android" }
      ]
    },
    {
      id: "FF-884210",
      name: "AI Search Suggestion",
      key: "ai_search_v2",
      status: "Testing",
      rolloutPercentage: 20,
      environment: "Production",
      owner: "Search Team",
      created: "05 Jun 2026",
      risk: "Medium",
      description: "AI-based autosuggestions on homepage search box queries.",
      service: "Search Indexer",
      repository: "search-api",
      exposedUsers: "2.4M",
      conversionLift: "+4.5%",
      revenueImpact: "₹1.2 Cr",
      type: "Experiment Flag",
      latencyBefore: "180ms", latencyAfter: "198ms",
      crashBefore: "0.1%", crashAfter: "0.1%",
      errorBefore: "0.5%", errorAfter: "0.9%",
      dependsOn: ["Search Indexer API", "Recommendation Model"],
      usedBy: ["Android App", "Web App"],
      auditLogs: [
        { timestamp: "10:10", user: "Sneha Patil", action: "Flag Activated", before: "Disabled", after: "Testing" }
      ]
    },
    {
      id: "FF-772948",
      name: "Wallet Cashback Reward",
      key: "wallet_reward_engine",
      status: "Disabled",
      rolloutPercentage: 0,
      environment: "Production",
      owner: "Payments Team",
      created: "01 Jun 2026",
      risk: "High",
      description: "Distribute cashback credits to customers checking out via partner wallets.",
      service: "Rewards Service",
      repository: "rewards-engine",
      exposedUsers: "0",
      conversionLift: "---",
      revenueImpact: "₹0",
      type: "Kill Switch",
      latencyBefore: "110ms", latencyAfter: "---",
      crashBefore: "0.2%", crashAfter: "---",
      errorBefore: "0.8%", errorAfter: "---",
      dependsOn: ["Wallet API", "Promo Ledger"],
      usedBy: ["Android App", "iOS App"],
      auditLogs: [
        { timestamp: "09:30", user: "Amit Shah", action: "Flag Halted", before: "Active (20%)", after: "Disabled (0%)" }
      ]
    }
  ]);

  // Selected flag inside Details Workspace
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlagDataRow>(flags[0]);

  // Handle active flag edit updates
  const handleUpdateRolloutSlider = (val: number) => {
    const updated = { ...selectedFlag, rolloutPercentage: val };
    setSelectedFlag(updated);
    setFlags(flags.map(f => f.id === selectedFlag.id ? updated : f));
  };

  const handleToggleActiveFlagStatus = () => {
    const nextStatus = selectedFlag.status === "Active" ? "Disabled" as const : "Active" as const;
    const nextRollout = nextStatus === "Active" ? 50 : 0;
    const updated = { ...selectedFlag, status: nextStatus, rolloutPercentage: nextRollout };
    setSelectedFlag(updated);
    setFlags(flags.map(f => f.id === selectedFlag.id ? updated : f));
    triggerToast(`Feature flag '${selectedFlag.name}' status set to ${nextStatus}`);
  };

  const handleCreateFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlagName || !newFlagKey) {
      triggerToast("Error: name and key are required!");
      return;
    }
    const newFlag: FeatureFlagDataRow = {
      id: `FF-${Math.floor(100000 + Math.random() * 900000)}`,
      name: newFlagName,
      key: newFlagKey.toLowerCase().replace(/\s+/g, "_"),
      status: "Testing",
      rolloutPercentage: 10,
      environment: "Production",
      owner: "Core App Team",
      created: "14 June 2026",
      risk: "Medium",
      description: `Release controls for ${newFlagName}.`,
      service: "Gateway API",
      repository: "app-core",
      exposedUsers: "100K",
      conversionLift: "+0.5%",
      revenueImpact: "₹10K",
      type: newFlagType,
      latencyBefore: "120ms", latencyAfter: "122ms",
      crashBefore: "0.1%", crashAfter: "0.1%",
      errorBefore: "0.2%", errorAfter: "0.2%",
      dependsOn: ["Gateway API"],
      usedBy: ["Android App", "Web App", "iOS App"],
      auditLogs: [
        { timestamp: "03:15", user: "Aryan Chandra", action: "Flag Initialized", before: "Draft", after: "Testing" }
      ]
    };

    setFlags([...flags, newFlag]);
    setSelectedFlag(newFlag);
    setShowCreateModal(false);
    setNewFlagName("");
    setNewFlagKey("");
    triggerToast(`Bootstrap feature flag '${newFlag.name}' registered successfully.`);
  };

  return (
    <div className="space-y-6 relative pb-12">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-slide-in font-medium text-xs">
          <Info className="w-4 h-4 text-emerald-500" />
          {toastMessage}
        </div>
      )}

      {/* Header Command Center Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 text-primary">
            <Flag className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-text-bright">Feature Flag Command Center</h1>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded">
                SDK Sync: Healthy
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[11px] text-text-muted">
              <span>Environment: <span className="text-emerald-400 font-semibold">● {environment}</span></span>
              <span>Active Flags: <span className="text-text-bright font-semibold">142</span></span>
              <span>Evaluated Today: <span className="text-text-bright font-semibold font-mono">
                {isSimulating 
                  ? `${((48.2 * 1000000 + flagEvaluationsOffset) / 1000000).toFixed(6)}M Users` 
                  : "48.2M Users"}
              </span></span>
              <span>Last Sync: <span className="text-text-bright font-mono">{isSimulating ? "Just now" : "12s ago"}</span></span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Environment dropdown */}
          <select
            value={environment}
            onChange={(e) => {
              setEnvironment(e.target.value);
              triggerToast(`Environment set to: ${e.target.value}`);
            }}
            className="h-[36px] px-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-text-bright cursor-pointer"
          >
            <option value="Production">Production</option>
            <option value="Staging">Staging</option>
            <option value="Testing">Testing</option>
            <option value="Development">Development</option>
          </select>

          <button 
            onClick={() => setShowCreateModal(true)}
            className="h-[36px] bg-[#00D084] hover:bg-emerald-600 text-slate-950 text-xs font-bold px-4 rounded-lg flex items-center gap-1.5 transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" />
            + Create Flag
          </button>
          
          <button 
            onClick={() => {
              setEmergencyStatus(emergencyStatus === "Normal" ? "Triggered" : "Normal");
              triggerToast(emergencyStatus === "Normal" ? "EMERGENCY KILLED ALL LIVE TARGET FLAGS!" : "Emergency rollback restored.");
            }}
            className="h-[36px] bg-transparent hover:bg-red-950/20 text-red-400 border border-red-500/30 text-xs font-semibold px-4 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            {emergencyStatus === "Normal" ? "Emergency Kill Switch" : "Cancel Emergency Halted"}
          </button>
        </div>
      </div>

      {/* Health Metrics Row (5 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/20 transition-all">
          <span className="text-[10px] uppercase font-bold text-text-muted">Active Flags</span>
          <div className="mt-3">
            <div className="text-xl font-bold text-text-bright">142</div>
            <span className="text-[9px] text-emerald-400 font-semibold">↑ 12 this month</span>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-primary/20 transition-all">
          <span className="text-[10px] uppercase font-bold text-text-muted">Users Evaluated</span>
          <div className="mt-3">
            <div className="text-xl font-bold text-text-bright font-mono">
              {isSimulating 
                ? `${((48.2 * 1000000 + flagEvaluationsOffset) / 1000000).toFixed(6)}M` 
                : "48.2M"}
            </div>
            <span className="text-[9px] text-text-muted">{isSimulating ? "Ticking live..." : "Accumulated today"}</span>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-purple-500/20 transition-all">
          <span className="text-[10px] uppercase font-bold text-text-muted">Production Rollouts</span>
          <div className="mt-3">
            <div className="text-xl font-bold text-text-bright">37</div>
            <span className="text-[9px] text-purple-400 font-semibold font-mono">Currently Running</span>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-pink-500/20 transition-all">
          <span className="text-[10px] uppercase font-bold text-text-muted">Risk Status</span>
          <div className="mt-3">
            <div className="text-xl font-bold text-emerald-400">Healthy</div>
            <span className="text-[9px] text-text-muted">0 Critical Issues</span>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-red-500/20 transition-all">
          <span className="text-[10px] uppercase font-bold text-text-muted">Flags Expiring Soon</span>
          <div className="mt-3">
            <div className="text-xl font-bold text-red-400">8 Flags</div>
            <span className="text-[9px] text-red-400 font-semibold">Needs cleanup</span>
          </div>
        </div>
      </div>

      {/* Main Workspace (Left Sidebar Inventory Table + Right Configuration Details Editor) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Flags Inventory */}
        <div className="lg:col-span-1 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-bold text-text-bright flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Feature flags Inventory
            </h2>
            <p className="text-[10px] text-text-muted">Select active parameters config workspace.</p>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[550px] pr-2">
            {flags.map((flag) => {
              const isSelected = selectedFlag.id === flag.id;
              const isOn = flag.status === "Active" || flag.status === "Testing";
              return (
                <div
                  key={flag.id}
                  onClick={() => setSelectedFlag(flag)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2.5 text-xs select-none ${
                    isSelected 
                      ? "bg-slate-950 border-primary" 
                      : "bg-slate-950/40 border-slate-800/60 hover:border-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-text-bright leading-tight">{flag.name}</h4>
                      <span className="text-[9px] font-mono text-text-muted">{flag.key}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // toggle status
                        const nextStatus = flag.status === "Active" ? "Disabled" as const : "Active" as const;
                        const updated = { ...flag, status: nextStatus, rolloutPercentage: nextStatus === "Active" ? 80 : 0 };
                        if (selectedFlag.id === flag.id) setSelectedFlag(updated);
                        setFlags(flags.map(f => f.id === flag.id ? updated : f));
                        triggerToast(`Flag ${flag.key} set to ${nextStatus}`);
                      }}
                      className="text-text-muted hover:text-text-bright transition-colors"
                    >
                      {isOn ? (
                        <div className="w-8 h-4 rounded-full bg-emerald-500 relative"><div className="w-3 h-3 rounded-full bg-white absolute top-0.5 left-4.5" /></div>
                      ) : (
                        <div className="w-8 h-4 rounded-full bg-slate-800 relative"><div className="w-3 h-3 rounded-full bg-white absolute top-0.5 left-0.5" /></div>
                      )}
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-[9px] pt-1 border-t border-slate-900/60">
                    <span className={`px-1.5 py-0.5 rounded font-bold border uppercase ${
                      flag.status === "Active" 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                        : flag.status === "Testing" 
                          ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                          : "bg-slate-800 border-slate-750 text-text-muted"
                    }`}>
                      {flag.status}
                    </span>
                    <span className="font-mono text-text-muted">Rollout: {flag.rolloutPercentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Columns: Feature Workspace Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {selectedFlag ? (
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 space-y-6">
              
              {/* Selected Flag Workspace Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-850">
                    <Flag className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-bright">{selectedFlag.name} Details</h3>
                    <span className="text-[9px] text-text-muted font-mono">{selectedFlag.id} ({selectedFlag.key})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleToggleActiveFlagStatus}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      selectedFlag.status === "Active" 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-slate-950 border-slate-800 text-text-muted hover:text-text-bright"
                    }`}
                  >
                    {selectedFlag.status === "Active" ? "Active (On)" : "Disabled (Off)"}
                  </button>
                  <button 
                    onClick={() => {
                      setFlags(flags.filter(f => f.id !== selectedFlag.id));
                      setSelectedFlag(flags.find(f => f.id !== selectedFlag.id) || flags[0]);
                      triggerToast(`Flag ${selectedFlag.key} successfully archived.`);
                    }}
                    className="p-1.5 bg-transparent hover:bg-red-950/20 text-red-400 border border-red-500/20 hover:border-red-500/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Flag Type selector tab controls */}
              <div className="space-y-1.5">
                <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Feature Flag Type</span>
                <div className="flex flex-wrap gap-2">
                  {["Release Flag", "Experiment Flag", "Permission Flag", "Kill Switch", "Configuration Flag"].map((type) => {
                    const isTypeSelected = selectedFlag.type === type;
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          const updated = { ...selectedFlag, type: type as any };
                          setSelectedFlag(updated);
                          setFlags(flags.map(f => f.id === selectedFlag.id ? updated : f));
                          triggerToast(`Flag type updated to: ${type}`);
                        }}
                        className={`text-[9px] px-2.5 py-1.5 font-bold rounded-lg border transition-all ${
                          isTypeSelected 
                            ? "bg-primary/10 border-primary/30 text-primary" 
                            : "bg-slate-950 border-slate-850 text-text-muted hover:text-text-bright hover:border-slate-700"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rules Configuration Studio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Configuration studio metadata */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-text-bright border-b border-slate-800 pb-1.5 uppercase">Configuration Studio</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-text-muted">Description</span>
                      <p className="text-text-bright font-medium">{selectedFlag.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-[10px] text-text-muted">Microservice Scope</span>
                        <div className="text-text-bright font-semibold">{selectedFlag.service}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-text-muted">Repository scope</span>
                        <div className="text-text-bright font-mono">{selectedFlag.repository}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audience Targeting Rules Builder */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-text-bright border-b border-slate-800 pb-1.5 uppercase">Audience Targeting Builder</h4>
                  <div className="space-y-2">
                    <div className="flex flex-col gap-1.5 text-xs">
                      <div className="flex items-center gap-1.5 p-2 rounded bg-slate-950 border border-slate-850">
                        <span className="text-emerald-400 font-bold uppercase text-[9px]">IF</span>
                        <span className="text-text-bright font-medium">Country = India</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded bg-slate-950 border border-slate-850">
                        <span className="text-emerald-400 font-bold uppercase text-[9px]">AND</span>
                        <span className="text-text-bright font-medium">Device = Android</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => triggerToast("Rules builder addition triggered")}
                      className="text-[10px] text-primary hover:underline font-semibold flex items-center gap-1 mt-1"
                    >
                      + Add Target Rule condition
                    </button>
                  </div>
                </div>
              </div>

              {/* Rollout strategy timeline tracker */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-text-bright border-b border-slate-800 pb-1.5 uppercase">Rollout Strategy Workflow</h4>
                  
                  {/* Stages */}
                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-850">
                      <span className="text-text-muted">Stage 1: Internal Employees</span>
                      <span className="text-emerald-400 font-bold">✓ Complete</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-850">
                      <span className="text-text-muted">Stage 2: Beta cohorts (5%)</span>
                      <span className="text-emerald-400 font-bold">✓ Complete</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-850">
                      <span className="text-text-muted">Stage 3: exposed Traffic (60%)</span>
                      <span className="text-primary font-bold">Running</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs text-text-muted">
                      <span>Exposure Slider: <span className="font-mono text-primary font-bold">{selectedFlag.rolloutPercentage}%</span></span>
                      <span>MD5 range assignment</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      value={selectedFlag.rolloutPercentage}
                      onChange={(e) => handleUpdateRolloutSlider(Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>
                </div>

                {/* Hash Bucketing assignments */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-text-bright border-b border-slate-800 pb-1.5 uppercase">Hash Bucketing allocation</h4>
                  <div className="bg-slate-950/60 p-4 border border-slate-850 rounded-xl space-y-3.5 text-xs text-text-muted">
                    <div className="flex justify-between">
                      <span>Assignment Method</span>
                      <span className="font-bold text-text-bright">User ID Hash</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Bucket Range</span>
                      <span className="font-mono text-text-bright">0 - 9999</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800/80 pt-2">
                      <span>Control (Off)</span>
                      <span className="font-mono text-text-bright">0 - 4999</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Enabled (On)</span>
                      <span className="font-mono text-emerald-400 font-bold">5000 - 9999</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Technical Impact Monitoring */}
              <div className="pt-2 space-y-3.5">
                <h4 className="text-xs font-bold text-text-bright border-b border-slate-800 pb-1.5 uppercase">Real-Time Impact Monitors</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Business impact metrics */}
                  <div className="bg-slate-950/50 p-4 border border-slate-850 rounded-xl space-y-2.5 text-xs">
                    <span className="text-[10px] text-text-muted uppercase font-bold block">Business Conversion</span>
                    <div className="flex justify-between">
                      <span>Exposed Users</span>
                      <span className="font-mono text-text-bright font-bold">{selectedFlag.exposedUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Checkout Conversion Lift</span>
                      <span className="font-mono text-emerald-400 font-bold">{selectedFlag.conversionLift}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Attributed Revenue</span>
                      <span className="font-mono text-text-bright font-bold">{selectedFlag.revenueImpact}</span>
                    </div>
                  </div>

                  {/* Technical metrics before/after */}
                  <div className="bg-slate-950/50 p-4 border border-slate-850 rounded-xl space-y-2.5 text-xs text-text-muted">
                    <span className="text-[10px] text-text-muted uppercase font-bold block">System Latency & Stability</span>
                    <div className="flex justify-between">
                      <span>API Latency</span>
                      <span>{selectedFlag.latencyBefore} <span className="text-emerald-400">→ {selectedFlag.latencyAfter}</span></span>
                    </div>
                    <div className="flex justify-between">
                      <span>App Crash Rate</span>
                      <span>{selectedFlag.crashBefore} <span className="text-emerald-400">→ {selectedFlag.crashAfter}</span></span>
                    </div>
                    <div className="flex justify-between">
                      <span>Server Error Rate</span>
                      <span>{selectedFlag.errorBefore} <span className="text-emerald-400">→ {selectedFlag.errorAfter}</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety & risk audit logs panels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Audit Logs list */}
                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-xs font-bold text-text-bright border-b border-slate-800 pb-1.5 uppercase">Change History & Audit Logs</h4>
                  
                  <div className="space-y-2 overflow-y-auto max-h-[140px] pr-1 text-xs">
                    {selectedFlag.auditLogs.map((log, idx) => (
                      <div key={idx} className="bg-slate-950 p-2.5 rounded border border-slate-850/60 flex items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-text-bright">{log.action}</span>
                          <span className="text-[10px] text-text-muted block">{log.timestamp} by {log.user}</span>
                        </div>
                        <span className="font-mono text-[10px] text-text-muted">{log.before} → <span className="text-emerald-400 font-semibold">{log.after}</span></span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dependencies graph scope */}
                <div className="md:col-span-1 space-y-3 text-xs text-text-muted">
                  <h4 className="text-xs font-bold text-text-bright border-b border-slate-800 pb-1.5 uppercase">Dependency scope</h4>
                  <div className="bg-slate-950 p-3.5 border border-slate-850 rounded-xl space-y-3">
                    <div>
                      <span className="text-[8px] uppercase font-bold text-text-muted">Depends On</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedFlag.dependsOn.map(dep => (
                          <span key={dep} className="text-[9px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-text-bright font-semibold">{dep}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase font-bold text-text-muted">Used By Client SDKs</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedFlag.usedBy.map(cli => (
                          <span key={cli} className="text-[9px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-text-bright font-semibold">{cli}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety kill switch & cleanup lifecycles & AI assistant */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Emergency Kill switch */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex flex-col justify-between h-[180px] text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-extrabold text-red-400 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-red-500" />
                      Emergency Controls
                    </span>
                    <p className="text-[10px] text-text-muted leading-relaxed">
                      Kill this feature globally. Reroutes checkout API config to Control default.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      // disable flag
                      const updated = { ...selectedFlag, status: "Disabled" as const, rolloutPercentage: 0 };
                      setSelectedFlag(updated);
                      setFlags(flags.map(f => f.id === selectedFlag.id ? updated : f));
                      triggerToast(`EMERGENCY KILLED: Flag ${selectedFlag.key} disabled globally!`);
                    }}
                    className="w-full py-2 bg-red-500 hover:bg-red-650 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Disable Feature Globally
                  </button>
                </div>

                {/* Stale flags cleanups */}
                <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between h-[180px] text-left text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-text-muted">Flag Cleanup lifecycle</span>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="bg-slate-950 p-2 rounded text-center border border-slate-850">
                        <span className="text-[8px] uppercase block text-text-muted font-bold">Stale Flags</span>
                        <span className="text-base font-bold text-red-400">8</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded text-center border border-slate-850">
                        <span className="text-[8px] uppercase block text-text-muted font-bold">Expired Flags</span>
                        <span className="text-base font-bold text-text-bright">14</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => triggerToast("Scanning directory for stale flag code implementations...")}
                    className="text-[10px] text-primary font-bold hover:underline self-start"
                  >
                    Launch Stale Flags Cleanup Analyzer →
                  </button>
                </div>

                {/* AI Assistant recommendation */}
                <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between h-[180px] text-left text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      AI Flag Assistant
                    </span>
                    <p className="text-[10px] text-text-muted leading-snug">
                      "This flag has been running for 45 days. Performance impact is positive. Recommended action: Increase rollout to 100%."
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      handleUpdateRolloutSlider(100);
                      triggerToast("AI suggestion applied: Rollout set to 100%");
                    }}
                    className="w-full py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary rounded text-[10px] font-bold transition-colors cursor-pointer"
                  >
                    Apply AI rollout suggestions
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center text-text-muted flex-1 flex flex-col justify-center items-center gap-2">
              <Sliders className="w-12 h-12 text-slate-800 animate-pulse" />
              <p className="text-sm font-semibold">Select a feature flag parameter to load configurations.</p>
            </div>
          )}
        </div>
      </div>

      {/* Info panel footer */}
      <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-950 border border-slate-850 rounded-lg text-primary">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-bright">About Remote Feature Flags</h4>
            <p className="text-[10px] text-text-muted mt-0.5">
              Feature flags enable remote configurations management, allowing engineering groups to toggle or roll out beta features safely without triggering compile redeploy cycles.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-semibold">
          <button 
            onClick={() => triggerToast("Launching walkthrough guide: Feature Flag Rollouts 101...")}
            className="text-text-muted hover:text-text-bright flex items-center gap-1"
          >
            <Play className="w-3.5 h-3.5" />
            Learn Rollouts
          </button>
          <button 
            onClick={() => triggerToast("Opening Feature Flags best practices documentation...")}
            className="text-text-muted hover:text-text-bright flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            View documentation
          </button>
        </div>
      </div>

      {/* Create Flag Modal popup */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setShowCreateModal(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
          />

          {/* Modal content */}
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 z-10 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-text-bright">Create Feature Flag</h3>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-text-muted hover:text-text-bright transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFlagSubmit} className="space-y-4 text-xs text-text-muted">
              <div className="space-y-1">
                <label className="block text-[10px] text-text-muted uppercase font-bold">Display Name</label>
                <input
                  type="text"
                  value={newFlagName}
                  onChange={(e) => {
                    setNewFlagName(e.target.value);
                    setNewFlagKey(e.target.value.toLowerCase().replace(/\s+/g, "_"));
                  }}
                  placeholder="e.g. Beta Checkout Flow"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-text-bright focus:outline-none focus:border-primary placeholder-text-muted font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-text-muted uppercase font-bold">Flag Identifier Key</label>
                <input
                  type="text"
                  value={newFlagKey}
                  onChange={(e) => setNewFlagKey(e.target.value)}
                  placeholder="e.g. beta_checkout_flow"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-text-bright focus:outline-none focus:border-primary placeholder-text-muted font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-text-muted uppercase font-bold">Flag Release Type</label>
                <select
                  value={newFlagType}
                  onChange={(e) => setNewFlagType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-text-bright focus:outline-none"
                >
                  <option value="Release Flag">Release Flag (gradual rollout)</option>
                  <option value="Experiment Flag">Experiment Flag (A/B testing)</option>
                  <option value="Permission Flag">Permission Flag (entitlements)</option>
                  <option value="Kill Switch">Kill Switch (safety fallback)</option>
                  <option value="Configuration Flag">Configuration Flag (values config)</option>
                </select>
              </div>

              {/* Modal actions */}
              <div className="border-t border-slate-800 pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-transparent hover:bg-slate-800 border border-slate-800 text-text-bright text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#00D084] hover:bg-emerald-600 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
