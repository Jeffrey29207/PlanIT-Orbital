import "./HomeDashboardStyle.css";
import NumericDashboard from "../NumericDashboard";
import DoughnutChart from "../DoughnutChart";
import LineChart from "../LineChart";
import Table from "../Table/Table";
import {
  getTotalBalance,
  getSpendingBalance,
  getSavingBalance,
  getActualSpending,
} from "../../helper/BackendAPI";
import { useEffect, useState } from "react";

interface Props {
  accountId: number;
}

function HomeDashboard({ accountId }: Props) {
  const [overallBalance, setOverallBalance] = useState(0);
  const [spendingBalance, setSpendingBalance] = useState(0);
  const [savingBalance, setSavingBalance] = useState(0);
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
      data={[3000000, savingBalance]}
      colors={["#FAFAFA", "#00B432"]}
    />
  );

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

  const history = [
    {
      id: 1,
      date: "2023-01-01",
      type: "Recurring",
      amount: "$1000",
    },
    {
      id: 2,
      date: "2023-02-01",
      type: "Recurring",
      amount: "$500",
    },
    {
      id: 3,
      date: "2023-03-01",
      type: "Irregular",
      amount: "$200",
    },
  ];

  return (
    <div className="dashboard">
      <div className="mainDashboardBlocks overallDashboard numericDashboard">
        <NumericDashboard title="Overall account" value={overallBalance} />
      </div>
      <div className="mainDashboardBlocks overallGraph pieChart">
        {overallDonut}
      </div>
      <div className="mainDashboardBlocks spendingDashboard numericDashboard">
        <NumericDashboard title="Spending account" value={spendingBalance} />
      </div>
      <div className="mainDashboardBlocks spendingGraph pieChart">
        {spendingDonut}
      </div>
      <div className="mainDashboardBlocks transactionGraph lineChart">
        {transactionGraph}
      </div>
      <div className="mainDashboardBlocks transactionRecords records">
        <Table data={history} />
      </div>
      <div className="mainDashboardBlocks savingDashboard numericDashboard">
        <NumericDashboard title="Saving account" value={savingBalance} />
      </div>
      <div className="mainDashboardBlocks savingGraph pieChart">
        {savingDonut}
      </div>
    </div>
  );
}

export default HomeDashboard;
