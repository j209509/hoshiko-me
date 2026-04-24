// Prismaを使わずpg(node-postgres)でシード
const { Client } = require("pg");
const crypto = require("crypto");

const DIRECT_URL = "postgresql://postgres.folioenmylmfacumpxec:68gwGYK6mqjeluKC@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";

const cuid = () => crypto.randomBytes(12).toString("base64url").slice(0, 24).replace(/[^a-z0-9]/gi, "x");

const highComments = [
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
];
const lowComments = [
  "待ち時間が長すぎました。改善してほしいです。",
  "席が狭く感じました。",
  "注文から時間がかかりすぎです。",
  "少し値段が高いと感じました。",
  "スタッフの対応が気になりました。",
  "料理が少し冷めていました。",
  "騒がしくてゆっくりできませんでした。",
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - rand(0, daysAgo));
  d.setHours(rand(10, 21), rand(0, 59), 0, 0);
  return d.toISOString();
};

const stores = [
  {
    name: "田中ラーメン新宿店",
    description: "濃厚豚骨スープが自慢の本格ラーメン店",
    address: "東京都新宿区新宿3-1-1",
    phone: "03-1234-5678",
    category: "ラーメン",
    google_review_url: "https://g.page/r/tanaka-ramen-shinjuku/review",
    google_maps_url: "https://maps.google.com/?q=田中ラーメン新宿店",
    google_connected: true,
    notify_email: "manager@tanaka-ramen.jp",
    notify_threshold: 3,
    reviews: 60,
    highRatio: 0.78,
  },
  {
    name: "田中ラーメン渋谷店",
    description: "渋谷駅徒歩3分、行列必至の人気店",
    address: "東京都渋谷区道玄坂2-2-2",
    phone: "03-2345-6789",
    category: "ラーメン",
    google_review_url: "https://g.page/r/tanaka-ramen-shibuya/review",
    google_maps_url: "https://maps.google.com/?q=田中ラーメン渋谷店",
    google_connected: true,
    notify_email: "manager@tanaka-ramen.jp",
    notify_threshold: 3,
    reviews: 45,
    highRatio: 0.72,
  },
  {
    name: "佐藤カフェ",
    description: "南青山の隠れ家カフェ。自家焙煎コーヒーと手作りスイーツ",
    address: "東京都港区南青山1-1-1",
    phone: "03-3456-7890",
    category: "カフェ",
    google_review_url: "https://g.page/r/sato-cafe/review",
    google_maps_url: "https://maps.google.com/?q=佐藤カフェ",
    google_connected: true,
    notify_email: "sato@cafe.jp",
    notify_threshold: 3,
    reviews: 80,
    highRatio: 0.85,
  },
  {
    name: "山田居酒屋",
    description: "歌舞伎町の老舗居酒屋。豊富なお酒と本格和食",
    address: "東京都新宿区歌舞伎町1-1-1",
    phone: "03-4567-8901",
    category: "居酒屋",
    google_review_url: null,
    google_maps_url: "https://maps.google.com/?q=山田居酒屋",
    google_connected: false,
    notify_email: "yamada@izakaya.jp",
    notify_threshold: 2,
    reviews: 35,
    highRatio: 0.60,
  },
];

async function main() {
  const client = new Client({ connectionString: DIRECT_URL });
  await client.connect();
  console.log("🌱 シード開始...\n");

  // テストユーザー
  const userId = cuid();
  await client.query(`
    INSERT INTO users (id, email, name, created_at, updated_at)
    VALUES ($1, $2, $3, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
    RETURNING id
  `, [userId, "test@hoshiko.me", "テスト オーナー"]);

  const { rows: userRows } = await client.query(
    "SELECT id FROM users WHERE email = $1", ["test@hoshiko.me"]
  );
  const uid = userRows[0].id;
  console.log(`✅ ユーザー作成: test@hoshiko.me (id: ${uid})\n`);

  for (const s of stores) {
    const storeId = cuid();

    // 既存店舗を削除して再作成
    await client.query("DELETE FROM stores WHERE name = $1 AND user_id = $2", [s.name, uid]);

    await client.query(`
      INSERT INTO stores (
        id, name, description, address, phone, category,
        google_review_url, google_maps_url, google_connected,
        notify_email, notify_threshold, is_active, user_id,
        created_at, updated_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true,$12,NOW(),NOW()
      )
    `, [
      storeId, s.name, s.description, s.address, s.phone, s.category,
      s.google_review_url, s.google_maps_url, s.google_connected,
      s.notify_email, s.notify_threshold, uid,
    ]);

    console.log(`🏪 ${s.name}`);

    // レビュー生成
    const reviewValues = [];
    const reviewParams = [];
    let pi = 1;
    for (let i = 0; i < s.reviews; i++) {
      const isHigh = Math.random() < s.highRatio;
      const rating = isHigh ? rand(4, 5) : rand(1, 3);
      const redirected = rating >= 4 && !!s.google_review_url && Math.random() > 0.2;
      const comment = pick(isHigh ? highComments : lowComments);
      const createdAt = randomDate(180);
      reviewValues.push(`($${pi},$${pi+1},$${pi+2},$${pi+3},$${pi+4})`);
      reviewParams.push(cuid(), storeId, rating, comment, createdAt);
      pi += 5;
    }

    await client.query(
      `INSERT INTO reviews (id, store_id, rating, comment, created_at) VALUES ${reviewValues.join(",")}`,
      reviewParams
    );
    console.log(`   💬 ${s.reviews}件のレビュー投入`);
  }

  const { rows } = await client.query(
    "SELECT COUNT(*) FROM reviews r JOIN stores s ON r.store_id = s.id WHERE s.user_id = $1", [uid]
  );
  console.log(`\n✅ 完了! 合計${rows[0].count}件をSupabaseに投入`);
  console.log(`\n📋 テスト情報`);
  console.log(`   ユーザーID: ${uid}`);
  console.log(`   このIDをGoogleログイン後のアカウントに紐付けるか`);
  console.log(`   Googleログインすると自動でそのユーザーに紐付きます`);

  await client.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
