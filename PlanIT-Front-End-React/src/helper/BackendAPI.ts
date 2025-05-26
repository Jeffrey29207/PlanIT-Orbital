const backendAPI = "http://localhost:8080";

export const testUsers = () => {
    return fetch(`${backendAPI}/testUsers`).then(response => response.json());
}

export const testAccount = () => {
    return fetch(`${backendAPI}/testAccounts`).then(response => response.json());
}

export const addUserAccount = (userID: string) => {
    return fetch(`${backendAPI}/data/addUserAccount`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userID })
    }).then(response => response.json());
}

export const getTotalBalance = (userId: string) => {
    return fetch(`${backendAPI}/accounts/${userId}/getTotalBalance`).then(response => response.json());
}

export const getSpendingBalance = (userId: string) => {
    return fetch(`${backendAPI}/accounts/${userId}/getSpendingBalance`).then(response => response.json());
}

export const getSavingBalance = (userId: string) => {
    return fetch(`${backendAPI}/accounts/${userId}/getSavingBalance`).then(response => response.json());
}

export const getActualSpendind = (userId: string) => {
    return fetch(`${backendAPI}/accounts/${userId}/getActualSpending`).then(response => response.json());
}

export const setSavings = (userId: string, amount: number) => {
    return fetch(`${backendAPI}/accounts/${userId}/setSavings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
    }).then(response => response.json());
}

export const transferSaving = (userId: string, amount: number) => {
    return fetch(`${backendAPI}/accounts/${userId}/transferSaving`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
    }).then(response => response.json());
}

export const transferSpending = (userId: string, amount: number) => {
    return fetch(`${backendAPI}/accounts/${userId}/transferSpending`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
    }).then(response => response.json());
}

export const oneTimeSpend = (userId: string, amount: number, category: string, description: string) => {
    return fetch(`${backendAPI}/accounts/${userId}/oneTimeSpend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, category, description })
    }).then(response => response.json());
}

export const undoOneTimeSpend = (userId: string, transactionId: string) => {
    return fetch(`${backendAPI}/accounts/${userId}/undoOneTimeSpend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transactionId })
    }).then(response => response.json());
}

export const recurringSpend = (userId: string, amount: number, category: string, frequency: string, interval: number, next_run_at: string) => {
    return fetch(`${backendAPI}/accounts/${userId}/recurringSpend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, category, frequency, interval, next_run_at })
    }).then(response => response.json());
}

export const refreshRecurSpend = (userId: string) => {
    return fetch(`${backendAPI}/accounts/${userId}/refreshRecurSpend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json());
}

export const scheduleRecurSpend = (userId: string) => {
    return fetch(`${backendAPI}/accounts/${userId}/scheduleRecurSpend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json());
}

export const deleteRecurringSpend = (userId: string, recurId: number) => {
    return fetch(`${backendAPI}/accounts/${userId}/deleteRecurringSpend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recurId })
    }).then(response => response.json());
}