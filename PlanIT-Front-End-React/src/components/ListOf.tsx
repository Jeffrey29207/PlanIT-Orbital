interface Props {
  links: {
    name: string;
    url: string;
  }[];
}

function ListOf({ links }: Props) {
  return (
    <ul className="list-group">
      {links.map((link, index) => (
        <li key={index} className="list-group-item">
          {link.name}
        </li>
      ))}
    </ul>
  );
}
export default ListOf;
