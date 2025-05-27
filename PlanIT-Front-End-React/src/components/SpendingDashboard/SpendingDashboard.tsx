import "./SpendingDashboardStyle.css";
import NumericDashboard from "../NumericDashboard";
import DoughnutChart from "../DoughnutChart";
import LineChart from "../LineChart";
import Table from "../Table/Table";
import Input from "../Input/Input";
import { useState, useEffect } from "react";
import {
  transferSpending,
  getSpendingBalance,
  getActualSpending,
} from "../../helper/BackendAPI";

interface Props {
  accountId: number;
}

function SpendingDashboard({ accountId }: Props) {
  const [spendingBalance, setSpendingBalance] = useState(100000);
  const [spended, setSpended] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await getSpendingBalance(accountId);
        setSpendingBalance(balance);
        const actualSpending = await getActualSpending(accountId);
        setSpended(actualSpending);
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

  const spendingDonut = (
    <DoughnutChart
      title="Spending balance"
      labels={["Spendable", "Spended"]}
      data={[spendingBalance, spended]}
      colors={["#AD0101", "#FAFAFA"]}
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

  const submitTransferSpending = async (
    event: React.FormEvent<HTMLFormElement>,
    value: number
  ) => {
    event.preventDefault();

    await transferSpending(accountId, value);

    console.log(`Transfer spending: ${value}`);
  };

  const submitOTS = (
    event: React.FormEvent<HTMLFormElement>,
    value: number
  ) => {
    event.preventDefault();

    console.log(`Submit one time spend: ${value}`);
  };

  const submitRecurringSpending = (
    event: React.FormEvent<HTMLFormElement>,
    value: number
  ) => {
    event.preventDefault();
    console.log(`Set recurring spending: ${value}`);
  };

  const inputs = [
    <Input
      key={1}
      title="Transfer spending"
      handleSubmit={submitTransferSpending}
    />,
    <Input key={2} title="One time spend" handleSubmit={submitOTS} />,
    <Input
      key={3}
      title="Recurring spending"
      handleSubmit={submitRecurringSpending}
    />,
  ];

  return (
    <div className="spendingDashboardPage">
      <div className="mainDashboardBlocks spendingDashboard numericDashboard">
        <NumericDashboard title="Spending account" value={spendingBalance} />
      </div>
      <div className="mainDashboardBlocks spendedDashboard numericDashboard">
        <NumericDashboard title="Spended" value={spended} />
      </div>
      <div className="mainDashboardBlocks spendingGraph pieChart">
        {spendingDonut}
      </div>
      <div
        className="mainDashboardBlocks spendingLineGraph lineGraph"
        style={{ color: "white" }}
      >
        {" "}
        Transaction graph is not available for milestone 1.
      </div>
      <div className="mainDashboardBlocks spendingInput input">{inputs}</div>
      <div className="mainDashboardBlocks spendingRecurringRecords records"></div>
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
