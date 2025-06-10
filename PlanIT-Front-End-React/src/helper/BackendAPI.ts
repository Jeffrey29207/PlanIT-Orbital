// These are functions to access fetch the backend API

//const backendAPI = "https://planit-orbital-2025.onrender.com";
const backendAPI = "http://localhost:8080";

export const testUsers = async () => {
    return await fetch(`${backendAPI}/testUsers`).then(response => response.json());
}

export const testAccount = async () => {
    return await fetch(`${backendAPI}/testAccounts`).then(response => response.json());
}

export const addUserAccount = async (userId: string) => {
    return await fetch(`${backendAPI}/data/addUserAccount`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    }).then(response => response.json());
}

export const getAccountId = async (userId: string) => {
    return await fetch(`${backendAPI}/accounts/${userId}/getAccountId`)
    .then(response => response.json())
    .then(data => {
        const { account_id } = data;
        return account_id;
    });
}

export const getTotalBalance = async (accountId: number) => {
    return await fetch(`${backendAPI}/accounts/${accountId}/getTotalBalance`)
    .then(response => response.json())
    .then(data => {const { total_balance } = data; return total_balance;});
}

export const getSpendingBalance = async (accountId: number) => {
    return await fetch(`${backendAPI}/accounts/${accountId}/getSpendingBalance`)
    .then(response => response.json())
    .then(data => {const { spending_balance } = data; return spending_balance;});
}

export const getSavingBalance = async (accountId: number) => {
    return await fetch(`${backendAPI}/accounts/${accountId}/getSavingBalance`)
    .then(response => response.json())
    .then(data => {const { saving_balance } = data; return saving_balance;});
}

export const getActualSpending = async (accountId: number) => {
    return await fetch(`${backendAPI}/accounts/${accountId}/getActualSpending`)
    .then(response => response.json())
    .then(data => {const { actual_spending } = data; return actual_spending;});
}

export const getSavingTarget = async (accountId: number) => {
    return await fetch(`${backendAPI}/accounts/${accountId}/getSavingTarget`)
    .then(response => response.json())
    .then(data => {const { saving_target } = data; return saving_target;});
}

export const getTransactionHistory = async (accountId: number) => {
    return await fetch(`${backendAPI}/accounts/${accountId}/getTransactionHistory`)
    .then(response => response.json());
}

export const getMonthlyBalances = async (accountId: number) => {
    return await fetch(`${backendAPI}/accounts/${accountId}/getMonthlyBalances`)
    .then(response => response.json());
}

export const setSavings = async (accountId: number, newAmount: number) => {
    return await fetch(`${backendAPI}/accounts/${accountId}/setSavings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newAmount })
    }).then(response => response.json());
}

export const setSavingTarget = async (accountId: number, newAmount: number) => {
    return await fetch(`${backendAPI}/accounts/${accountId}/setSavingTarget`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newAmount })
    }).then(response => response.json());
}

export const oneTimeIncome = async (accountId: number, amount: number, category: string, description: string) => {
    return await fetch(`${backendAPI}/accounts/${accountId}/oneTimeIncome`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, category, description })
    }).then(response => response.json());
}

export const undoOneTimeIncome = async (accountId: number, transactionId: number) => {
    return await fetch(`${backendAPI}/accounts/${accountId}/undoOneTimeIncome`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transactionId })
    }).then(response => response.json());
}

export const transferSaving = async (accountId: number, amount: number) => {
    return await fetch(`${backendAPI}/accounts/${accountId}/transferSaving`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
    }).then(response => response.json());
}

export const transferSpending = async (accountId: number, amount: number) => {
    return await fetch(`${backendAPI}/accounts/${accountId}/transferSpending`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
    }).then(response => response.json());
}

export const oneTimeSpend = async (accountId: number, amount: number, category: string, description: string) => {
    return await fetch(`${backendAPI}/accounts/${accountId}/oneTimeSpend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, category, description })
    }).then(response => response.json());
}

export const undoOneTimeSpend = async (accountId: number, transactionId: number) => {
    return await fetch(`${backendAPI}/accounts/${accountId}/undoOneTimeSpend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transactionId })
    }).then(response => response.json());
}

export const getRecurringSpending = async (accountId: number) => {
    return await fetch(`${backendAPI}/accounts/${accountId}/getRecurringSpending`)
    .then(response => response.json());
}

export const recurringSpend = async (accountId: number, amount: number, category: string, frequency: string, interval: number, next_run_at: string) => {
    return await fetch(`${backendAPI}/accounts/${accountId}/recurringSpend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, category, frequency, interval, next_run_at })
    }).then(response => response.json());
}

export const refreshRecurSpend = async () => {
    return await fetch(`${backendAPI}/accounts/refreshRecurSpend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json());
}

export const scheduleRecurTransactions = async () => {
    return await fetch(`${backendAPI}/accounts/scheduleRecurTransactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json());
}

export const deleteRecurringSpend = async (recurId: number) => {
    return await fetch(`${backendAPI}/accounts/deleteRecurringSpend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recurId })
    }).then(response => response.json());
}

export const recurringIncome = async (accountId: number, amount: number, category: string, frequency: string, interval: number, next_run_at: string) => {
    return await fetch(`${backendAPI}/accounts/${accountId}/recurringIncome`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, category, frequency, interval, next_run_at })
    }).then(response => response.json());
}

export const getRecurringIncome = async (accountId: number) => {
    return await fetch(`${backendAPI}/accounts/${accountId}/getRecurringIncome`)
    .then(response => response.json());
}

export const deleteRecurringIncome = async (recurId: number) => {
    return await fetch(`${backendAPI}/accounts/deleteRecurringIncome`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recurId })
    }).then(response => response.json());
}
