import Menu from "./components/Menu/Menu";
import "./HomeStyle.css";
import "bootstrap/dist/css/bootstrap.css";
import HomeDashboard from "./components/HomeDashboard/HomeDashboard";
import SavingDashboard from "./components/SavingDashboard/SavingDashboard";
import SpendingDashboard from "./components/SpendingDashboard/SpendingDashboard";
import { type ReactElement, useState } from "react";

function Home() {
  const [dashboard, setDashboard] = useState<ReactElement>(<HomeDashboard />);

  const links = [
    { name: "HOME", component: <HomeDashboard /> },
    { name: "SAVING", component: <SavingDashboard /> },
    { name: "SPENDING", component: <SpendingDashboard /> },
  ];

  const onSelectItem = (component: ReactElement) => {
    setDashboard(component);
  };

  return (
    <div id="homePage">
      <Menu links={links} onSelectItem={onSelectItem} />
      {dashboard}
    </div>
  );
}

export default Home;
