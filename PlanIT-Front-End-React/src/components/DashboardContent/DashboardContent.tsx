import "./DashboardContentStyle.css";

interface props {
  title: string;
  value: any;
}

function DashboardContent({ title, value }: props) {
  return (
    <>
      <p className="dashboardTitle">{title}</p>
      <div
        className={
          typeof value == "string" ? "valueContainer" : "chartContainer"
        }
      >
        <div className={typeof value == "string" ? "value" : "chart"}>
          {value}
        </div>
      </div>
    </>
  );
}

export default DashboardContent;
