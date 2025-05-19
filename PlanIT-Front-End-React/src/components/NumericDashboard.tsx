interface props {
  title: string;
  value: number;
}

function NumericDashboard({ title, value }: props) {
  return (
    <>
      <div className={title}>{title}</div>
      <div className={title + "Value"}>{value}</div>
    </>
  );
}

export default NumericDashboard;
