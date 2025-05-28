import "./HomeDashboardStyle.css";
import NumericDashboard from "../NumericDashboard";
import DoughnutChart from "../DoughnutChart";
// import LineChart from "../LineChart"; Not in use for milestone 1
// import Table from "../Table/Table"; Not in use for milestone 1
import {
  getTotalBalance,
  getSpendingBalance,
  getSavingBalance,
  getSavingTarget,
  getActualSpending,
} from "../../helper/BackendAPI";
import { useEffect, useState } from "react";

interface Props {
  accountId: number;
}

function HomeDashboard({ accountId }: Props) {
  //Handle numeric dashboard and doughnut chart
  const [overallBalance, setOverallBalance] = useState(0);
  const [spendingBalance, setSpendingBalance] = useState(0);
  const [savingBalance, setSavingBalance] = useState(0);
  const [savingTarget, setSavingTarget] = useState(0);
  const [spended, setSpended] = useState(0);

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
        setSpended(actualSpending);
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
      labels={["Spendable", "Spended"]}
      data={[spendingBalance, spended]}
      colors={["#AD0101", "#FAFAFA"]}
    />
  );

  const savingDonut = (
    <DoughnutChart
      title="Saving balance"
      labels={["Target", "Saved"]}
      data={[savingTarget - savingBalance, savingBalance]}
      colors={["#FAFAFA", "#00B432"]}
    />
  );

  //-------------------------------------------------------------------------

  /*
  Not in use for milestone 1
  const transactionGraph = (
    <LineChart
      title="Transaction graph"
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
      data={[100, 200, 300, 400, 500, 600, 300, 300, 450, 700, 800, 900]}
      colors={["#00B432"]}
    />
  );
  */

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
        Transaction graph is not available for milestone 1.
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
