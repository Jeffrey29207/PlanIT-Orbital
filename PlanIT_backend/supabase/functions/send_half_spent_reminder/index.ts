// functions/send-half-spent-reminder/index.ts
/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@^2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

serve(async (req) => {
  const { new: record } = (await req.json()) as { new?: {
    account_id: string;
    spending_balance: number;
    actual_spending: number;
  }};

  if (!record) return new Response(null, { status: 200 });
  if (record.spending_balance > record.actual_spending) {
    // check if spending_balance is still above threshold
    return new Response(null, { status: 200 });
  }

  // find the account userid
  const { data: account, error: acctErr } = await supabase
    .from("accounts")
    .select("user_id")
    .eq("account_id", record.account_id)
    .single();
  if (acctErr || !account?.user_id) {
    console.error("No account/user_id for account_id", record.account_id, acctErr);
    return new Response(null, { status: 200 });
  }

  // use user id to find email in accounts table
  const { data: user, error: userErr } = await supabase
    .from("users")
    .select("email")
    .eq("user_id", account.user_id)
    .single();
  if (userErr || !user?.email) {
    console.error("No email for user", account.user_id, userErr);
    return new Response(null, { status: 200 });
  }

  // Send the email reminder
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: user.email,
      subject: "PlanIT Reminder",
      html: `
        <p>Greetings from PlanIT! This is a gentle reminder that you have spent more than half of your total deposit in your spending account.</p>
        <ul>
          <li><strong>Total Deposit:</strong> $${record.spending_balance + record.actual_spending}</li>
          <li><strong>Remaining Spending Balance:</strong> $${record.spending_balance}</li>
          <li><strong>Amount Spent:</strong> $${record.actual_spending}</li>
        </ul>
      `,
    }),
  });

  return new Response(null, { status: 200 });
});
