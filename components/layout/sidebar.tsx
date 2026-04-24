"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  QrCode,
  BarChart3,
  Settings,
  Star,
  Shield,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "ダッシュボード",
  },
  {
    href: "/qr-generator",
    icon: QrCode,
    label: "QRポスター生成",
  },
  {
    href: "/analytics",
    icon: BarChart3,
    label: "評価分析",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "店舗設定",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col bg-gray-900 text-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-bold text-sm text-white">hoshiko.me</div>
            <div className="text-xs text-gray-400">ホシコミ</div>
          </div>
        )}
      </div>

      {/* Store selector */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-gray-700">
          <button className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-gray-200 truncate">田中ラーメン新宿店</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Customer preview link */}
      {!collapsed && (
        <div className="px-3 pb-4 border-t border-gray-700 pt-3">
          <Link
            href="/review"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Star className="w-5 h-5 flex-shrink-0" />
            <span>評価フォーム（プレビュー）</span>
          </Link>
        </div>
      )}

      {/* Collapse button */}
      <div className="px-3 pb-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 text-gray-500 hover:text-gray-300 text-xs transition-colors"
        >
          {collapsed ? "›" : "‹ 折りたたむ"}
        </button>
      </div>
    </aside>
  );
}
