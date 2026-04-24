import { PrismaClient } from "@prisma/client";

// シードはpgBouncer経由不可のためDIRECT_URLを使用
const prisma = new PrismaClient({
  datasourceUrl: process.env.DIRECT_URL,
});

const comments = {
  high: [
    "スープが濃厚で最高でした。また来ます！",
    "接客がとても丁寧で感動しました。",
    "料理が美味しくて大満足です。",
    "雰囲気も良くて居心地が最高でした。",
    "コスパが最高です。また絶対来ます。",
    "スタッフさんがとても親切でした。",
    "定番メニューが絶品でした。毎週通いたい。",
    "友人に紹介したいお店です。",
    "清潔感があって気持ちよく過ごせました。",
    "量も多くて満足度が高いです。",
  ],
  low: [
    "待ち時間が長すぎました。改善してほしいです。",
    "席が狭く感じました。",
    "注文から時間がかかりすぎです。",
    "少し値段が高いと感じました。",
    "スタッフの対応が気になりました。",
    "料理が少し冷めていました。",
    "騒がしくてゆっくりできませんでした。",
  ],
};

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAgo: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - randomBetween(0, daysAgo));
  d.setHours(randomBetween(10, 21), randomBetween(0, 59), 0, 0);
  return d;
}

async function main() {
  console.log("🌱 シード開始...");

  // テストユーザー作成（Googleログイン後の実ユーザーに紐付ける場合は後でuserIdを変更）
  const user = await prisma.user.upsert({
    where: { email: "test@hoshiko.me" },
    update: {},
    create: {
      email: "test@hoshiko.me",
      name: "テスト オーナー",
      image: null,
    },
  });
  console.log(`✅ ユーザー: ${user.email}`);

  // 店舗データ
  const storeData = [
    {
      name: "田中ラーメン新宿店",
      description: "濃厚豚骨スープが自慢の本格ラーメン店",
      address: "東京都新宿区新宿3-1-1",
      phone: "03-1234-5678",
      category: "ラーメン",
      googleReviewUrl: "https://g.page/r/tanaka-ramen-shinjuku/review",
      googleMapsUrl: "https://maps.google.com/?q=田中ラーメン新宿店",
      googleConnected: true,
      notifyEmail: "manager@tanaka-ramen.jp",
      notifyThreshold: 3,
      reviewCount: 60,
      highRatio: 0.78,
    },
    {
      name: "田中ラーメン渋谷店",
      description: "渋谷駅徒歩3分、行列必至の人気店",
      address: "東京都渋谷区道玄坂2-2-2",
      phone: "03-2345-6789",
      category: "ラーメン",
      googleReviewUrl: "https://g.page/r/tanaka-ramen-shibuya/review",
      googleMapsUrl: "https://maps.google.com/?q=田中ラーメン渋谷店",
      googleConnected: true,
      notifyEmail: "manager@tanaka-ramen.jp",
      notifyThreshold: 3,
      reviewCount: 45,
      highRatio: 0.72,
    },
    {
      name: "佐藤カフェ",
      description: "南青山の隠れ家カフェ。自家焙煎コーヒーと手作りスイーツ",
      address: "東京都港区南青山1-1-1",
      phone: "03-3456-7890",
      category: "カフェ",
      googleReviewUrl: "https://g.page/r/sato-cafe/review",
      googleMapsUrl: "https://maps.google.com/?q=佐藤カフェ",
      googleConnected: true,
      notifyEmail: "sato@cafe.jp",
      notifyThreshold: 3,
      reviewCount: 80,
      highRatio: 0.85,
    },
    {
      name: "山田居酒屋",
      description: "歌舞伎町の老舗居酒屋。豊富なお酒と本格和食",
      address: "東京都新宿区歌舞伎町1-1-1",
      phone: "03-4567-8901",
      category: "居酒屋",
      googleReviewUrl: null,
      googleMapsUrl: "https://maps.google.com/?q=山田居酒屋",
      googleConnected: false,
      notifyEmail: "yamada@izakaya.jp",
      notifyThreshold: 2,
      reviewCount: 35,
      highRatio: 0.60,
    },
  ];

  for (const sd of storeData) {
    const { reviewCount, highRatio, ...storeFields } = sd;

    const store = await prisma.store.upsert({
      where: { id: `seed-${sd.name}` },
      update: storeFields,
      create: { id: `seed-${sd.name}`, ...storeFields, userId: user.id },
    });
    console.log(`  🏪 ${store.name}`);

    // 既存レビューを削除して再生成
    await prisma.review.deleteMany({ where: { storeId: store.id } });

    const reviews = Array.from({ length: reviewCount }, () => {
      const isHigh = Math.random() < highRatio;
      const rating = isHigh ? randomBetween(4, 5) : randomBetween(1, 3);
      const redirected = rating >= 4 && !!store.googleReviewUrl && Math.random() > 0.2;
      return {
        storeId: store.id,
        rating,
        comment: randomFrom(isHigh ? comments.high : comments.low),
        redirected,
        createdAt: randomDate(180),
      };
    });

    await prisma.review.createMany({ data: reviews });
    console.log(`     💬 ${reviewCount}件のレビュー投入`);
  }

  const totalReviews = await prisma.review.count({ where: { store: { userId: user.id } } });
  console.log(`\n✅ 完了! 合計${totalReviews}件のレビューをSupabaseに投入しました`);
  console.log(`\n📋 テストユーザー情報:`);
  console.log(`   Email: test@hoshiko.me`);
  console.log(`   ※ Googleログイン後、Supabaseでusers.idをこのユーザーに付け替えるか、`);
  console.log(`      ログインしたユーザーのIDでシードを再実行してください`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
