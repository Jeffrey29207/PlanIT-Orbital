// The landing page where users are directed upon entering the website main URL

import LandingPageMenuContainer from "./LandingPageMenuContainer.tsx";
import "./LandingPageStyle.css";
import NewsDashboard from "../News/NewsDashboard.tsx";

function LandingPage() {
  return (
    <div id="landingPage">
      <LandingPageMenuContainer />
      <div className="landingPageContent">
        {NewsDashboard() ? <NewsDashboard /> : <h1>Loading...</h1>}
      </div>
    </div>
  );
}

export default LandingPage;
