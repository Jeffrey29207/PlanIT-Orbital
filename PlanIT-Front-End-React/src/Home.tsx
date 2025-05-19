import HomeDashboard from "./components/HomeDashboard/HomeDashboard";
import Menu from "./components/Menu/Menu";
import "./MainStyle.css";
import "bootstrap/dist/css/bootstrap.css";

function Home() {
  return (
    <>
      <Menu />
      <HomeDashboard />
    </>
  );
}

export default Home;
