import "./HomeDashboardStyle.css";
import NumericDashboard from "../NumericDashboard";
import DoughnutChart from "../DoughnutChart";
import LineChart from "../LineChart";
import Table from "../Table/Table";

function HomeDashboard() {
  const overallDonut = (
    <DoughnutChart
      title="Overall balance"
      labels={["Spending", "Saving"]}
      data={[100000, 900000]}
      colors={["#AD0101", "#00B432"]}
    />
  );

  const spendingDonut = (
    <DoughnutChart
      title="Spending balance"
      labels={["Spendable", "Spended"]}
      data={[100000, 0]}
      colors={["#AD0101", "#FAFAFA"]}
    />
  );

  const savingDonut = (
    <DoughnutChart
      title="Saving balance"
      labels={["Target", "Saved"]}
      data={[3000000, 900000]}
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
        <NumericDashboard title="Overall account" value={1000000} />
      </div>
      <div className="mainDashboardBlocks overallGraph pieChart">
        {overallDonut}
      </div>
      <div className="mainDashboardBlocks spendingDashboard numericDashboard">
        <NumericDashboard title="Spending account" value={100000} />
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
        <NumericDashboard title="Saving account" value={900000} />
      </div>
      <div className="mainDashboardBlocks savingGraph pieChart">
        {savingDonut}
      </div>
    </div>
  );
}

export default HomeDashboard;
