import ListOf from "../ListOf";
import "./MenuStyle.css";
import logout from "../../assets/logout.ico";
import supabase from "../../helper/config";
import { useNavigate } from "react-router-dom";

function Menu() {
  const links = [
    { name: "HOME", url: "index.html" },
    { name: "SAVING", url: "index.html" },
    { name: "SPENDING", url: "index.html" },
  ];

  const onSelectItem = (name: string) => {
    console.log(`Selected item: ${name}`);
  };

  const navigate = useNavigate();

  // Function to handle logout
  const handleClickIcon = async () => {
    // Supabase function to log out a user
    console.log("Clicked");
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
      return;
    }
    navigate("/");
  };

  return (
    <div className="menu">
      <div className="profileContainer">
        <img src="./Trump_Cropped.png" alt="Donald Trump"></img>
        <div className="profileName">
          <p className="name">D. J. Trump</p>
          <p className="tier">Private Client</p>
        </div>
      </div>
      <div className="menuContainer">
        <ListOf links={links} onSelectItem={onSelectItem} />
      </div>
      <div className="menuIcon" onClick={handleClickIcon}>
        <img src={logout} alt="menu" />
      </div>
    </div>
  );
}

export default Menu;
