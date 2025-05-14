import ListOfLinks from "./components/ListOfLinks";

function App() {
  const links = [
    { name: "HOME", url: "index.html" },
    { name: "SAVING", url: "index.html" },
    { name: "SPENDING", url: "index.html" },
    { name: "SETTINGS", url: "index.html" },
  ];

  return (
    <>
      <div className="menu">
        <div className="profileContainer">
          <img src="./Trump_Cropped.png" alt="Donald Trump"></img>
          <div className="profileName">
            <p className="name">D. J. Trump</p>
            <p className="tier">Private Client</p>
          </div>
        </div>
        <div className="menuContainer">{ListOfLinks({ links })}</div>
      </div>
      <div className="dashboard">
        <div className="mainDashboardBlocks overallDashboard"></div>
        <div className="mainDashboardBlocks overallGraph"></div>
        <div className="mainDashboardBlocks spendingDashboard"></div>
        <div className="mainDashboardBlocks transactionGraph"></div>
        <div className="mainDashboardBlocks savingDashboard"></div>
        <div className="mainDashboardBlocks savingGraph"></div>
        <div className="mainDashboardBlocks transactionHistory"></div>
      </div>
    </>
  );
}

export default App;
