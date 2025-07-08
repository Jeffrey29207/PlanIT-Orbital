import { useNavigate } from "react-router";
import "./LandingPageMenuContainerStyle.css";

function LandingPageMenuContainer() {
  const navigate = useNavigate();

  return (
    <div className="landingPageMenuContainer">
      <div className="landingPageImageContainer">
        <img
          className="landingPagePlanITImage"
          src="./PlanIT_logo_nobg.png"
          alt="PlanIT Logo"
          onClick={() => {
            navigate("/");
          }}
        />
      </div>
      <div className="landingPageButtonContainer">
        <div
          className={"landingPageButton loginButton"}
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
  );
}

export default LandingPageMenuContainer;
