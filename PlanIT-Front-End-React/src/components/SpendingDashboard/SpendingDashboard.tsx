import "./SpendingDashboardStyle.css";
import NumericDashboard from "../NumericDashboard";
import DoughnutChart from "../DoughnutChart";
import LineChart from "../LineChart";
import Table from "../Table/Table";
import Input from "../Input/Input";

function SpendingDashboard() {
  const spendingDonut = (
    <DoughnutChart
      title="Spending balance"
      labels={["Spendable", "Spended"]}
      data={[100000, 0]}
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

  const submitTransferSpending = (
    event: React.FormEvent<HTMLFormElement>,
    value: number
  ) => {
    event.preventDefault();
    console.log(`Transfer spending: ${value}`);
  };

  const submitOTS = (
    event: React.FormEvent<HTMLFormElement>,
    value: number
  ) => {
    event.preventDefault();
    console.log(`Submit one time spend: ${value}`);
  };

  const undoOTS = (event: React.FormEvent<HTMLFormElement>, value: number) => {
    event.preventDefault();
    console.log(`Undo one time spend: ${value}`);
  };

  const submitRecurringSpending = (
    event: React.FormEvent<HTMLFormElement>,
    value: number
  ) => {
    event.preventDefault();
    console.log(`Set recurring spending: ${value}`);
  };

  const inputs = [
    <Input title="Transfer spending" handleSubmit={submitTransferSpending} />,
    <Input title="One time spend" handleSubmit={submitOTS} />,
    <Input title="Undo one time spend" handleSubmit={undoOTS} />,
    <Input title="Recurring spending" handleSubmit={submitRecurringSpending} />,
  ];

  return (
    <div className="spendingDashboardPage">
      <div className="mainDashboardBlocks spendingDashboard numericDashboard">
        <NumericDashboard title="Spending account" value={100000} />
      </div>
      <div className="mainDashboardBlocks spendedDashboard numericDashboard">
        <NumericDashboard title="Spended" value={0} />
      </div>
      <div className="mainDashboardBlocks spendingGraph pieChart">
        {spendingDonut}
      </div>
      <div className="mainDashboardBlocks spendingLineGraph lineGraph">
        {transactionGraph}
      </div>
      <div className="mainDashboardBlocks spendingInput input">{inputs}</div>
      <div className="mainDashboardBlocks spendingRecurringRecords records"></div>
      <div className="mainDashboardBlocks spendingRecords records">
        <Table data={history} />
      </div>
    </div>
  );
}

export default SpendingDashboard;
