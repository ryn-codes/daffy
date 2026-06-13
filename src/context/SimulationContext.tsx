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
      // Set initial 10 Lakh rps scale
      setLiveRps(Math.floor(1005000 + Math.random() * 45000));
      
      tickInterval.current = setInterval(() => {
        // 1. Calculate 10 Lakh events/sec (1,000,000 eps)
        const currentRps = Math.floor(1012000 + (Math.random() - 0.5) * 58000);
        setLiveRps(currentRps);

        // 2. Increment offsets (100ms ticks = 1/10th of a second)
        const eventsThisTick = Math.floor(currentRps / 10);
        setTotalSimulatedEvents(prev => prev + eventsThisTick);

        // With 1,000,000 events/sec, conversions (~4.32%) yield ~43,200 checkouts/sec.
        // At ₹1,500 Average Order Value, GMV increases by ~₹6.48 Cr/sec => ~₹64.8 Lakh per 100ms tick
        const gmvInc = 5824000 + Math.floor(Math.random() * 850000);
        setGmvTodayOffset(prev => prev + gmvInc);

        // Orders: ~43,200 orders/sec => ~4,320 orders per tick
        const ordersInc = 4010 + Math.floor(Math.random() * 620);
        setOrdersTodayOffset(prev => prev + ordersInc);

        // Active buyers: ~18,000 buyers/sec => ~1,800 per tick
        const buyersInc = 1620 + Math.floor(Math.random() * 380);
        setBuyersTodayOffset(prev => prev + buyersInc);

        // MRR offset: ~$25/sec => ~$2.5 per tick
        setMrrOffset(prev => prev + (2.1 + Math.random() * 1.8));

        // Flag evaluations: ~820,000/sec => ~82,000 per tick
        const flagsInc = 79500 + Math.floor(Math.random() * 6500);
        setFlagEvaluationsOffset(prev => prev + flagsInc);

        // Experiment exposures: ~420,000/sec => ~42,000 per tick
        const expInc = 39800 + Math.floor(Math.random() * 4800);
        setExperimentExposedOffset(prev => prev + expInc);

        // 3. Performance metric drift
        setApiLatency(prev => {
          const delta = (Math.random() - 0.5) * 12;
          const newVal = Math.round(prev + delta);
          return Math.max(180, Math.min(260, newVal));
        });
        setCrashRate(prev => {
          const delta = (Math.random() - 0.5) * 0.008;
          const newVal = parseFloat((prev + delta).toFixed(3));
          return Math.max(0.04, Math.min(0.12, newVal));
        });
        setSearchLatency(prev => {
          const delta = (Math.random() - 0.5) * 10;
          const newVal = Math.round(prev + delta);
          return Math.max(150, Math.min(210, newVal));
        });
        setZeroResults(prev => {
          const delta = (Math.random() - 0.5) * 0.15;
          const newVal = parseFloat((prev + delta).toFixed(2));
          return Math.max(5.4, Math.min(7.0, newVal));
        });

        // 4. Ingest new console logs (throttled visually to look extremely fast but readable)
        const logAttempts = 2 + Math.floor(Math.random() * 3); // inject multiple events per tick
        setLiveLogs(prev => {
          let updated = [...prev];
          const users = mockEngine.users;
          
          for (let i = 0; i < logAttempts; i++) {
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

            const ms = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
            const logTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + "." + ms;
            
            updated.push({
              time: logTime,
              event: randEvent,
              device: user.device,
              detail
            });
          }
          
          return updated.slice(-60); // Keep last 60 logs
        });
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
