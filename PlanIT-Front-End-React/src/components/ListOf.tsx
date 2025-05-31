// An abstraction for list of items

import { useState, type ReactElement } from "react";

interface Props {
  links: {
    name: string;
    component: ReactElement;
  }[];
  onSelectItem: (component: ReactElement) => void;
  logoutFunction?: () => void;
}

function ListOf({ links, onSelectItem, logoutFunction }: Props) {
  const [selectedItem, setSelectedItem] = useState(0);

  return (
    <ul className="list-group">
      {links.map((link, index) => (
        <li
          key={index}
          className={
            index === selectedItem ? "list-group-item click" : "list-group-item"
          }
          onClick={() => {
            if (link.name === "LOGOUT") {
              if (logoutFunction) {
                logoutFunction();
              }
            }
            setSelectedItem(index);
            onSelectItem(link.component);
          }}
        >
          {link.name}
        </li>
      ))}
    </ul>
  );
}
export default ListOf;
