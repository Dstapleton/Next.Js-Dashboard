"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import postgress from "postgres";
import { redirect } from "next/navigation";
import exp from "constants";

const sql = postgress(process.env.POSTGRES_URL!, {
  ssl: "require",
});

const CreateInvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string().uuid(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoice = CreateInvoiceSchema.omit({
  id: true,
  date: true,
});
const populateInvoiceSchema = CreateInvoiceSchema.omit({
  id: true,
  date: true,
});

export async function PopulateInvoice(id: string, data: FormData) {
  const { customerId, amount, status } = populateInvoiceSchema.parse({
    customerId: data.get("customerId"),
    amount: data.get("amount"),
    status: data.get("status"),
  });

  const amountInCents = amount * 100; // Convert dollars to cents

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function createInvoice(data: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: data.get("customerId"),
    amount: data.get("amount"),
    status: data.get("status"),
  });
  const amountInCents = amount * 100; // Convert dollars to cents
  const date = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  await sql`
    DELETE FROM invoices
    WHERE id = ${id}
  `;
  revalidatePath("/dashboard/invoices");
}
