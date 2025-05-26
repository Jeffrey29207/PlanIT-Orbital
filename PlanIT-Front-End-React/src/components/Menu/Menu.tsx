import ListOf from "../ListOf";
import "./MenuStyle.css";
import logout from "../../assets/logout.ico";
import menu from "../../assets/menu.svg";
import supabase from "../../helper/config";
import { useNavigate } from "react-router-dom";
import { useState, type ReactElement } from "react";

interface Props {
  links: {
    name: string;
    component: ReactElement;
  }[];
  onSelectItem: (component: ReactElement) => void;
}

function Menu({ links, onSelectItem }: Props) {
  const [clicked, setClicked] = useState(false);

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
      <div className="dropdown">
        <div className="menuIcon" onClick={() => setClicked(!clicked)}>
          <img src={menu} alt="menu" />
        </div>
        {clicked && (
          <ListOf
            links={[
              ...links,
              { name: "LOGOUT", component: links[0].component },
            ]}
            onSelectItem={onSelectItem}
            logoutFunction={handleClickIcon}
          />
        )}
      </div>
      <div className="logoutIcon" onClick={handleClickIcon}>
        <img src={logout} alt="logout" />
      </div>
    </div>
  );
}

export default Menu;
