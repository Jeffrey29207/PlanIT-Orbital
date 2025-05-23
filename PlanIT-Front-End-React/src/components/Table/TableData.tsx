interface props {
  id: number;
  date: string;
  type: string;
  amount: string;
}

function TableData({ id, date, type, amount }: props) {
  return (
    <tr>
      <td>{id}</td>
      <td>{date}</td>
      <td>{type}</td>
      <td>{amount}</td>
    </tr>
  );
}

export default TableData;
