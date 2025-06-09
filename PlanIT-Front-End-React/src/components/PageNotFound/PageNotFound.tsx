import "./PageNotFoundStyle.css";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div id="pageNotFound">
      <h1 className="errorMessage">404</h1>
      <h2 className="errorMessage">Page Not Found</h2>
      <button className="goBackButton" onClick={() => navigate("/home")}>
        Back
      </button>
    </div>
  );
}

export default PageNotFound;
