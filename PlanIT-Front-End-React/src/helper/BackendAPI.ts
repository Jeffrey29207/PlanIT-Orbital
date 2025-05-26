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

export const getTotalBalance = async (userId: string) => {
    return await fetch(`${backendAPI}/accounts/${userId}/getTotalBalance`).then(response => response.json());
}

export const getSpendingBalance = async (userId: string) => {
    return await fetch(`${backendAPI}/accounts/${userId}/getSpendingBalance`).then(response => response.json());
}

export const getSavingBalance = async (userId: string) => {
    return await fetch(`${backendAPI}/accounts/${userId}/getSavingBalance`).then(response => response.json());
}

export const getActualSpending = async (userId: string) => {
    return await fetch(`${backendAPI}/accounts/${userId}/getActualSpending`).then(response => response.json());
}

export const setSavings = async (userId: string, amount: number) => {
    return await fetch(`${backendAPI}/accounts/${userId}/setSavings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
    }).then(response => response.json());
}

export const transferSaving = async (userId: string, amount: number) => {
    return await fetch(`${backendAPI}/accounts/${userId}/transferSaving`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
    }).then(response => response.json());
}

export const transferSpending = async (userId: string, amount: number) => {
    return await fetch(`${backendAPI}/accounts/${userId}/transferSpending`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
    }).then(response => response.json());
}

export const oneTimeSpend = async (userId: string, amount: number, category: string, description: string) => {
    return await fetch(`${backendAPI}/accounts/${userId}/oneTimeSpend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, category, description })
    }).then(response => response.json());
}

export const undoOneTimeSpend = async (userId: string, transactionId: string) => {
    return await fetch(`${backendAPI}/accounts/${userId}/undoOneTimeSpend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transactionId })
    }).then(response => response.json());
}

export const recurringSpend = async (userId: string, amount: number, category: string, frequency: string, interval: number, next_run_at: string) => {
    return await fetch(`${backendAPI}/accounts/${userId}/recurringSpend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, category, frequency, interval, next_run_at })
    }).then(response => response.json());
}

export const refreshRecurSpend = async (userId: string) => {
    return await fetch(`${backendAPI}/accounts/${userId}/refreshRecurSpend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json());
}

export const scheduleRecurSpend = async (userId: string) => {
    return await fetch(`${backendAPI}/accounts/${userId}/scheduleRecurSpend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json());
}

export const deleteRecurringSpend = async (userId: string, recurId: number) => {
    return await fetch(`${backendAPI}/accounts/${userId}/deleteRecurringSpend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recurId })
    }).then(response => response.json());
}