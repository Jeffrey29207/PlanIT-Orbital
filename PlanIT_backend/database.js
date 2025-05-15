// database.js
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Port Specifications
// Create Pool
const pool = new Pool({
  host:     process.env.PGHOST,
  port:     Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user:     process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl:      process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: Number(process.env.PGCONNECT_TIMEOUT) * 1000,
});

// test query function for user table
// display first 5 rows of user table
export async function testUsers() {
  const res = await pool.query('SELECT * FROM users ORDER BY user_id LIMIT 5');
  return res.rows || null;
}

// test query function for accounts table
// display first 5 rows of accounts table
export async function testUserAccounts() {
  const res = await pool.query('SELECT * FROM accounts ORDER BY account_id LIMIT 5');
  return res.rows || null;
}

// insert new user
export async function createUser(username, password_hash, email) {
  // RETURNING * to get the inserted row
  const result = await pool.query(
    `INSERT INTO users (username, password_hash, email)
     VALUES ($1, $2, $3)
     RETURNING *;`,
    [username, password_hash, email]
  );

  // result.rows is an array of returned rows; we only inserted one
  return result.rows[0];
}

// creates brand new account
// with $0 in both Saving and Spending Account
export async function createUserAccount(userId) {
  const result = await pool.query(
    `INSERT INTO accounts
       (user_id,
        account_name,
        total_balance,
        saving_balance,
        spending_balance,
        actual_spending,
        updated_at)
     VALUES
       ($1,
        'default',      -- account name to be changed to 'username account_n', n = number of accounts the user has created
        0,              -- total_balance
        0,              -- saving_balance
        0,              -- spending_balance
        0,              -- actual_spending
        now())
     RETURNING *;`,
    [userId]
  );
  return result.rows[0];
}



// Query logic for Savings Account
// Modify Saving balance
export async function setSavings(newAmount, account_id) {
  const result = await pool.query(
    `
    UPDATE accounts
       SET total_balance  = total_balance + ($1 - saving_balance),
           saving_balance = $1,
           updated_at     = now()
     WHERE account_id = $2
     RETURNING *;
    `,
    [newAmount, account_id]
  );
  return result.rows[0];
}


// Set one-time transfer from savings to spendings
// to include: warning feature if newAmount is below actual spending
/**
 * Transfer a one-time amount from savings into spending.
 *
 * @param {number} accountId  – the PK of the account row
 * @param {number} amount     – how much to move from savings to spending
 * @returns {Promise<Object>} – the updated account row
 * @throws {Error}            – if savings_balance < amount
 */
export async function transferSavingsToSpending(accountId, amount) {

  if (amount < 0) {
    throw new Error("Amount transferred must be non-negative!");
  }

  const { rows, rowCount } = await pool.query(
    `UPDATE accounts
        SET spending_balance = spending_balance + $2,
            saving_balance   = saving_balance   - $2,
            updated_at       = now()
      WHERE account_id     = $1
        AND saving_balance >= $2
      RETURNING *;`,
    [accountId, amount]
  );


  if (rowCount === 0) {
    throw new Error("Insufficient savings balance for transfer");
  }

  // rows[0] is the single updated account
  return rows[0];
}

/**
 * Transfer a one-time amount from spending into savings.
 *
 * @param {number} accountId  – the PK of the account row
 * @param {number} amount     – how much to move from spending to savings
 * @returns {Promise<Object>} – the updated account row
 * @throws {Error}            – if spending_balance < amount
 */
export async function transferSpendingToSavings(accountId, amount) {

  if (amount < 0) {
    throw new Error("Amount transferred must be non-negative!");
  }

  const { rows, rowCount } = await pool.query(
    `UPDATE accounts
        SET spending_balance = spending_balance - $2,
            saving_balance   = saving_balance   + $2,
            total_balance    = total_balance    /* stays the same */,
            updated_at       = now()
      WHERE account_id      = $1
        AND spending_balance >= $2
      RETURNING *;`,
    [accountId, amount]
  );

  if (rowCount === 0) {
    throw new Error("Insufficient spending budget for transfer");
  }

  return rows[0];
}

/// Spending ///

