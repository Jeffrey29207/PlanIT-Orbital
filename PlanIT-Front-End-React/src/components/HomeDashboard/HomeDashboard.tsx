import "./HomeDashboardStyle.css";
import NumericDashboard from "../NumericDashboard";

function HomeDashboard() {
  return (
    <div className="dashboard">
      <div className="mainDashboardBlocks overallDashboard numericDashboard">
        <NumericDashboard title="Overall dashboard" value={1000000} />
      </div>
      <div className="mainDashboardBlocks overallGraph pieChart"></div>
      <div className="mainDashboardBlocks spendingDashboard numericDashboard">
        <NumericDashboard title="Spending dashboard" value={100000} />
      </div>
      <div className="mainDashboardBlocks spendingGraph pieChart"></div>
      <div className="mainDashboardBlocks transactionGraph lineChart"></div>
      <div className="mainDashboardBlocks transactionHistory history"></div>
      <div className="mainDashboardBlocks savingDashboard numericDashboard">
        <NumericDashboard title="Saving dashboard" value={9900000} />
      </div>
      <div className="mainDashboardBlocks savingGraph pieChart"></div>
    </div>
  );
}

export default HomeDashboard;
