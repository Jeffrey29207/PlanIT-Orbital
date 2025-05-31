// The landing page where users are directed upon entering the website main URL

import { useNavigate } from "react-router";
import "./LandingPageStyle.css";
import NewsDashboard from "../News/NewsDashboard";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div id="landingPage">
      <div className="landingPageMenuContainer">
        <div className="landingPageImageContainer">
          <img
            className="landingPagePlanITImage"
            src="./PlanIT_logo_nobg.png"
            alt="PlanIT Logo"
          />
        </div>
        <div className="landingPageButtonContainer">
          <div
            className="landingPageButton loginButton"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </div>
          <div
            className="landingPageButton registrationButton"
            onClick={() => {
              navigate("/registration");
            }}
          >
            Register
          </div>
        </div>
      </div>
      <div className="landingPageContent">
        {NewsDashboard() ? <NewsDashboard /> : <h1>Loading...</h1>}
      </div>
    </div>
  );
}

export default LandingPage;
