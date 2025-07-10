// An abstraction for savings and spending one time transactions input

import "./OneTimeTransactionInputsStyle.css";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputPopUp from "../InputPopUp/InputPopUp.tsx";

interface Props {
  title: string;
  information: string;
  handleSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    amount: number,
    category: string,
    description: string
  ) => void;
}

function OneTimeTransactionInputs({ title, information, handleSubmit }: Props) {
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const inputForm = (
    <form
      className="oneTimeTransactionForm"
      onSubmit={(e) => {
        if (amount === "" && category === "" && description === "") {
          e.preventDefault();
          toast.error("No input is given to the one time form");
        } else if (
          category === "main" ||
          category === "side" ||
          category === "misc"
        ) {
          handleSubmit(e, amount || 0, category, description);
          setAmount("");
          setCategory("");
          setDescription("");
        } else {
          e.preventDefault();
          toast.error("Invalid argument for one time category");
          setAmount("");
          setCategory("");
          setDescription("");
        }
      }}
    >
      <input
        type="text"
        placeholder="Amount"
        value={amount !== null ? amount : ""}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "") {
            setAmount("");
          } else if (isNaN(parseInt(e.target.value))) {
            toast.error("Argument must be a number");
            setAmount("");
          } else {
            setAmount(e.target.value ? parseInt(e.target.value) : "");
          }
        }}
        className="inputField"
      />
      <input
        type="text"
        placeholder="Category (main|side|misc)"
        value={category}
        onChange={(e) => setCategory(e.target.value.trim())}
        className="inputField"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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

export default OneTimeTransactionInputs;
