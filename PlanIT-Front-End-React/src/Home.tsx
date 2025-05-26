import HomeDashboard from "./components/HomeDashboard/HomeDashboard";
import Menu from "./components/Menu/Menu";
import "./HomeStyle.css";
import "bootstrap/dist/css/bootstrap.css";
import SavingDashboard from "./components/SavingDashboard/SavingDashboard";
import SpendingDashboard from "./components/SpendingDashboard/SpendingDashboard";

function Home() {
  return (
    <div id="homePage">
      <Menu />
      <SpendingDashboard />
    </div>
  );
}

export default Home;
