import DashboardContent from "./DashboardContent/DashboardContent";

interface props {
  title: string;
  value: number;
}

function NumericDashboard({ title, value }: props) {
  return (
    <>
      <DashboardContent title={title} value={"SGD " + value} />
    </>
  );
}

export default NumericDashboard;
