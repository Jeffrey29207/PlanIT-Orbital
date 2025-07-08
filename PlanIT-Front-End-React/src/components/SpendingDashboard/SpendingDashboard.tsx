/* 
Spending dashboard components that displays detailed information
about the spending account and accept inputs from users
*/

import "./SpendingDashboardStyle.css";
import NumericDashboard from "../NumericDashboard.tsx";
import DoughnutChart from "../DoughnutChart.tsx";
import LineChart from "../LineChart.tsx";
import RecurringTransactionInputs from "../Input/RecurringTransactionInputs.tsx";
import OneTimeTransactionInputs from "../Input/OneTimeTransactionInputs.tsx";
import Table from "../Table/Table.tsx";
import Input from "../Input/Input.tsx";
import { useState, useEffect } from "react";
import {
  transferSpending,
  oneTimeSpend,
  getSpendingBalance,
  getActualSpending,
  scheduleRecurTransactions,
  recurringSpend,
  getRecurringSpending,
  deleteRecurringSpend,
  getMonthlyBalances,
  getTransactionHistory,
  undoOneTimeSpend,
} from "../../helper/BackendAPI.ts";

interface Props {
  accountId: number;
}

function SpendingDashboard({ accountId }: Props) {
  // Hanlde fetching, numeric dashboard, and dougnut chart for spending balance and actual spending (spent)
  const [spendingBalance, setSpendingBalance] = useState(100000);
  const [spent, setSpent] = useState(0);
  const [recurringSpendingTable, setRecurringSpendingTable] = useState<any[]>(
    []
  );
  const [monthlyActualSpending, setMonthlyActualSpending] = useState<number[]>([
    0,
  ]);
  const [spendingHistoryTableContent, setSpendingHistoryTableContent] =
    useState<any[]>([]);

  const [stateChange, setStateChange] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await getSpendingBalance(accountId);
        setSpendingBalance(balance);
        const actualSpending = await getActualSpending(accountId);
        setSpent(actualSpending);

        const data = await getRecurringSpending(accountId);
        const formattedData = data.map((item: any) => ({
          content1: item.recur_id,
          content2: item.category,
          content3: item.amount,
          content4: new Date(item.next_run_at).toString(),
        }));
        setRecurringSpendingTable(formattedData);

        const monthlyBalances = await getMonthlyBalances(accountId);

        const actualSpendingPerMonth = monthlyBalances.map(
          (data: any) => data.actual_spending
        );
        setMonthlyActualSpending(actualSpendingPerMonth);

        const spendingHistory = await getTransactionHistory(accountId);
        const formattedSpendingHistory = spendingHistory
          .filter(
            (item: any) =>
              item.tx_type === "spend" &&
              item.description !== "cancellation" &&
              item.description !== "recurring spending" &&
              item.description !== "deleted recurring spending"
          )
          .map((item: any) => ({
            content1: item.tx_id,
            content2: item.description,
            content3: item.amount,
            content4: item.cancelled ? "Cancelled" : "Executed",
          }));
        setSpendingHistoryTableContent(formattedSpendingHistory);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, [stateChange]);

  useEffect(() => {
    // Handle realtime update of recurring transactions
    const trackState = async () => {
      const response = await scheduleRecurTransactions();
      const { isSpendingUpdated } = response[0];
      const { isSavingsUpdated } = response[1];
      (isSpendingUpdated || isSavingsUpdated) && setStateChange(!stateChange);
    };
    trackState();
    const interval = setInterval(trackState, 10000); // Realtime update every 10 seconds
    return () => {
      clearInterval(interval); // Clear the interval on component unmount
    };
  }, []);

  const spendingNumDashboard = (
    <NumericDashboard title="Spending account" value={spendingBalance} />
  );

  const spendedNumDashboard = (
    <NumericDashboard title="Amount spent" value={spent} />
  );

  const spendingDonut = (
    <DoughnutChart
      title="Spending balance"
      labels={["Spendable", "Spent"]}
      data={[spendingBalance, spent]}
      colors={["#AD0101", "#FAFAFA"]}
    />
  );

  //-------------------------------------------------------------------------

  // Handle line chart
  const actualSpendingMonthlyGraph = (
    <LineChart
      title="Spent graph"
      labels={[
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ]}
      data={monthlyActualSpending}
      colors={["#00B432"]}
    />
  );

  //-------------------------------------------------------------------------

  // Handle recurring spending table
  const recurringSpendingTableHeadings = {
    heading1: "Recurring id",
    heading2: "Description",
    heading3: "Amount",
    heading4: "Next transaction",
  };

  const handleClickForRecurringTableButton = (recurId: number) => {
    deleteRecurringSpend(recurId);
    setStateChange(!stateChange); // Trigger state change to update the dashboard
  };

  const recurringTable = (
    <Table
      title="Recurring spending"
      heading={recurringSpendingTableHeadings}
      data={recurringSpendingTable}
      button="Delete"
      handleClick={handleClickForRecurringTableButton}
    />
  );

  //-------------------------------------------------------------------------

  // Handle inputs
  const submitTransferSpending = async (
    event: React.FormEvent<HTMLFormElement>,
    value: number
  ) => {
    event.preventDefault();

    await transferSpending(accountId, value);

    setStateChange(!stateChange); // Trigger state change to update the dashboard

    console.log(`Transfer spending: ${value}`);
  };

  const submitRecurringSpending = async (
    event: React.FormEvent<HTMLFormElement>,
    amount: number,
    category: string,
    frequency: string,
    interval: number,
    next_run_at: string
  ) => {
    event.preventDefault();

    await recurringSpend(
      accountId,
      amount,
      category,
      frequency,
      interval,
      next_run_at + "+08:00"
    ).catch(console.error);

    setStateChange(!stateChange); // Trigger state change to update the dashboard

    console.log(
      `Adding recurring spending: ${amount}, ${category}, ${frequency}, ${interval}, ${next_run_at}`
    );
  };

  const submitOTS = async (
    event: React.FormEvent<HTMLFormElement>,
    amount: number,
    category: string,
    description: string
  ) => {
    event.preventDefault();

    await oneTimeSpend(accountId, amount, category, description).catch(
      console.error
    );

    setStateChange(!stateChange); // Trigger state change to update the dashboard

    console.log(
      `Adding one time income: ${amount}, ${category}, ${description}`
    );
  };

  const inputs = [
    <Input
      key={1}
      title="Transfer spending"
      handleSubmit={submitTransferSpending}
    />,
    <RecurringTransactionInputs
      key={2}
      title="Add recurring spending"
      handleSubmit={submitRecurringSpending}
    />,
    <OneTimeTransactionInputs
      key={3}
      title="Input one time spending"
      handleSubmit={submitOTS}
    />,
  ];

  //-------------------------------------------------------------------------
  // Handle spending history table
  const spendingHistroyTableHeadings = {
    heading1: "Transaction ID",
    heading2: "Description",
    heading3: "Amount",
    heading4: "Status",
  };

  const handleUndoTransaction = (transactionId: number) => {
    undoOneTimeSpend(accountId, transactionId);
    setStateChange(!stateChange); // Trigger state change to update the dashboard
  };

  const spendingHistoryTable = (
    <Table
      title="Spending history"
      heading={spendingHistroyTableHeadings}
      data={spendingHistoryTableContent}
      button="Undo"
      handleClick={handleUndoTransaction}
    />
  );

  //-------------------------------------------------------------------------

  return (
    <div className="spendingDashboardPage">
      <div className="mainDashboardBlocks spendingDashboard numericDashboard">
        {spendingNumDashboard}
      </div>
      <div className="mainDashboardBlocks spendedDashboard numericDashboard">
        {spendedNumDashboard}
      </div>
      <div className="mainDashboardBlocks spendingGraph pieChart">
        {spendingDonut}
      </div>
      <div
        className="mainDashboardBlocks spendingLineGraph lineChart"
        style={{ color: "white" }}
      >
        {actualSpendingMonthlyGraph}
      </div>
      <div className="mainDashboardBlocks spendingInput input">{inputs}</div>
      <div className="mainDashboardBlocks spendingRecurringRecords records">
        {recurringTable}
      </div>
      <div
        className="mainDashboardBlocks spendingRecords records"
        style={{ color: "white" }}
      >
        {spendingHistoryTable}
      </div>
    </div>
  );
}

export default SpendingDashboard;
