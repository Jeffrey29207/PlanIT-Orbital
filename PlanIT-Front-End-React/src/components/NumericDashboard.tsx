interface props {
  title: string;
  value: number;
}

function NumericDashboard({ title, value }: props) {
  return (
    <>
      <p className="numericDashboardTitle">{title}</p>
      <div className="numericValueContainer">
        <div className="numericValue">{"SGD " + value}</div>
      </div>
    </>
  );
}

export default NumericDashboard;
