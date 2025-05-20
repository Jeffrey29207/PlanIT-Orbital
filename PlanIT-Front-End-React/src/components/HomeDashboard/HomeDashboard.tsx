import "./HomeDashboardStyle.css";

function HomeDashboard() {
  return (
    <div className="dashboard">
      <div className="mainDashboardBlocks overallDashboard numericDashboard"></div>
      <div className="mainDashboardBlocks overallGraph pieChart"></div>
      <div className="mainDashboardBlocks spendingDashboard numericDashboard"></div>
      <div className="mainDashboardBlocks spendingGraph pieChart"></div>
      <div className="mainDashboardBlocks transactionGraph lineChart"></div>
      <div className="mainDashboardBlocks transactionHistory history"></div>
      <div className="mainDashboardBlocks savingDashboard numericDashboard"></div>
      <div className="mainDashboardBlocks savingGraph pieChart"></div>
    </div>
  );
}

export default HomeDashboard;
