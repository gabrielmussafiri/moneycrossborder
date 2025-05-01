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
  LogOut,
  RefreshCw,
  Settings,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

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

interface SidebarProps {
  isMobile?: boolean
  onClose?: () => void
}

export function Sidebar({ isMobile, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
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

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
    router.push("/")
  }

  const handleNavigation = (href: string) => {
    if (isMobile && onClose) {
      onClose()
    }
    router.push(href)
  }

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-background",
        isMobile ? "w-full h-full pt-4" : "fixed inset-y-0 left-0 z-20 hidden w-64 pt-16 md:flex",
      )}
    >
      <div className="flex flex-1 flex-col overflow-y-auto py-4 px-3">
        <nav className="flex-1 space-y-1">
          {navItems
            .filter((item) => !item.adminOnly || userRole === "admin")
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={isMobile && onClose ? () => onClose() : undefined}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </Link>
            ))}
        </nav>
        <div className="pt-2 mt-auto border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Log out
          </Button>
        </div>
      </div>
    </aside>
  )
}
