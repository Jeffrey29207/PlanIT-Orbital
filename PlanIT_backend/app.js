// app.js
/* what is the full url for an API call? Answer:  http://localhost:8080 plus the endpoint url argument in each function call
e.g: http://localhost:8080/testUsers */


import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { testUsers, testUserAccounts, createUser, 
    createUserAccount, setSavings, setSavingTarget, 
    recordOneTimeIncome, undoOneTimeIncome,
    getAccountId, getTotalBalance, getSpendingBalance, getSavingBalance, getActualSpending, getSavingTarget,
    transferSavingsToSpending, transferSpendingToSavings,
    recordOneTimeSpend, undoOneTimeSpend,
    getRecurringSpending, setRecurringSpending, refreshRecurringSpending, deleteRecurringSpend,
    getRecurringIncome, setRecurringIncome, deleteRecurringIncome,
  scheduleRecurringTransactions, 
  getTransactionHistory, getMonthlyBalances,
getAverageDailySpending_7daysSMA, getForecast, getForecastFeatures} from './database.js';

const app = express()

// allow any react server to fetch from the backend server
app.use(cors({ origin: '*' }));
// previous config: app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173', 'https://plan-it-orbital-2025-kayf.vercel.app'], credentials: true }));

app.use(express.json());
const port = process.env.PORT || 8080; 

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
    const {user_id, username, password_hash, email} = req.body
    const user = await createUser(user_id, username, password_hash, email)
    res.status(201).send(user)
})

//Add User Account//
app.post("/data/addUserAccount", async (req, res) => {
    const {userId} = req.body
    const userAccount = await createUserAccount(userId)
    res.status(201).send(userAccount)
})

// Reading values from account table //


//return account id(s) of a user account using user_id as key
//return format: {"account_id": 1}
app.get("/accounts/:userId/getAccountId", async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const { account_id } = await getAccountId(userId);
      res.status(200).json(account_id);
    } catch (err) {
      next(err);
    }
  });

//return total balance of a user account using accountId as key
//return format: {"total_balance": "0.00"}
app.get("/accounts/:id/getTotalBalance", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const updated = await getTotalBalance(accountId);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  });

//return spending balance of a user account using accountId as key
//return format: {"spending_balance": "0.00"}
app.get("/accounts/:id/getSpendingBalance", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const updated = await getSpendingBalance(accountId);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  });

//return saving balance of a user account using accountId as key
//return format: {"saving_balance": "0.00"}
app.get("/accounts/:id/getSavingBalance", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const updated = await getSavingBalance(accountId);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  });

//return actual amount spent of a user account using accountid as key
//return format: {"actual_spending": "0.00"}
app.get("/accounts/:id/getActualSpending", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const updated = await getActualSpending(accountId);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  });

//return savings target of a user account using accountid as key
//return format: {"saving_target": "0.00"}
app.get("/accounts/:id/getSavingTarget", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const updated = await getSavingTarget(accountId);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  });

//return transaction history of a user account using accountId as key
app.get("/accounts/:id/getTransactionHistory", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const updated = await getTransactionHistory(accountId);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  });

//return monthly historical balances of a user account using accountId as key
app.get("/accounts/:id/getMonthlyBalances", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const updated = await getMonthlyBalances(accountId);
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

// set the saving target
app.post("/accounts/:id/setSavingTarget", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const { newAmount } = req.body;
      const updated = await setSavingTarget(newAmount, accountId);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  });

// make a one-time income transaction to savings account
app.post("/accounts/:id/oneTimeIncome", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const {amount, category, description} = req.body;
  
      const updated = await recordOneTimeIncome(accountId, amount, category, description);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  });

// undo one-time spending transaction
app.post("/accounts/:id/undoOneTimeIncome", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const {transactionId} = req.body;
  
      const updated = await undoOneTimeIncome(transactionId, accountId);
      res.json(updated);
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

// make a one-time spending transaction
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

// undo one-time spending transaction
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


// read all recurring spending of a user account
// arranged from earliest to latest next_run_at timestamp
// input account id
app.get("/accounts/:id/getRecurringSpending", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const updated = await getRecurringSpending(accountId);
      res.status(200).json(updated);
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
// USE THIS to test the schedule refresher for BOTH recurring SPENDING AND recurring INCOME
app.post("/accounts/scheduleRecurTransactions", async (req, res, next) => {
    try {
      const updated = await scheduleRecurringTransactions();
      res.send(updated);
    } catch (err) {
      next(err);
    }
  });

// delete any recurring spendings based only on recurId
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

// read all recurring income of a user account
// arranged from earliest to latest next_run_at timestamp
// input account id
app.get("/accounts/:id/getRecurringIncome", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const updated = await getRecurringIncome(accountId);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  });

// set recurring income 
// input amount, spending category, freq, interval(next repeat = next_run_at + interval x freq), next_run_at
app.post("/accounts/:id/recurringIncome", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const {amount, category, frequency, interval, next_run_at} = req.body;
  
      const updated = await setRecurringIncome(accountId, amount, category, frequency, interval, next_run_at);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  });

// delete any recurring income based only on recurId
// can be changed to include account_id
app.post("/accounts/deleteRecurringIncome", async (req, res, next) => {
    try {
      const {recurId} = req.body;
      const updated = await deleteRecurringIncome(recurId);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  });

// Forecasting algorithm // 

// get average daily spending over 7-day interval for an account
// uses a 7-day simple moving average 
app.get("/accounts/:id/getAverageDailySpending_7daysSMA", async (req, res, next) => {
    try {
      const accountId = Number(req.params.id);
      const updated = await getAverageDailySpending_7daysSMA(accountId);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  });

app.post("/accounts/:id/getForecastFeatures", async (req, res, next) => {
  try {
    const accountId = Number(req.params.id);
    const result = await getForecastFeatures(accountId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

app.post("/accounts/:id/getForecast", async (req, res, next) => {
  try {
    const accountId = Number(req.params.id);
    const features = await getForecastFeatures(accountId);
    const result = await getForecast(features);
    res.json(result);
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


app.listen(port, () => {
    console.log('Server is running on port 8080')
})