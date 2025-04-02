"use client";

import React from "react";
import { cn } from "../../../lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn("h-16 px-6 flex items-center justify-between", className)}
    >
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold"></h2>
      </div>
    </header>
  );
}
