// An abstraction for dashboard components that have one input fields

import "./InputStyle.css";
import DashboardContent from "../DashboardContent/DashboardContent.tsx";
import { useState } from "react";

interface Props {
  title: string;
  handleSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    value: number
  ) => void;
}

function Input({ title, handleSubmit }: Props) {
  const [inputValue, setInputValue] = useState<number | null>(null);

  const inputForm = (
    <form
      className="inputForm"
      onSubmit={(e) => {
        handleSubmit(e, inputValue || 0);
        setInputValue(null);
      }}
    >
      <input
        type="text"
        placeholder={title}
        value={inputValue !== null ? inputValue : ""}
        onChange={(e) =>
          setInputValue(e.target.value ? parseInt(e.target.value) : null)
        }
        className="inputField"
      />
      <button type="submit">Submit</button>
    </form>
  );

  return <DashboardContent title={title} value={inputForm} />;
}

export default Input;
