// functions/send-half-spent-reminder/index.ts
/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@^2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY")!;
const MAILGUN_SANDBOX_DOMAIN = Deno.env.get("MAILGUN_SANDBOX_DOMAIN")!;

serve(async (req) => {

  const { new: record } = (await req.json()) as { new?: {
    account_id: string;
    spending_balance: number;
    actual_spending: number;
  }};

  
  if (!record || record.spending_balance > record.actual_spending) {
    return new Response(null, { status: 200 });
  }

  // fetch user_id from the accounts table
  const { data: account, error: acctErr } = await supabase
    .from("accounts")
    .select("user_id")
    .eq("account_id", record.account_id)
    .single();

  if (acctErr || !account?.user_id) {
    console.error("Account lookup failed:", acctErr);
    return new Response(null, { status: 200 });
  }

  // get user’s email from users table
  const { data: user, error: userErr } = await supabase
    .from("users")
    .select("email")
    .eq("user_id", account.user_id)
    .single();

  if (userErr || !user?.email) {
    console.error("User email lookup failed:", userErr);
    return new Response(null, { status: 200 });
  }

  // build email body for mailgun
  const form = new URLSearchParams();
  form.append("from",  `PlanIT Sandbox <postmaster@${MAILGUN_SANDBOX_DOMAIN}>`);
  form.append("to",    user.email);
  form.append("subject", "PlanIT Reminder");
  form.append("html", `
    <p>Greetings from PlanIT! This is a gentle reminder that you’ve spent more than half of your total deposit in your spending account.</p>
    <ul>
      <li><strong>Total Deposit:</strong> $${record.spending_balance + record.actual_spending}</li>
      <li><strong>Remaining:</strong> $${record.spending_balance}</li>
      <li><strong>Spent:</strong> $${record.actual_spending}</li>
    </ul>
  `);

  // Send via Mailgun sandbox API
  const resp = await fetch(
    `https://api.mailgun.net/v3/${MAILGUN_SANDBOX_DOMAIN}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
      },
      body: form.toString(),
    }
  );

  if (!resp.ok) {
    console.error("Mailgun error:", await resp.text());
  }

  return new Response(null, { status: 200 });
});
