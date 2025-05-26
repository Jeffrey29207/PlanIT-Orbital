import { useState, type ReactElement } from "react";

interface Props {
  links: {
    name: string;
    component: ReactElement;
  }[];
  onSelectItem: (component: ReactElement) => void;
}

function ListOf({ links, onSelectItem }: Props) {
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
