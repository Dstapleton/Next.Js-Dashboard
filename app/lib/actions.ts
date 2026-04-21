'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import postgress from 'postgres'
import { redirect } from 'next/navigation'

// Ensure the DATABASE_URL environment variable is set before initializing the Postgres client
const postgresUrl = process.env.DATABASE_URL
// Ensure the DATABASE_URL environment variable is set before initializing the Postgres client
if (!postgresUrl) {
  throw new Error('DATABASE_URL environment variable is not set')
}
// Initialize the Postgres client using the connection string from environment variables
const sql = postgress(postgresUrl, {
  ssl: 'require',
})

// Define a Zod schema for validating invoice data
const CreateInvoiceSchema = z.object({
  id: z.string(),
  customerId: z
    .string({
      invalid_type_error: 'Please select a customer',
    })
    .uuid(),
  amount: z.coerce.number().gt(0, { message: 'Amount must be greater than 0' }),
  status: z.enum(['pending', 'paid'], { invalid_type_error: 'Please select a valid status' }),
  date: z.string(),
})

// For creating a new invoice, we don't need the ID and date in the schema
const CreateInvoice = CreateInvoiceSchema.omit({
  id: true,
  date: true,
})

// For updating an invoice, we don't need the ID and date in the schema
const populateInvoiceSchema = CreateInvoiceSchema.omit({
  id: true,
  date: true,
})

// Update an existing invoice by ID
export async function PopulateInvoice(id: string, prevState: State, data: FormData) {
  const validateFields = populateInvoiceSchema.safeParse({
    customerId: data.get('customerId'),
    amount: data.get('amount'),
    status: data.get('status'),
  })
  // If validation fails, return the error messages for each field and a user-friendly message
  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
      message: 'Validation Error: Please correct the highlighted fields and try again.',
    }
  }

  // If validation is successful, extract the validated data
  const { customerId, amount, status } = validateFields.data

  // Convert the amount from dollars to cents before storing in the database
  const amountInCents = amount * 100 // Convert dollars to cents

  // Update the invoice in the database
  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `
  } catch (error) {
    console.error('Error updating invoice:', error)
    return {
      message: 'Database Error: Failed to update invoice. Please try again later.',
    }
  }

  // Revalidate the path to ensure the updated data is reflected on the dashboard
  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

// Create a new invoice
export async function createInvoice(prevState: State, formData: FormData) {
  const validateFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })

  // If validation fails, return the error messages for each field and a user-friendly message
  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
      message: 'Validation Error: Please correct the highlighted fields and try again.',
    }
  }

  // If validation is successful, extract the validated data
  const { customerId, amount, status } = validateFields.data
  const amountInCents = amount * 100 // Convert dollars to cents
  const date = new Date().toISOString().split('T')[0] // Get current date in YYYY-MM-DD format

  // Insert the new invoice into the database
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `
    // If the insertion is unsuccessful, print an error message to the console and return a user-friendly message
  } catch (error) {
    console.error('Error inserting invoice:', error)
    return {
      message: 'Database Error: Failed to insert invoice. Please try again later.',
    }
  }
  // Revalidate the path to ensure the new invoice is reflected on the dashboard
  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

// Delete an invoice by ID
export async function deleteInvoice(id: string) {
  await sql`
    DELETE FROM invoices
    WHERE id = ${id}
  `
  // Revalidate the path to ensure the deleted invoice is removed from the dashboard
  revalidatePath('/dashboard/invoices')
}
export interface State {
  id?: string | null
  message: string
  loading?: boolean | null
  error?: { customerId?: string[]; amount?: string[]; status?: string[]; id?: string[] }
  data?: null
}
