import postgres from 'postgres'

const postgresUrl = process.env.POSTGRES_URL
if (!postgresUrl) {
  throw new Error('POSTGRES_URL environment variable is not set')
}

// This is an API route that will be called from the client to fetch data from the database. You can create as many API routes as you need, and they will be automatically available under the /api directory. For example, if you create a file called /app/query/route.ts, it will be available at /api/query.
const sql = postgres(postgresUrl, { ssl: 'require' })

async function listInvoices() {
  const data = await sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `

  return data
}

export async function GET() {
  // return Response.json({
  //   message:
  //     "Uncomment this file and remove this line. You can delete this file when you are finished.",
  // });
  try {
    return Response.json(await listInvoices())
  } catch (error) {
    return Response.json({ error }, { status: 500 })
  }
}
