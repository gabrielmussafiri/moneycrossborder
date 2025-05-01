"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  CreditCard,
  DollarSign,
  FileText,
  Inbox,
  LayoutDashboard,
  RefreshCw,
  Settings,
  Users,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Create Transfer",
    href: "/transfers/create",
    icon: CreditCard,
  },
  {
    title: "Incoming Requests",
    href: "/transfers/incoming",
    icon: Inbox,
  },
  {
    title: "Top-Up Requests",
    href: "/top-up",
    icon: RefreshCw,
  },
  {
    title: "Debt Tracking",
    href: "/debts",
    icon: DollarSign,
  },
  {
    title: "Agent Management",
    href: "/admin/agents",
    icon: Users,
    adminOnly: true,
  },
  {
    title: "Transactions",
    href: "/admin/transactions",
    icon: FileText,
    // Remove the adminOnly: true property to make it accessible to all users
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    adminOnly: true,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

interface DashboardNavProps {
  className?: string
}

export function DashboardNav({ className }: DashboardNavProps) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string>("agent")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        const { role } = JSON.parse(savedUser)
        setUserRole(role)
      }
    }
  }, [])

  return (
    <nav className={cn("flex flex-col gap-2", className)}>
      {navItems
        .filter((item) => !item.adminOnly || userRole === "admin")
        .map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
    </nav>
  )
}
