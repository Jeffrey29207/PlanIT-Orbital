/* 
Saving dashboard components that displays detailed information
about the saving account and accept inputs from users
*/

import "./SavingDashboardStyle.css";
import NumericDashboard from "../NumericDashboard";
import DoughnutChart from "../DoughnutChart";
import LineChart from "../LineChart";
import Table from "../Table/Table";
import Input from "../Input/Input";
import RecurringTransactionInputs from "../Input/RecurringTransactionInputs";
import OneTimeTransactionInputs from "../Input/OneTimeTransactionInputs";
import {
  setSavings,
  setSavingTarget,
  transferSaving,
  oneTimeIncome,
  getSavingBalance,
  getSavingTarget,
  recurringIncome,
  getRecurringIncome,
  scheduleRecurTransactions,
  deleteRecurringIncome,
  getMonthlyBalances,
  getTransactionHistory,
  undoOneTimeIncome,
} from "../../helper/BackendAPI";
import { useEffect, useState } from "react";

interface Props {
  accountId: number;
}

function SavingDashboard({ accountId }: Props) {
  //Hanlde fetching, numeric dashboard and dougnut chart for saving balance and target saving
  const [savingBalance, setSavingBalance] = useState(0);
  const [savingsTarget, setSavingsTarget] = useState(0);
  const [recurringSavingTable, setRecurringSavingTable] = useState<any[]>([]);
  const [monthlySavingBalances, setMonthlySavingBalances] = useState<number[]>([
    0,
  ]);
  const [savingHistoryTableContent, setSavingHistoryTableContent] = useState<
    any[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await getSavingBalance(accountId);
        const target = await getSavingTarget(accountId);
        setSavingBalance(balance);
        setSavingsTarget(target);

        await scheduleRecurTransactions();
        const data = await getRecurringIncome(accountId);
        const formattedData = data.map((item: any) => ({
          content1: item.recur_id,
          content2: item.category,
          content3: item.amount,
          content4: new Date(item.next_run_at).toString(),
        }));
        setRecurringSavingTable(formattedData);

        const monthlyBalances = await getMonthlyBalances(accountId);

        const savingBalancePerMonth = monthlyBalances.map(
          (data: any) => data.saving_balance
        );
        setMonthlySavingBalances(savingBalancePerMonth);

        const spendingHistory = await getTransactionHistory(accountId);
        const formattedSpendingHistory = spendingHistory
          .filter(
            (item: any) =>
              item.tx_type === "save" &&
              item.description !== "cancellation" &&
              item.description !== "recurring income" &&
              item.description !== "deleted recurring income"
          )
          .map((item: any) => ({
            content1: item.tx_id,
            content2: item.description,
            content3: item.amount,
            content4: item.cancelled ? "Cancelled" : "Executed",
          }));
        setSavingHistoryTableContent(formattedSpendingHistory);
      } catch (error) {
        console.error("Error fetching saving balance:", error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 1000); // Realtime update every second
    return () => {
      clearInterval(interval); // Clear the interval on component unmount
    };
  }, [accountId]);

  const savingNumDashboard = (
    <NumericDashboard title="Saving account" value={savingBalance} />
  );

  const savingTargetNumDashboard = (
    <NumericDashboard title="Saving target" value={savingsTarget} />
  );

  const gapToTarget = savingsTarget - savingBalance;
  const savingDonut = (
    <DoughnutChart
      title="Saving balance"
      labels={["Target", "Saved"]}
      data={[gapToTarget > 0 ? gapToTarget : 0, savingBalance]}
      colors={["#FAFAFA", "#00B432"]}
    />
  );

  //-------------------------------------------------------------------------

  // Handle line chart
  const savingBalanceMonthlyGraph = (
    <LineChart
      title="Saving graph"
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
      data={monthlySavingBalances}
      colors={["#00B432"]}
    />
  );

  //-------------------------------------------------------------------------

  // Handle recurring income table
  const recurringSavingTableHeadings = {
    heading1: "Recurring id",
    heading2: "Description",
    heading3: "Amount",
    heading4: "Next transaction",
  };

  const handleClickForRecurringTableButton = (recurId: number) => {
    deleteRecurringIncome(recurId);
  };

  const recurringTable = (
    <Table
      title="Recurring income"
      heading={recurringSavingTableHeadings}
      data={recurringSavingTable}
      button="Delete"
      handleClick={handleClickForRecurringTableButton}
    />
  );

  //-------------------------------------------------------------------------

  // Handle inputs
  const submitSetSaving = async (
    event: React.FormEvent<HTMLFormElement>,
    value: number
  ) => {
    event.preventDefault();

    await setSavings(accountId, value).catch(console.error);

    console.log(`Adding saving: ${value}`);
  };

  const submitSetSavingTarget = async (
    event: React.FormEvent<HTMLFormElement>,
    value: number
  ) => {
    event.preventDefault();

    await setSavingTarget(accountId, value);

    console.log(`Setting target saving: ${value}`);
  };

  const submitTransferSaving = async (
    event: React.FormEvent<HTMLFormElement>,
    value: number
  ) => {
    event.preventDefault();

    await transferSaving(accountId, value).catch(console.error);

    console.log(`Transferring saving: ${value}`);
  };

  const submitRecurringTransaction = async (
    event: React.FormEvent<HTMLFormElement>,
    amount: number,
    category: string,
    frequency: string,
    interval: number,
    next_run_at: string
  ) => {
    event.preventDefault();

    await recurringIncome(
      accountId,
      amount,
      category,
      frequency,
      interval,
      next_run_at + "+08:00"
    ).catch(console.error);

    console.log(
      `Adding recurring transaction: ${amount}, ${category}, ${frequency}, ${interval}, ${next_run_at}`
    );
  };

  const submitOneTimeTransaction = async (
    event: React.FormEvent<HTMLFormElement>,
    amount: number,
    category: string,
    description: string
  ) => {
    event.preventDefault();

    await oneTimeIncome(accountId, amount, category, description).catch(
      console.error
    );

    console.log(
      `Adding one time income: ${amount}, ${category}, ${description}`
    );
  };

  const inputs = [
    <Input key={1} title="Set saving" handleSubmit={submitSetSaving} />,
    <Input
      key={2}
      title="Set saving target"
      handleSubmit={submitSetSavingTarget}
    />,
    <Input
      key={3}
      title="Transfer saving"
      handleSubmit={submitTransferSaving}
    />,
    <RecurringTransactionInputs
      key={4}
      title="Add recurring income"
      handleSubmit={submitRecurringTransaction}
    />,
    <OneTimeTransactionInputs
      key={5}
      title="Add one time income"
      handleSubmit={submitOneTimeTransaction}
    />,
  ];

  //-------------------------------------------------------------------------
  // Handle spending history table
  const savingHistroyTableHeadings = {
    heading1: "Transaction ID",
    heading2: "Description",
    heading3: "Amount",
    heading4: "Status",
  };

  const handleUndoTransaction = (transactionId: number) => {
    undoOneTimeIncome(accountId, transactionId);
  };

  const savingHistoryTable = (
    <Table
      title="Saving history"
      heading={savingHistroyTableHeadings}
      data={savingHistoryTableContent}
      button="Undo"
      handleClick={handleUndoTransaction}
    />
  );

  //-------------------------------------------------------------------------

  return (
    <div className="savingDashboardPage">
      <div className="mainDashboardBlocks savingDashboard numericDashboard">
        {savingNumDashboard}
      </div>
      <div className="mainDashboardBlocks savingTargetDashboard numericDashboard">
        {savingTargetNumDashboard}
      </div>
      <div className="mainDashboardBlocks savingGraph pieChart">
        {savingDonut}
      </div>
      <div
        className="mainDashboardBlocks savingLineGraph lineChart"
        style={{ color: "white" }}
      >
        {savingBalanceMonthlyGraph}
      </div>
      <div className="mainDashboardBlocks savingInput input">{inputs}</div>
      <div className="mainDashboardBlocks savingRecurringRecords records">
        {recurringTable}
      </div>
      <div
        className="mainDashboardBlocks savingRecords records"
        style={{ color: "white" }}
      >
        {savingHistoryTable}
      </div>
    </div>
  );
}

export default SavingDashboard;
