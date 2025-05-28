import "./SavingDashboardStyle.css";
import NumericDashboard from "../NumericDashboard";
import DoughnutChart from "../DoughnutChart";
// import LineChart from "../LineChart"; not in use for milestone1
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
} from "../../helper/BackendAPI";
import { useEffect, useState } from "react";

interface Props {
  accountId: number;
}

function SavingDashboard({ accountId }: Props) {
  //Hanlde numeric dashboard and dougnut chart for saving balance and target saving
  const [savingBalance, setSavingBalance] = useState(0);
  const [savingsTarget, setSavingsTarget] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await getSavingBalance(accountId);
        const target = await getSavingTarget(accountId);
        setSavingBalance(balance);
        setSavingsTarget(target);
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
      data={[savingsTarget - savingBalance, savingBalance]}
      colors={["#FAFAFA", "#00B432"]}
    />
  );

  //-------------------------------------------------------------------------

  /*
   Not in use for Milestone 1
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
  */

  //-------------------------------------------------------------------------

  // Handle recurring saving table
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
        const formattedData = data.map((item: any) => ({
          content1: item.recur_id,
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

  const handleClickForRecurringTableButton = (recurId: number) => {
    deleteRecurringIncome(recurId);
  };

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

  const submitTransferSaving = async (
    event: React.FormEvent<HTMLFormElement>,
    value: number
  ) => {
    event.preventDefault();

    await transferSaving(accountId, value).catch(console.error);

    console.log(`Transferring saving: ${value}`);
  };

  const submitSetSavingTarget = async (
    event: React.FormEvent<HTMLFormElement>,
    value: number
  ) => {
    event.preventDefault();

    await setSavingTarget(accountId, value);

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
  ];

  const recurringInputs = (
    <RecurringTransactionInputs
      key={4}
      title="Add recurring income"
      handleSubmit={submitRecurringTransaction}
    />
  );

  const oneTimeTransactionInputs = (
    <OneTimeTransactionInputs
      key={5}
      title="Add one time income"
      handleSubmit={submitOneTimeTransaction}
    />
  );

  return (
    <div className="savingDashboardPage">
      <div className="mainDashboardBlocks savingDashboard numericDashboard">
        <NumericDashboard title="Saving account" value={savingBalance} />
      </div>
      <div className="mainDashboardBlocks savingTargetDashboard numericDashboard">
        <NumericDashboard title="Saving target" value={savingsTarget} />
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
        {oneTimeTransactionInputs}
      </div>
      <div className="mainDashboardBlocks savingRecurringRecords records">
        <Table
          title="Recurring income"
          heading={recurringSavingTableHeadings}
          data={recurringSavingTable}
          button="Delete"
          handleClick={handleClickForRecurringTableButton}
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
