import ListOf from "./components/ListOf";
import MainDashboardBlocks from "./components/MainDashboardBlocks";

function App() {
  const links = [
    { name: "HOME", url: "index.html" },
    { name: "SAVING", url: "index.html" },
    { name: "SPENDING", url: "index.html" },
    { name: "SETTINGS", url: "index.html" },
  ];

  const onSelectItem = (name: string) => {
    console.log(`Selected item: ${name}`);
  };

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
        <div className="menuContainer">
          <ListOf links={links} onSelectItem={onSelectItem} />
        </div>
      </div>
      <div className="dashboard">
        <MainDashboardBlocks />
      </div>
    </>
  );
}

export default App;
