// Home dashboard component that displays a summary of informations about savings and spending accounts

import "./HomeDashboardStyle.css";
import NumericDashboard from "../NumericDashboard";
import DoughnutChart from "../DoughnutChart";
import LineChart from "../LineChart";
// import Table from "../Table/Table"; Not in use for milestone 1
import {
  getTotalBalance,
  getSpendingBalance,
  getSavingBalance,
  getSavingTarget,
  getActualSpending,
  getMonthlyBalances,
} from "../../helper/BackendAPI";
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
          (data: any) => data.saving_balace
        );
        setMonthlySavingBalances(savingBalancePerMonth);

        const actualSpendingPerMonth = monthlyBalances.map(
          (data: any) => data.actual_spending
        );
        setMonthlyActualSpending(actualSpendingPerMonth);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 1000); // Realtime update every second
    return () => {
      clearInterval(interval); // Clear the interval on component unmount
    };
  }, [accountId]);

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
        Transaction history table is not available for milestone 1.
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
