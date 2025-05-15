import ListOfLinks from "./components/ListOfLinks";
import mainDashboardBlocks from "./components/MainDashboard";

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
      <div className="dashboard">{mainDashboardBlocks()}</div>
    </>
  );
}

export default App;
