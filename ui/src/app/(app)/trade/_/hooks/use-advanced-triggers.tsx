import { useEffect, useMemo, useState } from "react";

interface AdvancedTriggerData {
  id: string;
  baseToken: string;
  quoteToken: string;
  symbol: string;
  name: string;
  condition: string;
  action: {
    type: "buy" | "sell" | "close" | "alert";
    size: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  status: "active" | "triggered" | "executed" | "cancelled";
  isComplex: boolean;
  createdAt: string;
  triggeredAt?: string;
}


export const useAdvancedTriggers = () => {
  const columns = useMemo(
    () => [
      { label: "Asset" },
      { label: "Trigger Name" },
      { label: "Condition" },
      { label: "Action" },
      { label: "Price Range" },
      { label: "Status" },
      { label: "Created" },
      { label: "Triggered" },
    ],
    []
  );

  const [triggers, setTriggers] = useState<AdvancedTriggerData[]>([]);

  const cancelTrigger = (triggerId: string) => {
    setTriggers(prev => 
      prev.map(trigger => 
        trigger.id === triggerId 
          ? { ...trigger, status: "cancelled" as const }
          : trigger
      )
    );
  };

  const editTrigger = (triggerId: string) => {
    // Placeholder for edit functionality
    console.log("Edit trigger:", triggerId);
  };

  return {
    columns,
    triggers,
    cancelTrigger,
    editTrigger,
  };
};