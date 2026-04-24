"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Store, Link, Bell, CheckCircle2, AlertCircle, Plus, Trash2, Settings, ExternalLink, Loader2,
} from "lucide-react";
import { useStores } from "@/components/providers/store-provider";

const categories = ["ラーメン", "カフェ", "居酒屋", "レストラン", "ファストフード", "バー", "焼肉", "寿司", "その他"];

interface StoreForm {
  name: string;
  category: string;
  address: string;
  phone: string;
  notifyEmail: string;
  googleReviewUrl: string;
  googleMapsUrl: string;
  googleConnected: boolean;
  notifyThreshold: number;
  googleRedirectThreshold: number;
}

export default function SettingsPage() {
  const { stores, selectedStore, setSelectedStoreId, loading, refetch } = useStores();
  const [form, setForm] = useState<StoreForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);

  // selectedStoreが変わったらフォームをリセット
  useEffect(() => {
    if (selectedStore) {
      setForm({
        name: selectedStore.name,
        category: selectedStore.category ?? "",
        address: selectedStore.address ?? "",
        phone: selectedStore.phone ?? "",
        notifyEmail: selectedStore.notifyEmail ?? "",
        googleReviewUrl: selectedStore.googleReviewUrl ?? "",
        googleMapsUrl: selectedStore.googleMapsUrl ?? "",
        googleConnected: selectedStore.googleConnected,
        notifyThreshold: selectedStore.notifyThreshold,
        googleRedirectThreshold: selectedStore.googleRedirectThreshold,
      });
    }
  }, [selectedStore?.id]);

  const handleSave = async () => {
    if (!selectedStore || !form) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/stores/${selectedStore.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          googleConnected: !!(form.googleReviewUrl),
        }),
      });
      if (res.ok) {
        setSaved(true);
        refetch();
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStore || !confirm(`「${selectedStore.name}」を削除しますか？この操作は取り消せません。`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/stores/${selectedStore.id}`, { method: "DELETE" });
      if (res.ok) {
        refetch();
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleCreate = async () => {
    if (!newStoreName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newStoreName.trim(), category: "その他" }),
      });
      if (res.ok) {
        const store = await res.json();
        refetch();
        setSelectedStoreId(store.id);
        setNewStoreName("");
        setShowNewForm(false);
      }
    } finally {
      setCreating(false);
    }
  };

  const update = (key: keyof StoreForm, value: string | boolean | number) => {
    setForm((f) => f ? { ...f, [key]: value } : f);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

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
                <Store className="w-4 h-4" />登録店舗
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3">
              {stores.map((s) => (
                <button key={s.id} onClick={() => setSelectedStoreId(s.id)}
                  className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-colors ${
                    selectedStore?.id === s.id ? "bg-indigo-600 text-white" : "hover:bg-gray-100 text-gray-700"
                  }`}>
                  <div className="font-medium truncate">{s.name}</div>
                  <div className={`text-xs mt-0.5 ${selectedStore?.id === s.id ? "text-indigo-200" : "text-gray-400"}`}>
                    {s.category ?? "未設定"}
                  </div>
                </button>
              ))}

              {showNewForm ? (
                <div className="p-2 space-y-2">
                  <Input
                    placeholder="店舗名を入力"
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    className="text-sm h-8"
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <Button size="sm" onClick={handleCreate} disabled={creating || !newStoreName.trim()} className="flex-1 h-7 text-xs bg-indigo-600 hover:bg-indigo-700">
                      {creating ? <Loader2 className="w-3 h-3 animate-spin" /> : "追加"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setShowNewForm(false); setNewStoreName(""); }} className="flex-1 h-7 text-xs">
                      キャンセル
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setShowNewForm(true)}
                  className="w-full mt-2 border-dashed border-gray-300 text-gray-500 gap-2">
                  <Plus className="w-3 h-3" />店舗を追加
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Settings tabs */}
        <div className="xl:col-span-3">
          {!selectedStore || !form ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-400 gap-3">
              <Store className="w-12 h-12" />
              <p>店舗を選択するか、新しく追加してください</p>
            </div>
          ) : (
            <Tabs defaultValue="store">
              <TabsList className="bg-gray-100 p-1 rounded-xl mb-5">
                <TabsTrigger value="store" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Store className="w-3.5 h-3.5" />店舗情報
                </TabsTrigger>
                <TabsTrigger value="google" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Link className="w-3.5 h-3.5" />Google連携
                </TabsTrigger>
                <TabsTrigger value="notify" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Bell className="w-3.5 h-3.5" />通知設定
                </TabsTrigger>
                <TabsTrigger value="review" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Settings className="w-3.5 h-3.5" />評価設定
                </TabsTrigger>
              </TabsList>

              {/* Store info */}
              <TabsContent value="store">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>店舗名</Label>
                        <Input value={form.name} onChange={(e) => update("name", e.target.value)} className="border-gray-200" />
                      </div>
                      <div className="space-y-2">
                        <Label>業種カテゴリ</Label>
                        <Select value={form.category} onValueChange={(v) => v && update("category", v)}>
                          <SelectTrigger className="border-gray-200"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => <SelectItem key={c} value={c} label={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label>住所</Label>
                        <Input value={form.address} onChange={(e) => update("address", e.target.value)} className="border-gray-200" />
                      </div>
                      <div className="space-y-2">
                        <Label>電話番号</Label>
                        <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="border-gray-200" />
                      </div>
                      <div className="space-y-2">
                        <Label>担当者メールアドレス</Label>
                        <Input value={form.notifyEmail} type="email" onChange={(e) => update("notifyEmail", e.target.value)} className="border-gray-200" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <><CheckCircle2 className="w-4 h-4" />保存しました</> : "変更を保存"}
                      </Button>
                      <Button variant="outline" onClick={handleDelete} disabled={deleting}
                        className="text-red-500 border-red-200 hover:bg-red-50 gap-2">
                        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" />店舗を削除</>}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Google */}
              <TabsContent value="google">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${form.googleReviewUrl ? "bg-green-100" : "bg-gray-200"}`}>
                        {form.googleReviewUrl ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-gray-400" />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          Googleマイビジネス連携
                          <Badge className={`border-0 text-xs ${form.googleReviewUrl ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                            {form.googleReviewUrl ? "接続済" : "未接続"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {form.googleReviewUrl
                            ? "GoogleレビューURLが設定されています。高評価のお客様をGoogleレビューへ自動誘導します。"
                            : "GoogleレビューURLを設定すると、高評価のお客様を自動的にGoogleレビューへ誘導できます。"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>GoogleレビューURL</Label>
                      <div className="flex gap-2">
                        <Input value={form.googleReviewUrl} onChange={(e) => update("googleReviewUrl", e.target.value)}
                          className="border-gray-200 flex-1" placeholder="https://g.page/r/.../review" />
                        {form.googleReviewUrl && (
                          <Button variant="outline" size="icon" className="border-gray-200 flex-shrink-0"
                            onClick={() => window.open(form.googleReviewUrl, "_blank")}>
                            <ExternalLink className="w-4 h-4 text-gray-500" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">Googleビジネスプロフィールの「レビューを書く」リンクを貼り付けてください</p>
                    </div>
                    <div className="space-y-2">
                      <Label>GoogleマップURL</Label>
                      <Input value={form.googleMapsUrl} onChange={(e) => update("googleMapsUrl", e.target.value)}
                        className="border-gray-200" placeholder="https://maps.google.com/?q=..." />
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? "保存しました ✓" : "変更を保存"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notify */}
              <TabsContent value="notify">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6 space-y-5">
                    <div className="space-y-2">
                      <Label>通知先メールアドレス</Label>
                      <Input value={form.notifyEmail} type="email" onChange={(e) => update("notifyEmail", e.target.value)} className="border-gray-200" />
                      <p className="text-xs text-gray-400">低評価が来たときにこのアドレスへ通知します</p>
                    </div>
                    <div className="space-y-2">
                      <Label>通知するしきい値（この星以下で通知）</Label>
                      <Select value={String(form.notifyThreshold)} onValueChange={(v) => update("notifyThreshold", Number(v))}>
                        <SelectTrigger className="border-gray-200 w-40">
                          <SelectValue>★{form.notifyThreshold}以下</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3].map((v) => <SelectItem key={v} value={String(v)} label={`★${v}以下`}>★{v}以下</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? "保存しました ✓" : "変更を保存"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Review settings */}
              <TabsContent value="review">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6 space-y-5">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Google自動誘導</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          設定した星以上の評価でGoogleレビュー画面へ自動誘導する
                        </div>
                      </div>
                      <Switch
                        checked={!!form.googleReviewUrl}
                        onCheckedChange={(v) => {
                          if (!v) update("googleReviewUrl", "");
                        }}
                        disabled={!form.googleReviewUrl}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Google誘導するしきい値（この星以上でGoogle誘導）</Label>
                      <Select
                        value={String(form.googleRedirectThreshold)}
                        onValueChange={(v) => v && update("googleRedirectThreshold", Number(v))}
                      >
                        <SelectTrigger className="border-gray-200 w-48">
                          <SelectValue>★{form.googleRedirectThreshold}以上でGoogle誘導</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {[3, 4, 5].map((v) => (
                            <SelectItem key={v} value={String(v)} label={`★${v}以上`}>
                              ★{v}以上（{v}〜5★ → Google）
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-400">
                        例：★4以上に設定すると、4・5★のお客様はGoogleレビューへ、1〜3★は店内フォームで収集します
                      </p>
                    </div>

                    {!form.googleReviewUrl && (
                      <p className="text-sm text-amber-600 bg-amber-50 rounded-lg p-3">
                        Google誘導を有効にするには「Google連携」タブでGoogleレビューURLを設定してください。
                      </p>
                    )}

                    <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? "保存しました ✓" : "変更を保存"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
