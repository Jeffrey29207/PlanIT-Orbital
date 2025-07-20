import "./InputPopUpStyle.css";

interface Props {
  title: string;
  message: string;
  form: any;
}

function InputPopUp({ title, message, form }: Props) {
  return (
    <div id="inputPopUpBox">
      <h2 className="inputPopUpMessage">{title}</h2>
      <span className="inputPopUpMessage">{message}</span>
      {form}
    </div>
  );
}

export default InputPopUp;
