import DashboardContent from "../DashboardContent/DashboardContent";
import "./TableStyle.css";

function Table() {
  const dummy = (
    <table id="table">
      <thead className="tableHeader">
        <tr>
          <th>ID</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Deposit</td>
          <td>$1000</td>
          <td>2023-10-01</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Withdrawal</td>
          <td>$500</td>
          <td>2023-10-02</td>
        </tr>
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
