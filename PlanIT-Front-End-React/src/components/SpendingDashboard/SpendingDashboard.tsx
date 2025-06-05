/* 
Spending dashboard components that displays detailed information
about the spending account and accept inputs from users
*/

import "./SpendingDashboardStyle.css";
import NumericDashboard from "../NumericDashboard";
import DoughnutChart from "../DoughnutChart";
import LineChart from "../LineChart";
import RecurringTransactionInputs from "../Input/RecurringTransactionInputs";
import OneTimeTransactionInputs from "../Input/OneTimeTransactionInputs";
import Table from "../Table/Table";
import Input from "../Input/Input";
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
} from "../../helper/BackendAPI";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await getSpendingBalance(accountId);
        setSpendingBalance(balance);
        const actualSpending = await getActualSpending(accountId);
        setSpent(actualSpending);

        await scheduleRecurTransactions();
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
      } catch (error) {
        console.error("Error fetching spending data:", error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 1000); // Realtime update every second
    return () => {
      clearInterval(interval); // Clear the interval on component unmount
    };
  }, [accountId]);

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
        Transaction history table is not available for milestone 1.
      </div>
    </div>
  );
}

export default SpendingDashboard;
