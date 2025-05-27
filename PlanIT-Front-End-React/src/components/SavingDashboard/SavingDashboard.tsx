import "./SavingDashboardStyle.css";
import NumericDashboard from "../NumericDashboard";
import DoughnutChart from "../DoughnutChart";
import LineChart from "../LineChart";
import Table from "../Table/Table";
import Input from "../Input/Input";
import RecurringTransactionInputs from "../Input/RecurringTransactionInputs";
import {
  setSavings,
  transferSaving,
  getSavingBalance,
  recurringIncome,
  getRecurringIncome,
  scheduleRecurTransactions,
  deleteRecurringIncome,
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

  const recurringSavingTableHeadings = {
    heading1: "Recurring id",
    heading2: "Description",
    heading3: "Amount",
    heading4: "Next transaction",
  };

  const [recurringSavingTable, setRecurringSavingTable] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecurringIncome = async () => {
      try {
        await scheduleRecurTransactions();
        const data = await getRecurringIncome(accountId);
        const formattedData = data.map((item: any, index: number) => ({
          content1: index + 1,
          content2: item.category,
          content3: item.amount,
          content4: new Date(item.next_run_at).toString(),
        }));
        setRecurringSavingTable(formattedData);
      } catch (error) {
        console.error("Error fetching recurring income:", error);
      }
    };
    fetchRecurringIncome();
    const interval = setInterval(fetchRecurringIncome, 1000); // Realtime update every second
    return () => {
      clearInterval(interval); // Clear the interval on component unmount
    };
  }, [accountId]);

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

    await console.log(
      `Adding recurring transaction: ${amount}, ${category}, ${frequency}, ${interval}, ${next_run_at}`
    );
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

  const recurringInputs = (
    <RecurringTransactionInputs
      key={4}
      title="Add recurring income"
      handleSubmit={submitRecurringTransaction}
    />
  );

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
      <div
        className="mainDashboardBlocks savingLineGraph lineGraph"
        style={{ color: "white" }}
      >
        Saving graph is not available for milestone 1.
      </div>
      <div className="mainDashboardBlocks savingInput input">
        {inputs}
        {recurringInputs}
      </div>
      <div className="mainDashboardBlocks savingRecurringRecords records">
        <Table
          title="Recurring income"
          heading={recurringSavingTableHeadings}
          data={recurringSavingTable}
        />
      </div>
      <div
        className="mainDashboardBlocks savingRecords records"
        style={{ color: "white" }}
      >
        Transaction history table is not available for milestone 1.
      </div>
    </div>
  );
}

export default SavingDashboard;
