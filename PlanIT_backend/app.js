// app.js
/* what is the full url for an API call? Answer:  http://localhost:8080 plus the endpoint url argument in each function call
e.g: http://localhost:8080/testUsers */


import express from 'express'
import 'dotenv/config';
import { testUsers, testUserAccounts, createUser, 
    createUserAccount, setSavings, getTotalBalance,
    transferSavingsToSpending, transferSpendingToSavings,
    recordOneTimeSpend, undoOneTimeSpend,
  setRecurringSpending, refreshRecurringSpending, scheduleRecurringSpend, deleteRecurringSpend} from './database.js';

const app = express()

app.use(express.json())

//Dev testing//

//return first 5 rows in the users table
app.get("/testUsers", async (req, res) => {
    const user = await testUsers()
    res.send(user)
})

//return first 5 rows in the accounts table
app.get("/testAccounts", async (req, res) => {
    const user = await testUserAccounts()
    res.send(user)
})

//Add User//
app.post("/data/addUser", async (req, res) => {
    const {username, password_hash, email} = req.body
    const user = await createUser(username, password_hash, email)
    res.status(201).send(user)
})

//Add User Account//
app.post("/data/addUserAccount", async (req, res) => {
    const {userId} = req.body
    const userAccount = await createUserAccount(userId)
    res.status(201).send(userAccount)
})

//return total balance of a user using userId as key
//return format: {"total_balance": "0.00"}
app.get("/accounts/:id/getTotalBalance", async (req, res) => {
    try {
      const accountId = Number(req.params.id);
      const updated = await getTotalBalance(accountId);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  });

///Savings///

// set the savings balance
app.post("/accounts/:id/setSavings", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const { newAmount } = req.body;
      const updated = await setSavings(newAmount, accountId);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  });


///transfers///

//transfer amount from saving to spending
app.post("/accounts/:id/transferSaving", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const { amount } = req.body;
      const updated = await transferSavingsToSpending(accountId, amount);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  });

//transfer amount from spending to saving
app.post("/accounts/:id/transferSpending", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const { amount } = req.body;
  
      const updated = await transferSpendingToSavings(accountId, amount);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  });


/// Spending ///

// make a one-time transaction
app.post("/accounts/:id/oneTimeSpend", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const {amount, category, description} = req.body;
  
      const updated = await recordOneTimeSpend(accountId, amount, category, description);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  });

// undo one-time transaction
app.post("/accounts/:id/undoOneTimeSpend", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const {transactionId} = req.body;
  
      const updated = await undoOneTimeSpend(transactionId, accountId);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  });

// set recurring transaction
// input amount, spending category, freq, interval(next repeat = next_run_at + interval x freq), next_run_at
app.post("/accounts/:id/recurringSpend", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const {amount, category, frequency, interval, next_run_at} = req.body;
  
      const updated = await setRecurringSpending(accountId, amount, category, frequency, interval, next_run_at);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  });

// renews the next_run_at for transactions due
// returns the due transactions
app.post("/accounts/refreshRecurSpend", async (req, res, next) => {
    try {
      const updated = await refreshRecurringSpending();
      res.send(updated);
    } catch (err) {
      next(err);
    }
  });

// test schedule api call
// USE THIS to test the schedule refresher
app.post("/accounts/scheduleRecurSpend", async (req, res, next) => {
    try {
      const updated = await scheduleRecurringSpend();
      res.send(updated);
    } catch (err) {
      next(err);
    }
  });

// delete any recurring transactions based only on recurId
// can be changed to include account_id
app.post("/accounts/deleteRecurringSpend", async (req, res, next) => {
    try {
      const {recurId} = req.body;
      const updated = await deleteRecurringSpend(recurId);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  });
  
// middleware for error handling
// throws an error produced by the function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: err.message,});
  })


app.listen(8080, () => {
    console.log('Server is running on port 8080')
})