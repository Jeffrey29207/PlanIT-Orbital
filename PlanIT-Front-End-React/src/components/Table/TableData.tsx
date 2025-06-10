// An abstraction for table rows that store data

interface props {
  content1: any;
  content2: any;
  content3: any;
  content4: any;
  button?: string;
  handleClick?: (value: number) => void;
  option?: string;
  handleClickWithOption?: (value: number, option: string) => void;
}

function TableData({
  content1,
  content2,
  content3,
  content4,
  button,
  handleClick,
  option,
  handleClickWithOption,
}: props) {
  return (
    <tr>
      <td>{content1}</td>
      <td>{content2}</td>
      <td>{content3}</td>
      <td>{content4}</td>
      {button && (
        <td>
          <button
            className="tableButton"
            onClick={
              option && handleClickWithOption
                ? () => handleClickWithOption(content1, option)
                : handleClick
                ? () => handleClick(content1)
                : undefined
            }
          >
            {button}
          </button>
        </td>
      )}
    </tr>
  );
}

export default TableData;
