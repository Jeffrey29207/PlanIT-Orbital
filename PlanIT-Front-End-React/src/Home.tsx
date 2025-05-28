import Menu from "./components/Menu/Menu";
import "./HomeStyle.css";
import "bootstrap/dist/css/bootstrap.css";
import HomeDashboard from "./components/HomeDashboard/HomeDashboard";
import SavingDashboard from "./components/SavingDashboard/SavingDashboard";
import SpendingDashboard from "./components/SpendingDashboard/SpendingDashboard";
import { type ReactElement, useState } from "react";
import supabase from "./helper/Config";
import { getAccountId } from "./helper/BackendAPI";

function Home() {
  const [accountId, setAccountId] = useState<number>(-1);

  const fetchAccountId = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id;

    if (userId) {
      const accId = await getAccountId(userId);
      setAccountId(accId);
    } else {
      console.log("Account id fetching failed");
    }
  };

  fetchAccountId();

  const [dashboard, setDashboard] = useState<ReactElement>(
    <HomeDashboard accountId={accountId} />
  );

  const links = [
    { name: "HOME", component: <HomeDashboard accountId={accountId} /> },
    { name: "SAVING", component: <SavingDashboard accountId={accountId} /> },
    {
      name: "SPENDING",
      component: <SpendingDashboard accountId={accountId} />,
    },
  ];

  const onSelectItem = (component: ReactElement) => {
    setDashboard(component);
  };

  return (
    accountId >= 0 && (
      <div id="homePage">
        <Menu links={links} onSelectItem={onSelectItem} />
        {dashboard}
      </div>
    )
  );
}

export default Home;
