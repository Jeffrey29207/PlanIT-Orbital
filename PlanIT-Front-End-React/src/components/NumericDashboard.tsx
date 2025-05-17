import { useState } from "react";

interface props {
  title: string;
  value: number;
  url: string;
}

function NumericDashboard({ title, value, url }: props) {
  const [valueState, setValueState] = useState(value);

  useEffect;

  return (
    <>
      <div className={title}>{title}</div>
      <div className={title + "Value"}>{valueState}</div>
    </>
  );
}

export default NumericDashboard;
