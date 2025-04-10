import * as React from "react";
import { cn } from "../../../lib/utils";

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-64 flex-col bg-gray-900/95 backdrop-blur-xl border-r-2 border-blue-800/30",
      className
    )}
    {...props}
  />
));
Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1 overflow-auto", className)} {...props} />
));
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
SidebarFooter.displayName = "SidebarFooter";

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1 p-2", className)} {...props} />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

interface SidebarMenuButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  tooltip?: string;
  asChild?: boolean;
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, isActive, tooltip, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
      isActive
        ? "bg-blue-900 text-cyan-400 shadow-lg shadow-blue-900/30 border border-blue-700/50"
        : "text-gray-300 hover:bg-gray-800 hover:text-cyan-400",
      className
    )}
    title={tooltip}
    {...props}
  >
    <div className="flex items-center gap-3">{props.children}</div>
  </button>
));
SidebarMenuButton.displayName = "SidebarMenuButton";

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
};
