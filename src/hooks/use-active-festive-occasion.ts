"use client";

import { useState, useEffect } from "react";
import type { FestiveOccasion } from "@/constants/festive-occasions";
import { FESTIVE_OCCASIONS } from "@/constants/festive-occasions";
import { findActiveFestiveOccasion } from "@/utils/festive-occasions";

// Returns today's active festive occasion, or null.
export function useActiveFestiveOccasion(): FestiveOccasion | null {
  const [occasion, setOccasion] = useState<FestiveOccasion | null>(null);

  useEffect(() => {
    setOccasion(findActiveFestiveOccasion(FESTIVE_OCCASIONS, new Date()));
  }, []);

  return occasion;
}
