interface props {
  content1: any;
  content2: any;
  content3: any;
  content4: any;
  button?: string;
  handleClick?: (value: number) => void;
}

function TableData({
  content1,
  content2,
  content3,
  content4,
  button,
  handleClick,
}: props) {
  return (
    <tr>
      <td>{content1}</td>
      <td>{content2}</td>
      <td>{content3}</td>
      <td>{content4}</td>
      {button && handleClick && (
        <td>
          <button className="tableButton" onClick={() => handleClick(content1)}>
            {button}
          </button>
        </td>
      )}
    </tr>
  );
}

export default TableData;
