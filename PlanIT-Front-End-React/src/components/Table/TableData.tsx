interface props {
  content1: any;
  content2: any;
  content3: any;
  content4: any;
}

function TableData({ content1, content2, content3, content4 }: props) {
  return (
    <tr>
      <td>{content1}</td>
      <td>{content2}</td>
      <td>{content3}</td>
      <td>{content4}</td>
    </tr>
  );
}

export default TableData;
