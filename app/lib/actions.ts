"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import postgress from "postgres";
import { redirect } from "next/navigation";
import exp from "constants";

// Initialize the Postgres client using the connection string from environment variables
const sql = postgress(process.env.POSTGRES_URL!, {
  ssl: "require",
});

// Define a Zod schema for validating invoice data
const CreateInvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string().uuid(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

// For creating a new invoice, we don't need the ID and date in the schema
const CreateInvoice = CreateInvoiceSchema.omit({
  id: true,
  date: true,
});

// For updating an invoice, we don't need the ID and date in the schema
const populateInvoiceSchema = CreateInvoiceSchema.omit({
  id: true,
  date: true,
});

// Update an existing invoice by ID
export async function PopulateInvoice(id: string, data: FormData) {
  const { customerId, amount, status } = populateInvoiceSchema.parse({
    customerId: data.get("customerId"),
    amount: data.get("amount"),
    status: data.get("status"),
  });

  // Convert the amount from dollars to cents before storing in the database
  const amountInCents = amount * 100; // Convert dollars to cents

  // Update the invoice in the database
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  // Revalidate the path to ensure the updated data is reflected on the dashboard
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

// Create a new invoice
export async function createInvoice(data: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: data.get("customerId"),
    amount: data.get("amount"),
    status: data.get("status"),
  });
  const amountInCents = amount * 100; // Convert dollars to cents
  const date = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

  // Insert the new invoice into the database
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
    // If the insertion is unsuccessful, print an error message to the console and return a user-friendly message
  } catch (error) {
    console.error("Error inserting invoice:", error);
    return {
      message:
        "Database Error: Failed to insert invoice. Please try again later.",
    };
  }
  // Revalidate the path to ensure the new invoice is reflected on the dashboard
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

// Delete an invoice by ID
export async function deleteInvoice(id: string) {
  await sql`
    DELETE FROM invoices
    WHERE id = ${id}
  `;
  // Revalidate the path to ensure the deleted invoice is removed from the dashboard
  revalidatePath("/dashboard/invoices");
}
