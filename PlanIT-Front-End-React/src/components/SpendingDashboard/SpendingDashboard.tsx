import "./SpendingDashboardStyle.css";
import NumericDashboard from "../NumericDashboard";
import DoughnutChart from "../DoughnutChart";
import LineChart from "../LineChart";
import Table from "../Table/Table";

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
      <div className="mainDashboardBlocks spendingInput input"></div>
      <div className="mainDashboardBlocks spendingRecurringRecords records"></div>
      <div className="mainDashboardBlocks spendingRecords records">
        <Table data={history} />
      </div>
    </div>
  );
}

export default SpendingDashboard;
