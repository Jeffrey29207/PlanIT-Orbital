import "./RecurringTransactionInputsStyle.css";
import DashboardContent from "../DashboardContent/DashboardContent";
import { useState } from "react";

interface Props {
  title: string;
  handleSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    amount: number,
    category: string,
    frequency: string,
    interval: number,
    next_run_at: string
  ) => void;
}

function RecurringTransactionInputs({ title, handleSubmit }: Props) {
  const [amount, setAmount] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("");
  const [interval, setInterval] = useState<number | null>(null);
  const [nextRunAt, setNextRunAt] = useState<string>("");

  const inputForm = (
    <form
      className="recurringTransactionForm"
      onSubmit={(e) => {
        handleSubmit(
          e,
          amount || 0,
          category,
          frequency,
          interval || 0,
          nextRunAt
        );
        setAmount(null);
        setCategory("");
        setFrequency("");
        setInterval(null);
        setNextRunAt("");
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
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="inputField"
      />
      <input
        type="text"
        placeholder="Frequency (e.g., daily, weekly)"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="inputField"
      />
      <input
        type="number"
        placeholder="Interval (in days)"
        value={interval !== null ? interval : ""}
        onChange={(e) =>
          setInterval(e.target.value ? parseInt(e.target.value) : null)
        }
        className="inputField"
      />
      <input
        type="date"
        placeholder="Next Run At"
        value={nextRunAt}
        onChange={(e) => setNextRunAt(e.target.value)}
        className="inputField"
      />
      <button type="submit">Submit</button>
    </form>
  );

  return <DashboardContent title={title} value={inputForm} />;
}
export default RecurringTransactionInputs;
