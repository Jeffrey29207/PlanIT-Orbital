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
        key={1}
        type="number"
        placeholder="Amount"
        value={amount !== null ? amount : ""}
        onChange={(e) =>
          setAmount(e.target.value ? parseInt(e.target.value) : null)
        }
        className="inputField"
      />
      <input
        key={2}
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="inputField"
      />
      <input
        key={3}
        type="text"
        placeholder="Frequency (min|hour|day|week|month)"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="inputField"
      />
      <input
        key={4}
        type="number"
        placeholder="Interval"
        value={interval !== null ? interval : ""}
        onChange={(e) =>
          setInterval(e.target.value ? parseInt(e.target.value) : null)
        }
        className="inputField"
      />
      <input
        key={5}
        type="text"
        placeholder="Next Run At (YYYY-MM-DD hh:mm:ss)"
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
