const { Client } = require("pg");

const DIRECT_URL = "postgresql://postgres.folioenmylmfacumpxec:68gwGYK6mqjeluKC@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";
const OLD_ID = "g3yxOUnNv87S8ZVc";       // test@hoshiko.me
const NEW_ID = "cmocpbtny000011a3vdv9jtny"; // nugeirba@gmail.com

async function main() {
  const client = new Client({ connectionString: DIRECT_URL });
  await client.connect();

  const { rowCount } = await client.query(
    "UPDATE stores SET user_id = $1 WHERE user_id = $2",
    [NEW_ID, OLD_ID]
  );
  console.log("✅ 店舗を移行:", rowCount, "件");

  const { rows } = await client.query(
    "SELECT COUNT(*) FROM reviews r JOIN stores s ON r.store_id = s.id WHERE s.user_id = $1",
    [NEW_ID]
  );
  console.log("✅ 紐付きレビュー:", rows[0].count, "件");

  await client.end();
}

main().catch(e => { console.error(e); process.exit(1); });
