import Menu from "./components/Menu/Menu";
import "./HomeStyle.css";
import "bootstrap/dist/css/bootstrap.css";
import HomeDashboard from "./components/HomeDashboard/HomeDashboard";
import SavingDashboard from "./components/SavingDashboard/SavingDashboard";
import SpendingDashboard from "./components/SpendingDashboard/SpendingDashboard";
import { type ReactElement, useState, useEffect } from "react";
import supabase from "./helper/Config";
import { getAccountId } from "./helper/BackendAPI";

function Home() {
  const [accountId, setAccountId] = useState<number>(-1);
  const [email, setEmail] = useState<string>("");
  const [dashboard, setDashboard] = useState<ReactElement | null>(null);

  useEffect(() => {
    const fetchAccountId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userId = user?.id;
      const email = user?.email;

      if (userId && email) {
        const accId = await getAccountId(userId);
        setEmail(email);
        setAccountId(accId);
      } else {
        console.log("Account id fetching failed");
      }
    };

    fetchAccountId();
  }, []);

  useEffect(() => {
    accountId >= 0 && setDashboard(<HomeDashboard accountId={accountId} />);
  }, [accountId]);

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
    <div id="homePage">
      <Menu name={email} links={links} onSelectItem={onSelectItem} />
      {dashboard}
    </div>
  );
}

export default Home;
