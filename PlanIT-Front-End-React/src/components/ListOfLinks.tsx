interface Props {
  links: {
    name: string;
    url: string;
  }[];
}

function ListOfLinks({ links }: Props) {
  return (
    <ul className="list-group">
      {links.map((link, index) => (
        <li key={index} className="list-group-item">
          <a
            key={index}
            href={link.url}
            target="_self"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
export default ListOfLinks;
