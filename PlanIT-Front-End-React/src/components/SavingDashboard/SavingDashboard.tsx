import "./SavingDashboardStyle.css";
import NumericDashboard from "../NumericDashboard";
import DoughnutChart from "../DoughnutChart";
import LineChart from "../LineChart";
import Table from "../Table/Table";

function SavingDashboard() {
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

  return (
    <div className="savingDashboardPage">
      <div className="mainDashboardBlocks savingDashboard numericDashboard">
        <NumericDashboard title="Saving account" value={900000} />
      </div>
      <div className="mainDashboardBlocks savingTargetDashboard numericDashboard">
        <NumericDashboard title="Saving Target" value={3900000} />
      </div>
      <div className="mainDashboardBlocks savingGraph pieChart">
        {savingDonut}
      </div>
      <div className="mainDashboardBlocks savingLineGraph lineGraph">
        {transactionGraph}
      </div>
      <div className="mainDashboardBlocks savingInput input"></div>
      <div className="mainDashboardBlocks savingRecurringRecords records"></div>
      <div className="mainDashboardBlocks savingRecords records">
        <Table data={history} />
      </div>
    </div>
  );
}

export default SavingDashboard;
