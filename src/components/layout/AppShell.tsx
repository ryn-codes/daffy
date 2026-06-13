"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  Activity, 
  Users, 
  Filter, 
  RefreshCw, 
  Target, 
  Layers, 
  GitFork, 
  DollarSign, 
  FlaskConical, 
  Flag, 
  Play, 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Sliders, 
  Sparkles, 
  PlusCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockEngine } from "@/lib/mockEngine";

// Import tabs dynamically in client scope
import OverviewTab from "@/features/OverviewTab";
import EventsTab from "@/features/EventsTab";
import UsersTab from "@/features/UsersTab";
import FunnelsTab from "@/features/FunnelsTab";
import RetentionTab from "@/features/RetentionTab";
import CohortsTab from "@/features/CohortsTab";
import SegmentationTab from "@/features/SegmentationTab";
import JourneysTab from "@/features/JourneysTab";
import RevenueTab from "@/features/RevenueTab";
import ExperimentsTab from "@/features/ExperimentsTab";
import FeatureFlagsTab from "@/features/FeatureFlagsTab";
import SessionReplayTab from "@/features/SessionReplayTab";

interface AppShellProps {
  initialTab?: string;
}

export default function AppShell({ initialTab = "overview" }: AppShellProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [collapsed, setCollapsed] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedCount, setSimulatedCount] = useState(0);

  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "events", label: "Event Explorer", icon: Activity },
    { id: "users", label: "Users", icon: Users },
    { id: "funnels", label: "Funnels", icon: Filter },
    { id: "retention", label: "Retention Matrix", icon: RefreshCw },
    { id: "cohorts", label: "Cohorts", icon: Target },
    { id: "segments", label: "Segmentation", icon: Layers },
    { id: "journeys", label: "User Journeys", icon: GitFork },
    { id: "revenue", label: "Revenue", icon: DollarSign },
    { id: "experiments", label: "Experiments", icon: FlaskConical },
    { id: "flags", label: "Feature Flags", icon: Flag },
    { id: "replay", label: "Session Replay", icon: Play },
  ];

  // Simulates custom analytical events in real-time
  const handleSimulateEvent = () => {
    setIsSimulating(true);
    
    // Select a random user
    const users = mockEngine.users;
    const randomUser = users[Math.floor(Math.random() * users.length)];
    
    // Random event sequence
    const simulationEvents = [
      { name: "pageview", props: { path: "/pricing", duration: 12 } },
      { name: "checkout_initiated", props: { cart_total: 99 } },
      { name: "purchase_completed", props: { amount: 99 } },
      { name: "error_triggered", props: { code: 500, type: "API Timeout" } }
    ];
    
    const randomEvent = simulationEvents[Math.floor(Math.random() * simulationEvents.length)];
    
    setTimeout(() => {
      mockEngine.addCustomEvent(randomEvent.name, randomUser.id, randomEvent.props);
      setIsSimulating(false);
      setSimulatedCount(prev => prev + 1);
    }, 800);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab key="overview" />;
      case "events":
        return <EventsTab key="events" />;
      case "users":
        return <UsersTab key="users" />;
      case "funnels":
        return <FunnelsTab key="funnels" />;
      case "retention":
        return <RetentionTab key="retention" />;
      case "cohorts":
        return <CohortsTab key="cohorts" />;
      case "segments":
        return <SegmentationTab key="segments" />;
      case "journeys":
        return <JourneysTab key="journeys" />;
      case "revenue":
        return <RevenueTab key="revenue" />;
      case "experiments":
        return <ExperimentsTab key="experiments" />;
      case "flags":
        return <FeatureFlagsTab key="flags" />;
      case "replay":
        return <SessionReplayTab key="replay" />;
      default:
        return <OverviewTab key="overview" />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-bg-deep text-text-bright overflow-hidden font-sans grid-bg">
      {/* Sidebar Navigation */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-col h-full bg-slate-950 border-r border-border-subtle z-30 select-none flex-shrink-0"
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border-subtle overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent-blue shadow-lg shadow-primary-glow flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent"
              >
                PAL Analytics
              </motion.span>
            )}
          </div>
          {!collapsed && (
            <button 
              onClick={() => setCollapsed(true)}
              className="p-1 rounded-md text-text-muted hover:text-white hover:bg-slate-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full px-3 py-2.5 rounded-lg transition-all group relative ${
                  isActive 
                    ? "bg-slate-900 text-primary font-semibold" 
                    : "text-text-muted hover:text-text-bright hover:bg-slate-900/60"
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? "text-primary" : "text-text-muted group-hover:text-text-bright"
                }`} />
                {!collapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-3 text-sm tracking-wide"
                  >
                    {item.label}
                  </motion.span>
                )}
                
                {/* Visual Active Indicator */}
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-6 rounded-r bg-primary"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse button for mini sidebar */}
        {collapsed && (
          <div className="flex justify-center py-4 border-t border-border-subtle">
            <button
              onClick={() => setCollapsed(false)}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-primary transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-border-subtle space-y-2 bg-slate-950/80">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>SDK Version</span>
              <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded text-primary">v1.2.4</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Sliders className="w-3.5 h-3.5" />
              <span>Project ID: <span className="font-mono text-[10px]">pal_acme_prod</span></span>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Top Header Navigation */}
        <header className="flex items-center justify-between h-16 px-6 bg-slate-950/90 border-b border-border-subtle z-20 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-border-subtle cursor-pointer hover:border-slate-700 transition-colors">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-text-bright">Acme Production</span>
            </div>
            
            {/* Live SDK status indicator */}
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
              Live & Tracking
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Simulating Engine Event Injection button */}
            <button
              onClick={handleSimulateEvent}
              disabled={isSimulating}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isSimulating 
                  ? "bg-slate-900 border-border-subtle text-text-muted cursor-not-allowed" 
                  : "bg-primary/5 hover:bg-primary/15 border-primary/20 text-primary hover:border-primary/45"
              }`}
            >
              <PlusCircle className={`w-4 h-4 ${isSimulating ? "animate-spin" : ""}`} />
              <span>{isSimulating ? "Injecting Event..." : "Simulate Live Action"}</span>
              {simulatedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-primary text-white font-mono text-[10px]">
                  +{simulatedCount}
                </span>
              )}
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-3 pl-3 border-l border-border-subtle">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-text-bright">Aryan Chandra</p>
                <p className="text-[10px] text-text-muted">Product Analyst</p>
              </div>
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=aryan"
                alt="Profile avatar"
                className="w-9 h-9 rounded-full bg-slate-900 border border-primary/20"
              />
            </div>
          </div>
        </header>

        {/* Viewport content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
