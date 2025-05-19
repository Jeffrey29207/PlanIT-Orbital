import HomeDashboard from "./components/HomeDashboard/HomeDashboard";
import Menu from "./components/Menu/Menu";
import "./HomeStyle.css";
import "bootstrap/dist/css/bootstrap.css";

function Home() {
  return (
    <div className="afterLogin">
      <Menu />
      <HomeDashboard />
    </div>
  );
}

export default Home;
