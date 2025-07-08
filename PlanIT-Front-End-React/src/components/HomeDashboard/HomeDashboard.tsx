// Home dashboard component that displays a summary of informations about savings and spending accounts

import "./HomeDashboardStyle.css";
import NumericDashboard from "../NumericDashboard.tsx";
import DoughnutChart from "../DoughnutChart.tsx";
import LineChart from "../LineChart.tsx";
import Table from "../Table/Table.tsx";
import {
  getTotalBalance,
  getSpendingBalance,
  getSavingBalance,
  getSavingTarget,
  getActualSpending,
  getMonthlyBalances,
  getTransactionHistory,
  undoOneTimeSpend,
  undoOneTimeIncome,
  scheduleRecurTransactions,
} from "../../helper/BackendAPI.ts";
import { useEffect, useState } from "react";

interface Props {
  accountId: number;
}

function HomeDashboard({ accountId }: Props) {
  //Handle fetching, numeric dashboard, and doughnut chart
  const [overallBalance, setOverallBalance] = useState(0);
  const [spendingBalance, setSpendingBalance] = useState(0);
  const [savingBalance, setSavingBalance] = useState(0);
  const [savingTarget, setSavingTarget] = useState(0);
  const [spent, setSpent] = useState(0);
  const [monthlyOverallBalances, setMonthlyOverallBalances] = useState<
    number[]
  >([0]);
  const [monthlySavingBalances, setMonthlySavingBalances] = useState<number[]>([
    0,
  ]);
  const [monthlyActualSpending, setMonthlyActualSpending] = useState<number[]>([
    0,
  ]);
  const [transactionHistoryTableContent, setTransactionHistoryTableContent] =
    useState<any[]>([]);

  const [stateChange, setStateChange] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalBalance = await getTotalBalance(accountId);
        setOverallBalance(totalBalance);

        const spendingBalance = await getSpendingBalance(accountId);
        setSpendingBalance(spendingBalance);

        const savingBalance = await getSavingBalance(accountId);
        setSavingBalance(savingBalance);

        const savingsTarget = await getSavingTarget(accountId);
        setSavingTarget(savingsTarget);

        const actualSpending = await getActualSpending(accountId);
        setSpent(actualSpending);

        const monthlyBalances = await getMonthlyBalances(accountId);

        const overallBalancePerMonth = monthlyBalances.map(
          (data: any) => data.total_balance
        );
        setMonthlyOverallBalances(overallBalancePerMonth);

        const savingBalancePerMonth = monthlyBalances.map(
          (data: any) => data.saving_balance
        );
        setMonthlySavingBalances(savingBalancePerMonth);

        const actualSpendingPerMonth = monthlyBalances.map(
          (data: any) => data.actual_spending
        );
        setMonthlyActualSpending(actualSpendingPerMonth);

        const transactionHistory = await getTransactionHistory(accountId);
        const formattedTransactionHistory = transactionHistory
          .filter(
            (item: any) =>
              item.description !== "cancellation" &&
              item.description !== "recurring spending" &&
              item.description !== "recurring income" &&
              item.description !== "deleted recurring spending" &&
              item.description !== "deleted recurring income" &&
              item.description !== "set savings"
          )
          .map((item: any) => ({
            content1: item.tx_id,
            content2: `${item.description} - ${item.tx_type}`,
            content3: item.amount,
            content4: item.cancelled ? "Cancelled" : "Executed",
            option: item.tx_type,
          }));
        setTransactionHistoryTableContent(formattedTransactionHistory);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [stateChange]);

  useEffect(() => {
    // Handle realtime update of recurring transactions
    const trackState = async () => {
      const { isMutated } = await scheduleRecurTransactions();
      isMutated && setStateChange(!stateChange);
    };
    trackState();
    const interval = setInterval(trackState, 10000); // Realtime update every 10 seconds
    return () => {
      clearInterval(interval); // Clear the interval on component unmount
    };
  }, []);

  const overallNumDashboard = (
    <NumericDashboard title="Overall account" value={overallBalance} />
  );

  const spendingNumDashboard = (
    <NumericDashboard title="Spending account" value={spendingBalance} />
  );

  const savingNumDashboard = (
    <NumericDashboard title="Saving account" value={savingBalance} />
  );

  const overallDonut = (
    <DoughnutChart
      title="Overall balance"
      labels={["Spending", "Saving"]}
      data={[spendingBalance, savingBalance]}
      colors={["#AD0101", "#00B432"]}
    />
  );

  const spendingDonut = (
    <DoughnutChart
      title="Spending balance"
      labels={["Spendable", "Amount spent"]}
      data={[spendingBalance, spent]}
      colors={["#AD0101", "#FAFAFA"]}
    />
  );

  const gapToTarget = savingTarget - savingBalance;
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
  const overallBalanceMonthlyGraph = (
    <LineChart
      title="Overall graph"
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
      data={monthlyOverallBalances}
      colors={["#00B432"]}
    />
  );

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

  // Handle transaction history table
  const transactionHistroyTableHeadings = {
    heading1: "Transaction ID",
    heading2: "Description",
    heading3: "Amount",
    heading4: "Status",
  };

  const handleUndoTransactionWithOption = (
    transactionId: number,
    type: string
  ) => {
    if (type === "spend") {
      undoOneTimeSpend(accountId, transactionId);
    } else if (type === "save") {
      undoOneTimeIncome(accountId, transactionId);
    }
    setStateChange(!stateChange); // Trigger state change to update the dashboard
  };

  const transactionHistoryTable = (
    <Table
      title="Transaction History"
      heading={transactionHistroyTableHeadings}
      data={transactionHistoryTableContent}
      button="Undo"
      handleClickWithOption={handleUndoTransactionWithOption}
    />
  );

  //-------------------------------------------------------------------------

  return (
    <div className="dashboard">
      <div className="mainDashboardBlocks overallDashboard numericDashboard">
        {overallNumDashboard}
      </div>
      <div className="mainDashboardBlocks overallGraph pieChart">
        {overallDonut}
      </div>
      <div className="mainDashboardBlocks spendingDashboard numericDashboard">
        {spendingNumDashboard}
      </div>
      <div className="mainDashboardBlocks spendingGraph pieChart">
        {spendingDonut}
      </div>
      <div
        className="mainDashboardBlocks transactionGraph lineChart"
        style={{ color: "white" }}
      >
        {overallBalanceMonthlyGraph}
        {savingBalanceMonthlyGraph}
        {actualSpendingMonthlyGraph}
      </div>
      <div
        className="mainDashboardBlocks transactionRecords records"
        style={{ color: "white" }}
      >
        {transactionHistoryTable}
      </div>
      <div className="mainDashboardBlocks savingDashboard numericDashboard">
        {savingNumDashboard}
      </div>
      <div className="mainDashboardBlocks savingGraph pieChart">
        {savingDonut}
      </div>
    </div>
  );
}

export default HomeDashboard;
