// An abstraction for savings and spending one time transactions input

import "./OneTimeTransactionInputsStyle.css";
import DashboardContent from "../DashboardContent/DashboardContent";
import { useState } from "react";

interface Props {
  title: string;
  handleSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    amount: number,
    category: string,
    description: string
  ) => void;
}

function OneTimeTransactionInputs({ title, handleSubmit }: Props) {
  const [amount, setAmount] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const inputForm = (
    <form
      className="oneTimeTransactionForm"
      onSubmit={(e) => {
        handleSubmit(e, amount || 0, category, description);
        setAmount(null);
        setCategory("");
        setDescription("");
      }}
    >
      <input
        type="number"
        placeholder="Amount"
        value={amount !== null ? amount : ""}
        onChange={(e) =>
          setAmount(e.target.value ? parseInt(e.target.value) : null)
        }
        className="inputField"
      />
      <input
        type="text"
        placeholder="Category (main|side|misc)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
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

  return <DashboardContent title={title} value={inputForm} />;
}

export default OneTimeTransactionInputs;
