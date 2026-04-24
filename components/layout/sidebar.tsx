"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard, QrCode, BarChart3, Settings, Star, Shield,
  ChevronDown, LogOut, Plus, Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useStores } from "@/components/providers/store-provider";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "ダッシュボード" },
  { href: "/qr-generator", icon: QrCode, label: "QRポスター生成" },
  { href: "/analytics", icon: BarChart3, label: "評価分析" },
  { href: "/settings", icon: Settings, label: "店舗設定" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { stores, selectedStore, setSelectedStoreId, loading } = useStores();
  const [collapsed, setCollapsed] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);

  const handleSignOut = () => signOut({ callbackUrl: "/" });

  return (
    <aside
      className={cn(
        "flex flex-col bg-gray-900 text-white transition-all duration-300 flex-shrink-0",
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
        <div className="px-3 py-3 border-b border-gray-700 relative">
          <button
            onClick={() => setStoreOpen(!storeOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
              <span className="text-gray-200 truncate">
                {loading ? "読み込み中..." : (selectedStore?.name ?? "店舗を選択")}
              </span>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-gray-400 flex-shrink-0 transition-transform", storeOpen && "rotate-180")} />
          </button>

          {storeOpen && stores.length > 0 && (
            <div className="absolute left-3 right-3 top-full mt-1 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-50">
              {stores.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedStoreId(s.id); setStoreOpen(false); }}
                  className={cn(
                    "w-full text-left px-3 py-2.5 text-sm transition-colors first:rounded-t-lg",
                    s.id === selectedStore?.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  )}
                >
                  <div className="font-medium truncate">{s.name}</div>
                  <div className="text-xs opacity-70 mt-0.5">{s.category ?? "未設定"}</div>
                </button>
              ))}
              <button
                onClick={() => { router.push("/settings"); setStoreOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 hover:bg-gray-700 transition-colors rounded-b-lg border-t border-gray-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>店舗を追加</span>
              </button>
            </div>
          )}
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
              onClick={() => setStoreOpen(false)}
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
        <div className="px-3 border-t border-gray-700 pt-3">
          <Link
            href="/review"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Star className="w-5 h-5 flex-shrink-0" />
            <span>評価フォーム（プレビュー）</span>
          </Link>
        </div>
      )}

      {/* User info + logout */}
      <div className={cn("px-3 py-4 border-t border-gray-700", collapsed ? "flex justify-center" : "")}>
        {!collapsed ? (
          <div className="flex items-center gap-3">
            {session?.user?.image ? (
              <img src={session.user.image} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                <Store className="w-4 h-4 text-gray-300" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-200 truncate">{session?.user?.name ?? "オーナー"}</div>
              <div className="text-xs text-gray-500 truncate">{session?.user?.email}</div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex-shrink-0 p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-colors"
              title="ログアウト"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignOut}
            className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Collapse button */}
      <div className="px-3 pb-4">
        <button
          onClick={() => { setCollapsed(!collapsed); setStoreOpen(false); }}
          className="w-full flex items-center justify-center py-2 text-gray-500 hover:text-gray-300 text-xs transition-colors"
        >
          {collapsed ? "›" : "‹ 折りたたむ"}
        </button>
      </div>
    </aside>
  );
}
