import "./SavingDashboardStyle.css";
import NumericDashboard from "../NumericDashboard";
import DoughnutChart from "../DoughnutChart";
import LineChart from "../LineChart";
import Table from "../Table/Table";
import Input from "../Input/Input";
import {
  setSavings,
  transferSaving,
  getSavingBalance,
} from "../../helper/BackendAPI";
import { useEffect, useState } from "react";

interface Props {
  accountId: number;
}

function SavingDashboard({ accountId }: Props) {
  const [savingBalance, setSavingBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await getSavingBalance(accountId);
        setSavingBalance(balance);
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

  const submitSetSaving = async (
    event: React.FormEvent<HTMLFormElement>,
    value: number
  ) => {
    event.preventDefault();

    await setSavings(accountId, value).catch(console.error);

    console.log(`Adding saving: ${value}`);
  };

  const submitTransferSaving = async (
    event: React.FormEvent<HTMLFormElement>,
    value: number
  ) => {
    event.preventDefault();

    await transferSaving(accountId, value).catch(console.error);

    console.log(`Transferring saving: ${value}`);
  };

  const submitSetTargetSaving = (
    event: React.FormEvent<HTMLFormElement>,
    value: number
  ) => {
    event.preventDefault();

    console.log(`Setting target saving: ${value}`);
  };

  const inputs = [
    <Input key={1} title="Set saving" handleSubmit={submitSetSaving} />,
    <Input
      key={2}
      title="Transfer saving"
      handleSubmit={submitTransferSaving}
    />,
    <Input
      key={3}
      title="Set target saving"
      handleSubmit={submitSetTargetSaving}
    />,
  ];

  return (
    <div className="savingDashboardPage">
      <div className="mainDashboardBlocks savingDashboard numericDashboard">
        <NumericDashboard title="Saving account" value={savingBalance} />
      </div>
      <div className="mainDashboardBlocks savingTargetDashboard numericDashboard">
        <NumericDashboard title="Saving target" value={3900000} />
      </div>
      <div className="mainDashboardBlocks savingGraph pieChart">
        {savingDonut}
      </div>
      <div className="mainDashboardBlocks savingLineGraph lineGraph">
        {transactionGraph}
      </div>
      <div className="mainDashboardBlocks savingInput input">{inputs}</div>
      <div className="mainDashboardBlocks savingRecurringRecords records"></div>
      <div className="mainDashboardBlocks savingRecords records">
        <Table data={history} />
      </div>
    </div>
  );
}

export default SavingDashboard;
