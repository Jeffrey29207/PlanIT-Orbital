import "./HomeDashboardStyle.css";
import NumericDashboard from "../NumericDashboard";
import DoughnutChart from "../DoughnutChart";

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
      <div className="mainDashboardBlocks transactionGraph lineChart"></div>
      <div className="mainDashboardBlocks transactionHistory history"></div>
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
