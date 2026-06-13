"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Clock, 
  User, 
  Sparkles, 
  Monitor, 
  ChevronRight, 
  CornerDownRight, 
  MousePointer, 
  AlertCircle 
} from "lucide-react";
import { mockEngine, ReplaySession } from "@/lib/mockEngine";

export default function SessionReplayTab() {
  const [sessions, setSessions] = useState<ReplaySession[]>([...mockEngine.replays]);
  const [activeSession, setActiveSession] = useState<ReplaySession | null>(sessions[0]);
  
  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // in milliseconds
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 2x, 4x
  const [currentEventIdx, setCurrentEventIdx] = useState(0);

  // Simulated browser states
  const [cursorPos, setCursorPos] = useState({ x: 150, y: 150 });
  const [clickRipple, setClickRipple] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const [typedValue, setTypedValue] = useState("");
  const [activePath, setActivePath] = useState("/home");
  const [recentLog, setRecentLog] = useState("Session initialized.");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle Session selection
  const handleSelectSession = (session: ReplaySession) => {
    setActiveSession(session);
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentEventIdx(0);
    setCursorPos({ x: 150, y: 150 });
    setTypedValue("");
    setActivePath("/home");
    setRecentLog("Session initialized.");
  };

  // Playback Loop Timer
  useEffect(() => {
    if (isPlaying && activeSession) {
      const interval = 100 / playbackSpeed; // Tick every 100ms adjusted for speed
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          // Parse duration string to seconds
          const [m, s] = activeSession.duration.split(":").map(Number);
          const totalMs = (m * 60 + s) * 1000;
          
          if (prev >= totalMs) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return totalMs;
          }
          return prev + 100 * playbackSpeed;
        });
      }, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeSession, playbackSpeed]);

  // Synchronize simulated cursor, actions, and paths based on playback time
  useEffect(() => {
    if (!activeSession) return;
    
    // Find the next event that should fire
    const event = activeSession.events[currentEventIdx];
    if (event && currentTime >= event.timestamp) {
      setRecentLog(`Event triggered: ${event.type} on ${event.target}`);
      
      // Update cursor pos if provided
      if (event.x !== undefined && event.y !== undefined) {
        setCursorPos({ x: event.x, y: event.y });
      }

      // Handle custom event types
      if (event.type === "pageview") {
        setActivePath(event.target);
      } else if (event.type === "click") {
        setClickRipple({ x: event.x || 150, y: event.y || 150, active: true });
        // Auto disable ripple after animation
        setTimeout(() => setClickRipple(prev => ({ ...prev, active: false })), 500);
      } else if (event.type === "input" && event.value) {
        setTypedValue(event.value);
      } else if (event.type === "error") {
        setRecentLog(`Error flagged: ${event.target}`);
      }

      setCurrentEventIdx(prev => prev + 1);
    }
  }, [currentTime, activeSession, currentEventIdx]);

  const handleRestart = () => {
    setCurrentTime(0);
    setCurrentEventIdx(0);
    setCursorPos({ x: 150, y: 150 });
    setTypedValue("");
    setActivePath("/home");
    setRecentLog("Playback restarted.");
    setIsPlaying(true);
  };

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const secs = s % 60;
    return `${m}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[500px]">
      {/* Left Column: Recorded Sessions logs */}
      <div className="lg:col-span-1 glass-panel rounded-2xl p-5 flex flex-col gap-4 overflow-hidden">
        <div>
          <h2 className="text-md font-bold text-text-bright flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" />
            Session Replay Logs
          </h2>
          <p className="text-xs text-text-muted">Explore pixel-perfect cursor movement session replays.</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-[460px]">
          {sessions.map((session) => {
            const isActive = activeSession?.id === session.id;
            return (
              <div
                key={session.id}
                onClick={() => handleSelectSession(session)}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 select-none ${
                  isActive 
                    ? "bg-slate-900 border-primary" 
                    : "bg-slate-900/40 border-border-subtle hover:border-slate-800"
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <h3 className="font-bold text-text-bright truncate max-w-[120px]">{session.userName}</h3>
                  <span className="font-mono text-text-muted text-[10px]">{session.duration}</span>
                </div>
                
                <div className="flex justify-between items-center text-[10px] text-text-muted">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="font-bold text-primary font-mono">{session.eventCount} actions</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Columns: Animated Replay Browser window */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {activeSession ? (
          <>
            {/* Player Controls Header */}
            <div className="glass-panel p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between z-10">
              <div className="flex items-center gap-3">
                {/* Play/Pause toggle */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2.5 rounded-full bg-primary hover:bg-primary-hover text-white transition-all shadow-md"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={handleRestart}
                  className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-border-subtle hover:text-white transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>

                <div className="text-xs font-semibold text-text-muted">
                  <span className="text-text-bright font-mono">{formatTime(currentTime)}</span>
                  <span> / </span>
                  <span className="font-mono">{activeSession.duration}</span>
                </div>
              </div>

              {/* Speed multiplier & Meta */}
              <div className="flex items-center gap-3">
                <div className="flex bg-slate-950 p-1 rounded-lg border border-border-subtle">
                  {[1, 2, 4].map(speed => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded ${
                        playbackSpeed === speed 
                          ? "bg-primary text-white" 
                          : "text-text-muted hover:text-text-bright"
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-border-subtle rounded-lg text-xs text-text-muted font-semibold">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span>{activeSession.userName}</span>
                </div>
              </div>
            </div>

            {/* Simulated browser window viewport */}
            <div className="glass-panel rounded-2xl overflow-hidden flex-1 flex flex-col min-h-[350px]">
              {/* Address bar */}
              <div className="h-10 bg-slate-950 px-4 flex items-center gap-3 border-b border-border-subtle flex-shrink-0">
                <div className="flex gap-1.5 flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                
                {/* URL Path */}
                <div className="flex-1 bg-slate-900/60 border border-border-subtle rounded-md px-3.5 py-0.5 text-xs text-text-muted font-mono select-none flex items-center gap-1.5 truncate">
                  <Monitor className="w-3.5 h-3.5 opacity-60" />
                  <span>https://pal.acme.co<span className="text-text-bright font-bold">{activePath}</span></span>
                </div>
              </div>

              {/* Playback Canvas Area */}
              <div className="flex-1 bg-slate-900/10 relative p-6 flex items-center justify-center overflow-hidden min-h-[200px]">
                {/* Mock Page Content layout based on active path */}
                <div className="w-full max-w-sm glass-panel p-6 rounded-2xl space-y-4 select-none pointer-events-none relative">
                  
                  {activePath === "/home" ? (
                    <>
                      <div className="space-y-1">
                        <div className="h-4 w-1/3 bg-slate-800 rounded animate-pulse" />
                        <div className="h-8 w-2/3 bg-primary/20 rounded border border-primary/20" />
                      </div>
                      <div className="h-16 w-full bg-slate-900 rounded border border-border-subtle" />
                      <div className="flex justify-between items-center pt-2">
                        <div className="h-9 w-24 bg-primary text-white text-xs font-bold rounded-lg flex items-center justify-center">Get Started</div>
                        <div className="h-3 w-16 bg-slate-800 rounded" />
                      </div>
                    </>
                  ) : activePath === "/pricing" ? (
                    <>
                      <div className="text-center space-y-1">
                        <div className="h-4 w-1/4 bg-slate-800 rounded mx-auto" />
                        <div className="h-6 w-1/2 bg-slate-800 rounded mx-auto" />
                      </div>
                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="p-3 bg-slate-900 border border-border-subtle rounded-xl text-center space-y-1.5">
                          <div className="h-3 w-12 bg-slate-800 rounded mx-auto" />
                          <div className="h-6 w-16 bg-primary/20 rounded mx-auto" />
                        </div>
                        <div className="p-3 bg-slate-900 border border-border-subtle rounded-xl text-center space-y-1.5">
                          <div className="h-3 w-12 bg-slate-800 rounded mx-auto" />
                          <div className="h-6 w-16 bg-accent-blue/20 rounded mx-auto" />
                        </div>
                      </div>
                    </>
                  ) : activePath === "/signup" ? (
                    <>
                      <div className="space-y-1">
                        <div className="h-4 w-1/4 bg-slate-800 rounded" />
                        <div className="h-3 w-1/2 bg-slate-800 rounded" />
                      </div>
                      <div className="space-y-3.5">
                        <div className="space-y-1.5">
                          <div className="h-3 w-16 bg-slate-800 rounded" />
                          <div className="h-8 w-full bg-slate-900 border border-border-subtle rounded-lg flex items-center px-3.5 text-xs text-text-bright font-mono">
                            {typedValue || "email@example.com"}
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-3 w-16 bg-slate-800 rounded" />
                          <div className="h-8 w-full bg-slate-900 border border-border-subtle rounded-lg flex items-center px-3.5 text-xs text-text-muted">
                            ••••••••
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                        <div className="h-4 w-20 bg-slate-800 rounded" />
                        <div className="w-5 h-5 rounded-full bg-primary" />
                      </div>
                      <div className="h-24 w-full bg-slate-950/60 border border-border-subtle rounded-xl flex items-center justify-center">
                        <span className="text-xs text-primary font-bold">Workspace Loaded</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Animated Simulated mouse pointer */}
                <div 
                  className="absolute pointer-events-none z-30 transition-all duration-300 ease-out"
                  style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
                >
                  <MousePointer className="w-5 h-5 text-white fill-white shadow-lg drop-shadow" />
                </div>

                {/* Simulated Click Ripple feedback */}
                {clickRipple.active && (
                  <div
                    className="absolute w-8 h-8 rounded-full border border-primary bg-primary/20 pointer-events-none z-20 animate-ping"
                    style={{ 
                      left: `${clickRipple.x - 16}px`, 
                      top: `${clickRipple.y - 16}px` 
                    }}
                  />
                )}
              </div>

              {/* Status bar log */}
              <div className="h-10 bg-slate-950 border-t border-border-subtle px-4 flex items-center gap-2 select-none text-[10px] font-mono text-text-muted">
                <CornerDownRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="truncate">{recentLog}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="glass-panel p-12 rounded-2xl text-center text-text-muted flex-1 flex flex-col justify-center items-center gap-2">
            <Play className="w-12 h-12 text-slate-800 animate-pulse" />
            <p className="text-sm font-semibold">Select a session recording to start playing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
