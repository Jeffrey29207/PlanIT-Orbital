// An abstraction for tables

import DashboardContent from "../DashboardContent/DashboardContent";
import "./TableStyle.css";
import TableData from "./TableData";

interface props {
  title: string;
  heading: {
    heading1: string;
    heading2: string;
    heading3: string;
    heading4: string;
  };
  data: {
    content1: any;
    content2: any;
    content3: any;
    content4: any;
  }[];
  button?: string;
  handleClick?: (value: number) => void;
}

function Table({ title, heading, data, button, handleClick }: props) {
  const { heading1, heading2, heading3, heading4 } = heading;

  const content = (
    <table id="table">
      <thead className="tableHeader">
        <tr>
          <th>{heading1}</th>
          <th>{heading2}</th>
          <th>{heading3}</th>
          <th>{heading4}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <TableData
            key={index}
            content1={item.content1}
            content2={item.content2}
            content3={item.content3}
            content4={item.content4}
            button={button}
            handleClick={handleClick}
          />
        ))}
      </tbody>
    </table>
  );
  return (
    <>
      <DashboardContent title={title} value={content} />
    </>
  );
}

export default Table;
