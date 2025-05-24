import React, { useState } from 'react';
import './App.css';

// Base URL for backend
const BASE_URL = 'http://localhost:8080';

export default function App() {
  const [output, setOutput] = useState('');
  const [userId, setUserId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('');
  const [intervalVal, setIntervalVal] = useState('');
  const [nextRunAt, setNextRunAt] = useState('');
  const [recurId, setRecurId] = useState('');

  // Unified API caller
  const callApi = async (path, options = {}) => {
    try {
      const url = `${BASE_URL}${path}`;
      const res = await fetch(url, options);
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }
      setOutput(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    }
  };

  return (
    <div className="app-container">
      <h1>API Tester</h1>

      <section>
        <button onClick={() => callApi('/testUsers')}>Get Test Users</button>
        <button onClick={() => callApi('/testAccounts')}>Get Test Accounts</button>
      </section>

      <section>
        <h2>Create User</h2>
        <input placeholder="user_id" value={userId} onChange={e => setUserId(e.target.value)} />
        <input placeholder="username" value={description} onChange={e => setDescription(e.target.value)} />
        <input placeholder="password_hash" value={amount} onChange={e => setAmount(e.target.value)} />
        <input placeholder="email" value={category} onChange={e => setCategory(e.target.value)} />
        <button onClick={() => callApi('/data/addUser', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ user_id: userId, username: description, password_hash: amount, email: category })
        })}>Create User</button>
      </section>

      <section>
        <h2>Create User Account</h2>
        <input placeholder="userId" value={userId} onChange={e => setUserId(e.target.value)} />
        <button onClick={() => callApi('/data/addUserAccount', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ userId })
        })}>Create Account</button>
      </section>

      <section>
        <h2>Get Total Balance</h2>
        <input placeholder="accountId" value={accountId} onChange={e => setAccountId(e.target.value)} />
        <button onClick={() => callApi(`/accounts/${accountId}/getTotalBalance`)}>Get Balance</button>
      </section>

      <section>
        <h2>Set Savings</h2>
        <input placeholder="accountId" value={accountId} onChange={e => setAccountId(e.target.value)} />
        <input placeholder="newAmount" value={amount} onChange={e => setAmount(e.target.value)} />
        <button onClick={() => callApi(`/accounts/${accountId}/setSavings`, {
          method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ newAmount: amount })
        })}>Set Savings</button>
      </section>

      <section>
        <h2>Transfer Savings → Spending</h2>
        <input placeholder="accountId" value={accountId} onChange={e => setAccountId(e.target.value)} />
        <input placeholder="amount" value={amount} onChange={e => setAmount(e.target.value)} />
        <button onClick={() => callApi(`/accounts/${accountId}/transferSaving`, {
          method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ amount })
        })}>Transfer</button>
      </section>

      <section>
        <h2>Transfer Spending → Savings</h2>
        <input placeholder="accountId" value={accountId} onChange={e => setAccountId(e.target.value)} />
        <input placeholder="amount" value={amount} onChange={e => setAmount(e.target.value)} />
        <button onClick={() => callApi(`/accounts/${accountId}/transferSpending`, {
          method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ amount })
        })}>Transfer Back</button>
      </section>

      <section>
        <h2>One-Time Spend</h2>
        <input placeholder="accountId" value={accountId} onChange={e => setAccountId(e.target.value)} />
        <input placeholder="amount" value={amount} onChange={e => setAmount(e.target.value)} />
        <input placeholder="category" value={category} onChange={e => setCategory(e.target.value)} />
        <input placeholder="description" value={description} onChange={e => setDescription(e.target.value)} />
        <button onClick={() => callApi(`/accounts/${accountId}/oneTimeSpend`, {
          method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ amount, category, description })
        })}>Spend</button>
      </section>

      <section>
        <h2>Undo One-Time Spend</h2>
        <input placeholder="accountId" value={accountId} onChange={e => setAccountId(e.target.value)} />
        <input placeholder="transactionId" value={recurId} onChange={e => setRecurId(e.target.value)} />
        <button onClick={() => callApi(`/accounts/${accountId}/undoOneTimeSpend`, {
          method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ transactionId: recurId })
        })}>Undo</button>
      </section>

      <section>
        <h2>Set Recurring Spend</h2>
        <input placeholder="accountId" value={accountId} onChange={e => setAccountId(e.target.value)} />
        <input placeholder="amount" value={amount} onChange={e => setAmount(e.target.value)} />
        <input placeholder="category" value={category} onChange={e => setCategory(e.target.value)} />
        <input placeholder="frequency" value={frequency} onChange={e => setFrequency(e.target.value)} />
        <input placeholder="interval" value={intervalVal} onChange={e => setIntervalVal(e.target.value)} />
        <input placeholder="next_run_at (ISO)" value={nextRunAt} onChange={e => setNextRunAt(e.target.value)} />
        <button onClick={() => callApi(`/accounts/${accountId}/recurringSpend`, {
          method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ amount, category, frequency, interval: Number(intervalVal), next_run_at: nextRunAt })
        })}>Set Recurring</button>
      </section>

      <section>
        <h2>Refresh Recurring</h2>
        <button onClick={() => callApi('/accounts/refreshRecurSpend', { method:'POST' })}>Refresh Now</button>
      </section>

      <section>
        <h2>Schedule Recurring (Test)</h2>
        <button onClick={() => callApi('/accounts/scheduleRecurSpend', { method:'POST' })}>Schedule</button>
      </section>

      <section>
        <h2>Delete Recurring Spend</h2>
        <input placeholder="recurId" value={recurId} onChange={e => setRecurId(e.target.value)} />
        <button onClick={() => callApi('/accounts/deleteRecurringSpend', {
          method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ recurId })
        })}>Delete Recurring</button>
      </section>

      <section>
        <h2>Output</h2>
        <pre className="output-box">{output}</pre>
      </section>
    </div>
  );
}
