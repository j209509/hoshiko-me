"use client";

import { useState } from "react";
import { stores } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Store,
  Link,
  Bell,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Settings,
  ExternalLink,
} from "lucide-react";

export default function SettingsPage() {
  const [activeStore, setActiveStore] = useState(stores[0].id);
  const [saved, setSaved] = useState(false);
  const [notifyLow, setNotifyLow] = useState(true);
  const [notifyDaily, setNotifyDaily] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(false);
  const [autoRedirect, setAutoRedirect] = useState(true);
  const [threshold, setThreshold] = useState("4");

  const store = stores.find((s) => s.id === activeStore)!;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">店舗設定</h1>
        <p className="text-sm text-gray-500 mt-1">店舗情報とシステム設定を管理します</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Store list */}
        <div className="xl:col-span-1">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Store className="w-4 h-4" />
                登録店舗
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3">
              {stores.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveStore(s.id)}
                  className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-colors ${
                    activeStore === s.id
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="font-medium truncate">{s.name}</div>
                  <div
                    className={`text-xs mt-0.5 ${
                      activeStore === s.id ? "text-indigo-200" : "text-gray-400"
                    }`}
                  >
                    {s.category} · {s.avgRating}★
                  </div>
                </button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 border-dashed border-gray-300 text-gray-500 gap-2"
              >
                <Plus className="w-3 h-3" />
                店舗を追加
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Settings tabs */}
        <div className="xl:col-span-3">
          <Tabs defaultValue="store">
            <TabsList className="bg-gray-100 p-1 rounded-xl mb-5">
              <TabsTrigger value="store" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Store className="w-3.5 h-3.5" />
                店舗情報
              </TabsTrigger>
              <TabsTrigger value="google" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Link className="w-3.5 h-3.5" />
                Google連携
              </TabsTrigger>
              <TabsTrigger value="notify" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Bell className="w-3.5 h-3.5" />
                通知設定
              </TabsTrigger>
              <TabsTrigger value="review" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Settings className="w-3.5 h-3.5" />
                評価設定
              </TabsTrigger>
            </TabsList>

            {/* Store info tab */}
            <TabsContent value="store">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">店舗名</Label>
                      <Input defaultValue={store.name} className="border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">業種カテゴリ</Label>
                      <Select defaultValue={store.category}>
                        <SelectTrigger className="border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["ラーメン", "カフェ", "居酒屋", "レストラン", "ファストフード", "その他"].map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-sm font-medium text-gray-700">住所</Label>
                      <Input defaultValue={store.address} className="border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">電話番号</Label>
                      <Input defaultValue={store.phone} className="border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">担当者メールアドレス</Label>
                      <Input defaultValue={store.notifyEmail} type="email" className="border-gray-200" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                      {saved ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          保存しました
                        </>
                      ) : (
                        "変更を保存"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-500 border-red-200 hover:bg-red-50 gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      店舗を削除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Google tab */}
            <TabsContent value="google">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${store.googleConnected ? "bg-green-100" : "bg-gray-200"}`}>
                      {store.googleConnected ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        Googleマイビジネス連携
                        {store.googleConnected ? (
                          <Badge className="bg-green-100 text-green-700 border-0 text-xs">接続済</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600 border-0 text-xs">未接続</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {store.googleConnected
                          ? "Googleビジネスプロフィールと連携中です。高評価のお客様を自動的にGoogleレビューへ誘導します。"
                          : "Googleビジネスプロフィールと連携することで、高評価のお客様を自動的にGoogleレビューへ誘導できます。"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">GoogleレビューURL</Label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue={store.googleUrl}
                        className="border-gray-200 flex-1"
                        placeholder="https://g.page/your-store"
                      />
                      <Button variant="outline" size="icon" className="border-gray-200 flex-shrink-0">
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400">
                      Googleビジネスプロフィールの「レビューを書く」リンクを貼り付けてください
                    </p>
                  </div>

                  {store.googleConnected ? (
                    <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 gap-2">
                      <Link className="w-4 h-4" />
                      連携を解除する
                    </Button>
                  ) : (
                    <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                      <Link className="w-4 h-4" />
                      Googleアカウントで連携する
                    </Button>
                  )}

                  <div className="pt-2 border-t border-gray-100">
                    <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
                      {saved ? "保存しました ✓" : "変更を保存"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification tab */}
            <TabsContent value="notify">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div>
                        <div className="text-sm font-medium text-gray-900">低評価アラート</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          設定した評価以下が来た際にメール通知
                        </div>
                      </div>
                      <Switch checked={notifyLow} onCheckedChange={setNotifyLow} />
                    </div>

                    {notifyLow && (
                      <div className="flex items-center gap-3 pl-4 py-2 bg-orange-50 rounded-lg">
                        <span className="text-sm text-gray-600">通知するしきい値：</span>
                        <Select value={threshold} onValueChange={(v) => setThreshold(v ?? "4")}>
                          <SelectTrigger className="w-28 h-8 text-sm border-gray-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["1", "2", "3"].map((v) => (
                              <SelectItem key={v} value={v}>★{v}以下</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div>
                        <div className="text-sm font-medium text-gray-900">デイリーレポート</div>
                        <div className="text-xs text-gray-500 mt-0.5">毎日9時に前日の評価サマリーを送信</div>
                      </div>
                      <Switch checked={notifyDaily} onCheckedChange={setNotifyDaily} />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div>
                        <div className="text-sm font-medium text-gray-900">ウィークリーレポート</div>
                        <div className="text-xs text-gray-500 mt-0.5">毎週月曜日に週次集計レポートを送信</div>
                      </div>
                      <Switch checked={notifyWeekly} onCheckedChange={setNotifyWeekly} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">通知先メールアドレス</Label>
                    <Input defaultValue={store.notifyEmail} type="email" className="border-gray-200" />
                  </div>

                  <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
                    {saved ? "保存しました ✓" : "変更を保存"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Review settings tab */}
            <TabsContent value="review">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Google自動誘導</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        4★以上の評価でGoogleレビュー画面へ自動誘導する
                      </div>
                    </div>
                    <Switch checked={autoRedirect} onCheckedChange={setAutoRedirect} />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Google誘導のしきい値
                    </Label>
                    <Select defaultValue="4">
                      <SelectTrigger className="border-gray-200 w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["3以上でGoogle誘導", "4以上でGoogle誘導", "5のみGoogle誘導"].map((v) => (
                          <SelectItem key={v} value={v.charAt(0)}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-400">
                      推奨：4以上（高評価のみをGoogleレビューへ誘導）
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      低評価フォームのメッセージ
                    </Label>
                    <Input
                      defaultValue="貴重なご意見をありがとうございます。改善のためにご意見をお聞かせください。"
                      className="border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Google誘導ページのメッセージ
                    </Label>
                    <Input
                      defaultValue="ご満足いただけて嬉しいです！Googleレビューに感想を残していただけると励みになります。"
                      className="border-gray-200"
                    />
                  </div>

                  <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
                    {saved ? "保存しました ✓" : "変更を保存"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
