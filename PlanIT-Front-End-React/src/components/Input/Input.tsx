// An abstraction for dashboard components that have one input fields

import "./InputStyle.css";
import InputPopUp from "../InputPopUp/InputPopUp.tsx";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  title: string;
  information: string;
  handleSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    value: number
  ) => void;
}

function Input({ title, information, handleSubmit }: Props) {
  const [inputValue, setInputValue] = useState<number | "">("");

  const inputForm = (
    <form
      className="inputForm"
      onSubmit={(e) => {
        if (inputValue === "") {
          e.preventDefault();
          toast.error("No input is given to the form");
        } else {
          handleSubmit(e, inputValue || 0);
          setInputValue("");
        }
      }}
    >
      <input
        type="text"
        placeholder={title}
        value={inputValue !== null ? inputValue : ""}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "") {
            setInputValue("");
          } else if (isNaN(parseInt(e.target.value))) {
            toast.error("Argument must be a number");
            setInputValue("");
          } else {
            setInputValue(e.target.value ? parseInt(e.target.value) : "");
          }
        }}
        className="inputField"
      />
      <button type="submit">Submit</button>
    </form>
  );

  return (
    <>
      <InputPopUp title={title} message={information} form={inputForm} />
      <ToastContainer position="top-center" />
    </>
  );
}

export default Input;
