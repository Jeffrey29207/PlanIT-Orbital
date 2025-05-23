import DashboardContent from "../DashboardContent/DashboardContent";
import "./TableStyle.css";
import TableData from "./TableData";

interface props {
  data: {
    id: number;
    date: string;
    type: string;
    amount: string;
  }[];
}

function Table({ data }: props) {
  const dummy = (
    <table id="table">
      <thead className="tableHeader">
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Type</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <TableData
            key={item.id}
            id={item.id}
            date={item.date}
            type={item.type}
            amount={item.amount}
          />
        ))}
      </tbody>
    </table>
  );
  return (
    <>
      <DashboardContent title="Transaction History" value={dummy} />
    </>
  );
}

export default Table;
