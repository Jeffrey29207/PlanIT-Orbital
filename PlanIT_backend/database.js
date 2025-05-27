// database.js
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Port Specifications (for local postgresql server, no longer used)
// Create Pool
// const pool = new Pool({
//   host:     process.env.PGHOST,
//   port:     Number(process.env.PGPORT),
//   database: process.env.PGDATABASE,
//   user:     process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   ssl:      process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false,
//   connectionTimeoutMillis: Number(process.env.PGCONNECT_TIMEOUT) * 1000,
// });

// Port Specifications (connect to supabase)
// Create Pool
const pool = new Pool({
  connectionString: 'postgresql://postgres.tawzugumouawtstryldu:J_1129l12345@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
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
export async function createUser(user_id, username, password_hash, email) {
  // RETURNING * to get the inserted row
  const result = await pool.query(
    `INSERT INTO users (user_id, username, password_hash, email)
     VALUES ($1, $2, $3, $4)
     RETURNING *;`,
    [user_id, username, password_hash, email]
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

// access account total balance
export async function getTotalBalance(accountId) {
  const res = await pool.query(`
    SELECT total_balance FROM accounts WHERE account_id = $1;
    `, [accountId]
  );
  return res.rows[0] || null;
}

// access account spending balance
export async function getSpendingBalance(accountId) {
  const res = await pool.query(`
    SELECT spending_balance FROM accounts WHERE account_id = $1;
    `, [accountId]
  );
  return res.rows[0] || null;
}

// access account saving balance
export async function getSavingBalance(accountId) {
  const res = await pool.query(`
    SELECT saving_balance FROM accounts WHERE account_id = $1;
    `, [accountId]
  );
  return res.rows[0] || null;
}

// access amount spent in the account
export async function getActualSpending(accountId) {
  const res = await pool.query(`
    SELECT actual_spending FROM accounts WHERE account_id = $1;
    `, [accountId]
  );
  return res.rows[0] || null;
}

/* Savings */ 
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

// modify saving target
export async function setSavingTarget(newAmount, account_id) {

  if (newAmount < 0) {
    throw new Error("saving target must be non-negative");
  }

  const result = await pool.query(
    `
    UPDATE accounts
       SET saving_target = $1,
           updated_at = now()
     WHERE account_id = $2
     RETURNING *;
    `,
    [newAmount, account_id]
  );
  return result.rows[0];
}

/* One time Spending */ 

//make a one-time additon to the savings account
//BEGIN/COMMIT - query executes only if all the SQL statements work
export async function recordOneTimeIncome(accountId, amount, category, description = '') {

  if (amount < 0) {
    throw new Error("Income must be non-negative!");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO transactions
        (account_id, tx_type, subtype, amount, category, description)
      VALUES ($1, 'spend', 'modify_savings', $2, $3, $4)`,
      [accountId, amount, category, description]
    );

    const upd = await client.query(
      `UPDATE accounts
        SET saving_balance     = saving_balance + $2,
            total_balance       = total_balance + $2,
            updated_at          = now()
      WHERE account_id = $1
      RETURNING *`,
      [accountId, amount]
    );

    if (upd.rowCount === 0) {
      throw new Error("account not found");
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

/* One time Spending */ 

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
      throw new Error(`Insufficient spending balance to transact $${amount}`);
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


/* Recurring Spending */ 

// read all recurring transactions of a user account
// arranged from earlist to latest 'next_run_at' timestamp
export async function getRecurringSpending(accountId) {
  const {rows} = await pool.query(`
    SELECT amount, category, next_run_at
    FROM recurring_spending
    WHERE account_id = $1
    ORDER BY next_run_at ASC;
    `, [accountId]
  );
  return rows;
}


// Set recurring spendings
export async function setRecurringSpending(accountId, amount, category, frequency, interval, next_run_at) {

  // if input amount is negative, throw error
  if (amount < 0) {
    throw new Error("Amount spent must be non-negative!");
  }

  // else, insert new row in recurring transactions table
  const result = await pool.query(
    `INSERT INTO recurring_spending
        (account_id, tx_type, subtype, amount, category, frequency, interval, next_run_at)
      VALUES ($1, 'spend', 'modify_spending', $2, $3, $4, $5, $6)
      RETURNING *;`,
    [accountId, amount, category, frequency, interval, next_run_at]
  );

  // return the updated row
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
      SELECT recur_id, account_id, amount, category, next_run_at
      FROM recurring_spending
      WHERE is_active AND next_run_at <= now(); 
      `);
    // if no recurring transaction are due, return an empty array
    if (transactionsDue.length === 0) {
      await client.query('COMMIT');
      return [];
    }

    await client.query(`
      UPDATE recurring_spending
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

// insert new transactions from refreshRecurringSpending function
/* if insufficent amount for transaction -> does not update, continue to update the rest of the transactions */
/* Tiebreaker to be done: make a priority list of recurring transactions, such that for recurrences with the same amount, the spending scheduler will priortise a transaction
current logic is to execute transaction with the lowest recur id*/

export async function recordRecurringSpend(recurringArray) {
  if (recurringArray.length === 0) {
    return { isMutated: false, 
      message: "no recurring spendings are due", 
      successful: [], errors: [] };
  }

  // 1. parallelise the transaction execution for every element in recurring array
  const work = recurringArray.map(({ recur_id, account_id, amount, category }) =>
    recordOneTimeSpend(
      account_id,
      parseFloat(amount),
      category,
      'recurring spending'
    )
    .then(result => ({ status: 'fulfilled', recur_id, result }))
    .catch(err => ({
      status: 'rejected',
      recur_id,
      account_id,
      amount,
      category,
      error: err.message || String(err),
    }))
  );

  // 2. Await completion
  const results = await Promise.all(work);

  // 3. Separate successes & errors
  const successfulCount = results.filter(r => r.status === 'fulfilled').length;
  const errors = results
    .filter(r => r.status === 'rejected')
    .map(r => ({
      recur_id: r.recur_id,
      account_id: r.account_id,
      amount: r.amount,
      category: r.category,
      error: r.error,
      timestamp: new Date().toISOString(),
    }));

  // 4. pull back the last N successful transactions
  const { rows } = await pool.query(
    `SELECT *
       FROM transactions
       WHERE description = 'recurring income'
      ORDER BY tx_id DESC
      LIMIT $1`,
    [successfulCount]
  );

  return {
    isSpendingsUpdated: (successfulCount > 0) ? true : false,
    successful: rows,
    errors,
  };
}


// deletes a selected recurring spending
// only removes the recurring spending from recurring_spending table
// does not undo transactions that are already executed by the transactions scheduler
export async function deleteRecurringSpend(recurId, description = "deleted recurring spending") {
  const client = await pool.connect();
  // check if recur id exists

  try {
    await client.query("BEGIN");
    // check if recur id exists
    const {rows} = await client.query(`
      SELECT account_id, amount, category
      FROM recurring_spending
      WHERE recur_id = $1`,
    [recurId]
    );
    // if no recurring transaction found, throw not found error
    if (rows.length === 0) {
      throw new Error("recurring spending transaction does not exist");
    }

    // extract transaction details from row in recurring_spending table
    const { account_id, amount, category } = rows[0];

    // updates the transaction table & logs the deletion
    await client.query(
      `INSERT INTO transactions
        (account_id, tx_type, subtype, amount, category, description)
      VALUES ($1, 'spend', 'modify_spending', $2, $3, $4);`,
      [account_id, amount, category, description]
    );

    // using recur_id, deletes recurring spending from the recurring_spending table
    await client.query(
      `DELETE FROM recurring_spending
      WHERE recur_id = $1`, 
      [recurId]
    );


    await client.query("COMMIT");
    return { recurId, account_id, amount, category };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// pauses recurring transaction
export async function pauseRecurringSpend(recur_id, accountId, description = 'pause recurring transaction]') {
}


/* Recurring Income */ 

// read all recurring income transactions of a user account
// arranged from earlist to latest 'next_run_at' timestamp
export async function getRecurringIncome(accountId) {
  const {rows} = await pool.query(`
    SELECT amount, category, next_run_at
    FROM recurring_income
    WHERE account_id = $1
    ORDER BY next_run_at ASC;
    `, [accountId]
  );
  return rows;
}


// Set recurring income
export async function setRecurringIncome(accountId, amount, category, frequency, interval, next_run_at) {

  // if input amount is negative, throw error
  if (amount < 0) {
    throw new Error("Recurring income must be non-negative!");
  }

  // else, insert new row in recurring transactions table
  const result = await pool.query(
    `INSERT INTO recurring_income
        (account_id, tx_type, subtype, amount, category, frequency, interval, next_run_at)
      VALUES ($1, 'save', 'modify_savings', $2, $3, $4, $5, $6)
      RETURNING *;`,
    [accountId, amount, category, frequency, interval, next_run_at]
  );

  // return the updated row
  return result.rows[0];
}

// Evoke recurrence 
// intermediate function, for developer access only
/**
 * Finds all recurring income that are due.
 * then increases each one's next_run_at forward by interval×frequency.
 *
 * @returns {Promise<Array<{recur_id:number,account_id:number,amount:string,category:string}>>}
 */
export async function refreshRecurringIncome() {
  const client = await pool.connect();
  
  try {
    // find and save all rows where the recurring transaction is due
    await client.query("BEGIN");
    const {rows: transactionsDue } = await client.query(`
      SELECT recur_id, account_id, amount, category, next_run_at
      FROM recurring_income
      WHERE is_active AND next_run_at <= now(); 
      `);
    // if no recurring transaction are due, return an empty array
    if (transactionsDue.length === 0) {
      await client.query('COMMIT');
      return [];
    }

    await client.query(`
      UPDATE recurring_income
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


// insert new transactions from refreshRecurringIncome function
/* if insufficent amount for transaction -> does not update, continue to update the rest of the transactions */
/* Tiebreaker to be done: make a priority list of recurring transactions, such that for recurrences with the same amount, the spending scheduler will priortise a transaction
current logic is to execute transaction with the lowest recur id*/

export async function recordRecurringIncome(recurringArray) {
  if (recurringArray.length === 0) {
    return { isMutated: false, 
      message: "no recurring incomes are due", 
      successful: [], errors: [] };
  }

  // 1. parallelise the transaction execution for every element in recurring array
  const work = recurringArray.map(({ recur_id, account_id, amount, category }) =>
    recordOneTimeIncome(
      account_id,
      parseFloat(amount),
      category,
      'recurring income'
    )
    .then(result => ({ status: 'fulfilled', recur_id, result }))
    .catch(err => ({
      status: 'rejected',
      recur_id,
      account_id,
      amount,
      category,
      error: err.message || String(err),
    }))
  );

  // 2. Await completion
  const results = await Promise.all(work);

  // 3. Separate successes & errors
  const successfulCount = results.filter(r => r.status === 'fulfilled').length;
  const errors = results
    .filter(r => r.status === 'rejected')
    .map(r => ({
      recur_id: r.recur_id,
      account_id: r.account_id,
      amount: r.amount,
      category: r.category,
      error: r.error,
      timestamp: new Date().toISOString(),
    }));

  // 4. pull back the last N successful transactions
  const { rows } = await pool.query(
    `SELECT *
       FROM transactions
       WHERE description = 'recurring income'
      ORDER BY tx_id DESC
      LIMIT $1`,
    [successfulCount]
  );

  return {
    isSavingsUpdated: (successfulCount > 0) ? true : false,
    successful: rows,
    errors,
  };
}


// deletes a selected recurring income
// only removes the recurring income from recurring_income table
// does not undo transactions that are already executed by the transactions scheduler
export async function deleteRecurringIncome(recurId, description = "deleted recurring income") {
  const client = await pool.connect();
  // check if recur id exists

  try {
    await client.query("BEGIN");
    // check if recur id exists
    const {rows} = await client.query(`
      SELECT account_id, amount, category
      FROM recurring_income
      WHERE recur_id = $1`,
    [recurId]
    );
    // if no recurring transaction found, throw not found error
    if (rows.length === 0) {
      throw new Error("recurring income transaction does not exist");
    }

    // extract transaction details from row in recurring_spending table
    const { account_id, amount, category } = rows[0];

    // updates the transaction table & logs the deletion
    await client.query(
      `INSERT INTO transactions
        (account_id, tx_type, subtype, amount, category, description)
      VALUES ($1, 'save', 'modify_saving', $2, $3, $4);`,
      [account_id, amount, category, description]
    );

    // using recur_id, deletes recurring spending from the recurring_spending table
    await client.query(
      `DELETE FROM recurring_income
      WHERE recur_id = $1`, 
      [recurId]
    );


    await client.query("COMMIT");
    return { recurId, account_id, amount, category };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}


// mocker scheduler for testing
export async function scheduleRecurringTransactions() {
  const recurringSpendingArray = await refreshRecurringSpending();
  const updatedSpendings = await recordRecurringSpend(recurringSpendingArray);
  const recurringIncomeArray = await refreshRecurringIncome();
  const updatedIncomes = await recordRecurringIncome(recurringIncomeArray);
  console.log("Recurring transaction Scheduler has ran");
  return [updatedSpendings, updatedIncomes];
}