import HomeDashboard from "./components/HomeDashboard/HomeDashboard";
import Menu from "./components/Menu/Menu";
import "./HomeStyle.css";
import "bootstrap/dist/css/bootstrap.css";

function Home() {
  return (
    <div id="homePage">
      <Menu />
      <HomeDashboard />
    </div>
  );
}

export default Home;
