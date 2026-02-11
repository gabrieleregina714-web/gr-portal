// Seed script — run with: npx tsx scripts/seed.ts
// Populates the Neon PostgreSQL database with initial data
// Requires DATABASE_URL environment variable to be set

import { neon } from '@neondatabase/serverless';
import { athletes, plans, appointments, goals, smartGoals, weeklyCheckIns, achievements } from '../src/lib/data';
import { staffUsers, athleteUsers, payments, subscriptions, athleteNotes, athleteDocuments, notifications } from '../src/lib/auth-data';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not set. Pass it as: DATABASE_URL=postgres://... npx tsx scripts/seed.ts');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const collections: [string, any[]][] = [
  ['athletes', athletes],
  ['plans', plans],
  ['appointments', appointments],
  ['goals', goals],
  ['smartGoals', smartGoals],
  ['weeklyCheckIns', weeklyCheckIns],
  ['achievements', achievements],
  ['staffUsers', staffUsers],
  ['athleteUsers', athleteUsers],
  ['payments', payments],
  ['subscriptions', subscriptions],
  ['athleteNotes', athleteNotes],
  ['athleteDocuments', athleteDocuments],
  ['notifications', notifications],
];

async function seed() {
  console.log('Creating table...');
  await sql`
    CREATE TABLE IF NOT EXISTS collections (
      collection TEXT NOT NULL,
      id TEXT NOT NULL,
      data JSONB NOT NULL,
      PRIMARY KEY (collection, id)
    )
  `;

  for (const [name, data] of collections) {
    // Clear existing
    await sql`DELETE FROM collections WHERE collection = ${name}`;
    // Insert items
    for (const item of data) {
      const id = item.id || `${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8)}`;
      await sql`
        INSERT INTO collections (collection, id, data)
        VALUES (${name}, ${id}, ${JSON.stringify(item)})
      `;
    }
    console.log(`✓ ${name}: ${data.length} items`);
  }

  console.log('\n✅ Seed complete!');
}

seed().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
