import "./DashboardContentStyle.css";

interface props {
  title: string;
  value: any;
}

function DashboardContent({ title, value }: props) {
  return (
    <>
      <p className="dashboardTitle">{title}</p>
      <div className="valueContainer">
        <div className="value">{value}</div>
      </div>
    </>
  );
}

export default DashboardContent;
