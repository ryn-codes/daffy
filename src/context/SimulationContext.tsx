"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { mockEngine } from "@/lib/mockEngine";

export interface LiveLog {
  time: string;
  event: string;
  device: string;
  detail: string;
}

interface SimulationContextType {
  isSimulating: boolean;
  toggleSimulation: () => void;
  liveRps: number;
  totalSimulatedEvents: number;
  gmvTodayOffset: number;
  ordersTodayOffset: number;
  buyersTodayOffset: number;
  apiLatency: number;
  crashRate: number;
  searchLatency: number;
  zeroResults: number;
  mrrOffset: number;
  flagEvaluationsOffset: number;
  experimentExposedOffset: number;
  liveLogs: LiveLog[];
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const EVENT_NAMES = [
  "search_started",
  "search_completed",
  "product_viewed",
  "product_image_clicked",
  "cart_added",
  "checkout_started",
  "payment_attempted",
  "payment_success",
  "coupon_applied",
  "wishlist_added"
];

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [totalSimulatedEvents, setTotalSimulatedEvents] = useState(0);
  const [liveRps, setLiveRps] = useState(0);
  const [gmvTodayOffset, setGmvTodayOffset] = useState(0);
  const [ordersTodayOffset, setOrdersTodayOffset] = useState(0);
  const [buyersTodayOffset, setBuyersTodayOffset] = useState(0);
  const [mrrOffset, setMrrOffset] = useState(0);
  const [flagEvaluationsOffset, setFlagEvaluationsOffset] = useState(0);
  const [experimentExposedOffset, setExperimentExposedOffset] = useState(0);

  // Performance stats (bouncing in real-time)
  const [apiLatency, setApiLatency] = useState(220);
  const [crashRate, setCrashRate] = useState(0.08);
  const [searchLatency, setSearchLatency] = useState(180);
  const [zeroResults, setZeroResults] = useState(6.2);

  // Rolling live stream of log console
  const [liveLogs, setLiveLogs] = useState<LiveLog[]>([
    { time: "03:30:01", event: "app_opened", device: "Android", detail: "version v12.4.1, user: Rohan Verma" },
    { time: "03:30:02", event: "homepage_viewed", device: "iOS", detail: "banner: festival_sale" },
    { time: "03:30:04", event: "search_started", device: "Desktop", detail: "query: iPhone 15" }
  ]);

  const tickInterval = useRef<NodeJS.Timeout | null>(null);

  const toggleSimulation = () => {
    setIsSimulating(prev => !prev);
  };

  useEffect(() => {
    if (isSimulating) {
      // Set active status rates
      setLiveRps(Math.floor(102000 + Math.random() * 8000));
      
      tickInterval.current = setInterval(() => {
        // 1. Calculate random rates
        const currentRps = Math.floor(104000 + (Math.random() - 0.5) * 6000);
        setLiveRps(currentRps);

        // 2. Increment offsets (100ms ticks = 1/10th of a second)
        const eventsThisTick = Math.floor(currentRps / 10);
        setTotalSimulatedEvents(prev => prev + eventsThisTick);

        // GMV ticks: ~₹2,200/sec on average => ~₹220/tick
        const gmvInc = 180 + Math.floor(Math.random() * 120);
        setGmvTodayOffset(prev => prev + gmvInc);

        // Orders: ~2.5 orders/sec => ~0.25/tick
        const orderRand = Math.random();
        if (orderRand < 0.25) {
          setOrdersTodayOffset(prev => prev + 1);
        }

        // Active buyers: ~1.8 buyers/sec
        if (Math.random() < 0.18) {
          setBuyersTodayOffset(prev => prev + 1);
        }

        // MRR offset: ~$0.55/sec
        setMrrOffset(prev => prev + (0.05 + Math.random() * 0.05));

        // Flag evaluations: ~8,200 evals/sec => ~820/tick
        setFlagEvaluationsOffset(prev => prev + 750 + Math.floor(Math.random() * 150));

        // Experiment exposures: ~4,200/sec => ~420/tick
        setExperimentExposedOffset(prev => prev + 380 + Math.floor(Math.random() * 80));

        // 3. Performance metric drift
        setApiLatency(prev => {
          const delta = (Math.random() - 0.5) * 8;
          const newVal = Math.round(prev + delta);
          return Math.max(180, Math.min(260, newVal));
        });
        setCrashRate(prev => {
          const delta = (Math.random() - 0.5) * 0.005;
          const newVal = parseFloat((prev + delta).toFixed(3));
          return Math.max(0.04, Math.min(0.12, newVal));
        });
        setSearchLatency(prev => {
          const delta = (Math.random() - 0.5) * 6;
          const newVal = Math.round(prev + delta);
          return Math.max(150, Math.min(210, newVal));
        });
        setZeroResults(prev => {
          const delta = (Math.random() - 0.5) * 0.1;
          const newVal = parseFloat((prev + delta).toFixed(2));
          return Math.max(5.4, Math.min(7.0, newVal));
        });

        // 4. Ingest new console logs (throttled visually to 1-2 new log per 100ms so it looks extremely fast but readable)
        const runLog = Math.random() < 0.4;
        if (runLog) {
          const users = mockEngine.users;
          const user = users[Math.floor(Math.random() * users.length)];
          const randEvent = EVENT_NAMES[Math.floor(Math.random() * EVENT_NAMES.length)];
          
          let detail = `user: ${user.name} (${user.id})`;
          if (randEvent === "product_viewed") {
            const products = ["iPhone 15 (Blue)", "Mi Smart Band 8", "Nike Air Max Shoes", "Boat Rockerz"];
            detail = `SKU: ${products[Math.floor(Math.random() * products.length)]} - Viewed`;
          } else if (randEvent === "cart_added") {
            detail = `Item added to shopping cart - Basket value ₹${1500 + Math.floor(Math.random() * 5000)}`;
          } else if (randEvent === "payment_success") {
            detail = `UPI checkout success - Transacted ₹${2000 + Math.floor(Math.random() * 8000)}`;
          } else if (randEvent === "coupon_applied") {
            const coupons = ["SAVE20", "FESTIVAL30", "FREESHIP", "WELCOME10"];
            detail = `Applied coupon code ${coupons[Math.floor(Math.random() * coupons.length)]}`;
          }

          const logTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + "." + String(Math.floor(Math.random() * 10));
          
          const newLog: LiveLog = {
            time: logTime,
            event: randEvent,
            device: user.device,
            detail
          };

          setLiveLogs(prev => [...prev.slice(-49), newLog]);
        }
      }, 100);
    } else {
      setLiveRps(0);
      if (tickInterval.current) {
        clearInterval(tickInterval.current);
      }
    }

    return () => {
      if (tickInterval.current) {
        clearInterval(tickInterval.current);
      }
    };
  }, [isSimulating]);

  return (
    <SimulationContext.Provider
      value={{
        isSimulating,
        toggleSimulation,
        liveRps,
        totalSimulatedEvents,
        gmvTodayOffset,
        ordersTodayOffset,
        buyersTodayOffset,
        apiLatency,
        crashRate,
        searchLatency,
        zeroResults,
        mrrOffset,
        flagEvaluationsOffset,
        experimentExposedOffset,
        liveLogs
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
}
