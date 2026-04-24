import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* Nav */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <div className="text-xl font-bold tracking-tight">
          hoshiko<span className="text-indigo-500">.me</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">機能</a>
          <a href="#how" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">使い方</a>
          <a href="#pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">料金</a>
          <Link
            href="/dashboard"
            className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            管理画面へ
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 pt-24 pb-20 text-center">
        <div className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-6">
          飲食店・小売店向けレビュー管理 SaaS
        </div>
        <h1 className="text-5xl font-bold leading-tight tracking-tight text-gray-900 mb-6">
          悪評がGoogleに届く前に、<br />あなたの手元へ。
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          QRコードをスキャンするだけ。高評価のお客様はそのままGoogleレビューへ、低評価のお客様は店舗内フォームで意見収集。Googleの評価を守りながら、改善の声も逃さない。
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="bg-indigo-600 text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            デモを見る
          </Link>
          <Link
            href="/review"
            className="border border-gray-200 text-gray-700 px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            顧客フォームを体験する
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-5">クレジットカード不要 · 14日間無料トライアル</p>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-4xl mx-auto px-8 grid grid-cols-3 gap-8 text-center">
          {[
            { value: "2.4倍", label: "Google口コミ増加率" },
            { value: "83%", label: "低評価の店舗内回収率" },
            { value: "30秒", label: "顧客の平均回答時間" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-indigo-600 mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-4xl mx-auto px-8 py-20">
        <p className="text-xs font-medium text-indigo-500 uppercase tracking-widest mb-3 text-center">features</p>
        <h2 className="text-3xl font-bold text-center mb-14 tracking-tight">3つのコア機能</h2>
        <div className="grid grid-cols-3 gap-8">
          {[
            {
              title: "QRポスター自動生成",
              desc: "店舗情報・インセンティブ・カラーテーマを選ぶだけでA4ポスターが完成。そのまま印刷してレジ横に貼るだけです。",
            },
            {
              title: "スマート振り分け",
              desc: "4-5星はGoogleレビューへ自動誘導、1-3星は店舗内フォームで意見回収。悪評がネットに流れる前にキャッチします。",
            },
            {
              title: "評価分析ダッシュボード",
              desc: "日次・週次レポートをメール通知。評価トレンド・カテゴリ別コメント・口コミ転換率をひと目で把握できます。",
            },
          ].map((f) => (
            <div key={f.title} className="p-6 border border-gray-100 rounded-2xl hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-8">
          <p className="text-xs font-medium text-indigo-500 uppercase tracking-widest mb-3 text-center">how it works</p>
          <h2 className="text-3xl font-bold text-center mb-14 tracking-tight">使い方はシンプル</h2>
          <div className="flex items-start gap-6">
            {[
              { step: "01", title: "QRポスターを貼る", desc: "管理画面でポスターを生成して印刷。レジ・テーブル・出口など目立つ場所に貼ります。" },
              { step: "02", title: "お客様がスキャン", desc: "スマホでQRを読み取り、星で評価。所要時間は30秒ほど。インセンティブで回収率アップ。" },
              { step: "03", title: "自動で振り分け", desc: "高評価はGoogleへ、低評価は内部フォームへ。翌朝の日次レポートで全件確認できます。" },
            ].map((h, i) => (
              <div key={h.step} className="flex-1 relative">
                {i < 2 && (
                  <div className="absolute top-5 left-[calc(50%+2rem)] right-[-calc(50%-2rem)] h-px bg-gray-200" />
                )}
                <div className="flex flex-col items-center text-center px-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center mb-4 relative z-10">
                    {h.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{h.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-4xl mx-auto px-8 py-20">
        <p className="text-xs font-medium text-indigo-500 uppercase tracking-widest mb-3 text-center">pricing</p>
        <h2 className="text-3xl font-bold text-center mb-14 tracking-tight">シンプルな料金体系</h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              name: "スターター",
              price: "¥3,980",
              per: "/ 月",
              stores: "1店舗",
              features: ["QRポスター生成", "評価振り分け", "日次レポート", "メール通知"],
              highlight: false,
            },
            {
              name: "スタンダード",
              price: "¥9,800",
              per: "/ 月",
              stores: "5店舗まで",
              features: ["スターターの全機能", "週次レポート", "カテゴリ分析", "優先サポート"],
              highlight: true,
            },
            {
              name: "エンタープライズ",
              price: "要相談",
              per: "",
              stores: "無制限",
              features: ["スタンダードの全機能", "専任担当者", "カスタム連携", "SLA保証"],
              highlight: false,
            },
          ].map((p) => (
            <div
              key={p.name}
              className={`p-6 rounded-2xl border ${
                p.highlight
                  ? "border-indigo-500 bg-indigo-600 text-white"
                  : "border-gray-100"
              }`}
            >
              <div className={`text-xs font-medium mb-1 ${p.highlight ? "text-indigo-200" : "text-gray-400"}`}>{p.stores}</div>
              <div className={`text-sm font-semibold mb-2 ${p.highlight ? "text-white" : "text-gray-900"}`}>{p.name}</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-3xl font-bold ${p.highlight ? "text-white" : "text-gray-900"}`}>{p.price}</span>
                <span className={`text-sm ${p.highlight ? "text-indigo-200" : "text-gray-400"}`}>{p.per}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f) => (
                  <li key={f} className={`text-sm flex items-center gap-2 ${p.highlight ? "text-indigo-100" : "text-gray-500"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.highlight ? "bg-indigo-300" : "bg-indigo-400"}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className={`block text-center text-sm font-semibold py-2.5 rounded-xl transition-colors ${
                  p.highlight
                    ? "bg-white text-indigo-600 hover:bg-indigo-50"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {p.price === "要相談" ? "お問い合わせ" : "無料で始める"}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-20">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
            まず、14日間無料で試してみる
          </h2>
          <p className="text-indigo-200 text-sm mb-8 leading-relaxed">
            クレジットカード不要。設定は5分。今日から悪評をブロックできます。
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-white text-indigo-600 px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-sm"
          >
            デモを見る
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-sm font-bold text-gray-900">
            hoshiko<span className="text-indigo-500">.me</span>
          </div>
          <div className="text-xs text-gray-400">
            © 2025 hoshiko.me All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
