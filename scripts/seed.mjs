import pg from 'pg'

const { Client } = pg

const goals = [
  {
    name: 'Emergency Buffer',
    slug: 'emergency-buffer',
    description: 'Short-term safety net for unexpected expenses.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
    coverImageSource: 'unsplash',
    coverImageAttributionName: 'Jordan Whitt',
    coverImageAttributionUrl: 'https://unsplash.com/@jwwhitt',
    coverImageId: 'pZs_5qkWnZ8',
    targetAmountCents: 1500000,
    transactions: [
      { description: 'Initial deposit', amountCents: 500000, date: '2025-01-15' },
      { description: 'Monthly transfer', amountCents: 250000, date: '2025-02-01' },
      { description: 'Appliance repair', amountCents: -120000, date: '2025-02-20' },
    ],
  },
  {
    name: 'Home Upgrades',
    slug: 'home-upgrades',
    description: 'Renovation and maintenance savings.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=80',
    coverImageSource: 'unsplash',
    coverImageAttributionName: 'R ARCHITECTURE',
    coverImageAttributionUrl: 'https://unsplash.com/@rarchitecture_melbourne',
    coverImageId: 'TRCJ-87Yoh0',
    targetAmountCents: 8000000,
    transactions: [
      { description: 'Savings sweep', amountCents: 1200000, date: '2025-03-05' },
      { description: 'Contractor deposit', amountCents: -900000, date: '2025-04-12' },
    ],
  },
  {
    name: 'Travel Fund',
    slug: 'travel-fund',
    description: 'Future adventures and getaways.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    coverImageSource: 'unsplash',
    coverImageAttributionName: 'Josh Earle',
    coverImageAttributionUrl: 'https://unsplash.com/@joshuaearle',
    coverImageId: '0g7jHZ0m9vk',
    targetAmountCents: 4000000,
    transactions: [
      { description: 'Bonus transfer', amountCents: 200000, date: '2025-05-01' },
      { description: 'Flight booking', amountCents: -85000, date: '2025-05-18' },
    ],
  },
]

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured.')
  }

  const client = new Client({ connectionString: databaseUrl })
  await client.connect()
  try {
    const existing = await client.query('SELECT COUNT(*)::int AS count FROM goals')
    if (existing.rows[0]?.count > 0) {
      console.log('Seed skipped: goals already exist.')
      return
    }

    await client.query('BEGIN')
    try {
      for (const goal of goals) {
        const result = await client.query(
          `
          INSERT INTO goals (
            slug,
            name,
            description,
            cover_image_url,
            cover_image_source,
            cover_image_attribution_name,
            cover_image_attribution_url,
            cover_image_id,
            target_amount_cents
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
          RETURNING id
        `,
          [
            goal.slug,
            goal.name,
            goal.description,
            goal.coverImageUrl,
            goal.coverImageSource,
            goal.coverImageAttributionName,
            goal.coverImageAttributionUrl,
            goal.coverImageId,
            goal.targetAmountCents,
          ],
        )

        const goalId = result.rows[0]?.id
        if (!goalId) continue

        for (const tx of goal.transactions) {
          await client.query(
            `
            INSERT INTO goal_transactions (
              goal_id,
              description,
              amount_cents,
              transacted_on
            )
            VALUES ($1,$2,$3,$4)
          `,
            [goalId, tx.description, tx.amountCents, tx.date],
          )
        }
      }

      await client.query('COMMIT')
      console.log('Seed complete.')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    }
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