//make a one-time transaction
//BEGIN/COMMIT - query executes only if all the SQL statements work
export async function recordOneTimeSpend(accountId, amount, category, description = '') {

  if (amount < 0) {
    throw new Error("Amount spent must be non-negative!");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO transactions
        (account_id, tx_type, subtype, amount, category, description)
      VALUES ($1, 'spend', 'modify_spending', $2, $3, $4)`,
      [accountId, amount, category, description]
    );

    const upd = await client.query(
      `UPDATE accounts
        SET actual_spending     = actual_spending + $2,
            spending_balance = spending_balance - $2,
            total_balance       = total_balance   - $2,
            updated_at          = now()
      WHERE account_id = $1
        AND spending_balance >= $2
      RETURNING *`,
      [accountId, amount]
    );

    if (upd.rowCount === 0) {
      throw new Error("Insufficient budget to spend that amount");
    }

    await client.query("COMMIT");
    return upd.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}


//undo a one-time transaction
//same as subtracting the amount of the one time transaction
export async function undoOneTimeSpend(transactionId, accountId, description = 'cancellation') {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    // 1) Check if transaction can be found
    // if yes, check if the order has already been cancelled
    const { rows: txRows } = await client.query(
      `SELECT amount, category, cancelled
         FROM transactions
        WHERE tx_id = $1
          AND account_id = $2
        LIMIT 1;`,
      [transactionId, accountId]
    );

    if (txRows.length === 0) {
      throw new Error("Original transaction not found");
    }

    const { amount, category, cancelled } = txRows[0];

    if (cancelled) {
      throw new Error('transaction was cancelled or is a cancellation');
    }

    // 2) If all checks pass, update cancel status of the original transaction 
    await client.query(
      `UPDATE transactions
        SET cancelled = True
      WHERE tx_id = $1
        AND account_id = $2;`,
      [transactionId, accountId]
    );
    

    // 3) insert a reversal record with negated amount
    await client.query(
      `INSERT INTO transactions
         (account_id, tx_type, subtype, amount, category, description, cancelled)
       VALUES ($1, 'spend', 'modify_spending', $2, $3, $4, True);`,
      [accountId, -amount, category, description]
    );

    // 4) roll back the balances
    const upd = await client.query(
      `UPDATE accounts
          SET actual_spending     = actual_spending - $2,
              spending_balance = spending_balance + $2,
              total_balance       = total_balance       + $2,
              updated_at          = now()
        WHERE account_id = $1
          AND actual_spending >= $2
        RETURNING *;`,
      [accountId, amount]
    );
    if (upd.rowCount === 0) {
      throw new Error("Cannot undo: not enough actual spending to refund");
    }

    await client.query("COMMIT");
    return upd.rows[0];

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}


/// Recurring transactions /// 

// Set recurring spendings
export async function setRecurringSpending(accountId, amount, category, frequency, interval, next_run_at) {

  if (amount < 0) {
    throw new Error("Amount spent must be non-negative!");
  }

  const result = await pool.query(
    `INSERT INTO recurring_transactions
        (account_id, tx_type, subtype, amount, category, frequency, interval, next_run_at)
      VALUES ($1, 'spend', 'modify_spending', $2, $3, $4, $5, $6)
      RETURNING *;`,
    [accountId, amount, category, frequency, interval, next_run_at]
  );
  // return the first row of all the rows of the updated table
  return result.rows[0];
}


// Evoke recurrence 
// intermediate function, for developer access only
/**
 * Finds all recurring spendings that are due.
 * then increases each one's next_run_at forward by interval×frequency.
 *
 * @returns {Promise<Array<{recur_id:number,account_id:number,amount:string,category:string}>>}
 */
export async function refreshRecurringSpending() {
  const client = await pool.connect();
  
  try {
    // find and save all rows where the recurring transaction is due
    await client.query("BEGIN");
    const {rows: transactionsDue } = await client.query(`
      SELECT recur_id, account_id, amount, category
      FROM recurring_transactions
      WHERE is_active AND next_run_at <= now(); 
      `);
    // if no recurring transaction are due, return an empty array
    if (transactionsDue.length === 0) {
      await client.query('COMMIT');
      return [];
    }

    await client.query(`
      UPDATE recurring_transactions
         SET next_run_at = CASE frequency
           WHEN 'min'   THEN next_run_at + (interval || ' minutes')::interval
           WHEN 'hour'  THEN next_run_at + (interval || ' hours')::interval
           WHEN 'day'   THEN next_run_at + (interval || ' days')::interval
           WHEN 'week'  THEN next_run_at + (interval || ' weeks')::interval
           WHEN 'month' THEN next_run_at + (interval || ' months')::interval
         END
       WHERE is_active AND next_run_at <= now();
    `);
  
    await client.query('COMMIT');

    return transactionsDue;
  
  } catch (err) {
      await client.query('ROLLBACK');
      throw err;
  } finally {
    client.release();
  }
}

// insert new transactions incurred from scheduler refreshing the recurring transactions table
export async function recordRecurringSpending() {}