// An abstraction for savings and spending recurring transactions input

import "./RecurringTransactionInputsStyle.css";
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
    frequency: string,
    interval: number,
    next_run_at: string
  ) => void;
}

function RecurringTransactionInputs({
  title,
  information,
  handleSubmit,
}: Props) {
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("");
  const [interval, setInterval] = useState<number | "">("");
  const [nextRunAt, setNextRunAt] = useState<string>("");

  const inputForm = (
    <form
      className="recurringTransactionForm"
      onSubmit={(e) => {
        if (
          amount === "" &&
          category === "" &&
          frequency === "" &&
          interval === "" &&
          nextRunAt == ""
        ) {
          e.preventDefault();
          toast.error("No input is given to the recurring form");
        } else {
          if (
            frequency === "min" ||
            frequency === "hour" ||
            frequency === "day" ||
            frequency === "week" ||
            frequency === "month"
          ) {
            const dateTimeFormat = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
            if (dateTimeFormat.test(nextRunAt)) {
              handleSubmit(
                e,
                amount || 0,
                category,
                frequency,
                interval || 0,
                nextRunAt
              );
              setAmount("");
              setCategory("");
              setFrequency("");
              setInterval("");
              setNextRunAt("");
            } else {
              e.preventDefault();
              toast.error("Invalid argument for recurring next running time");
              setAmount("");
              setCategory("");
              setFrequency("");
              setInterval("");
              setNextRunAt("");
            }
          } else {
            e.preventDefault();
            toast.error("Invalid argument for recurring frequency");
            setAmount("");
            setCategory("");
            setFrequency("");
            setInterval("");
            setNextRunAt("");
          }
        }
      }}
    >
      <input
        key={1}
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
        key={2}
        type="text"
        placeholder="Description"
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
        type="text"
        placeholder="Interval"
        value={interval !== null ? interval : ""}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "") {
            setInterval("");
          } else if (isNaN(parseInt(e.target.value))) {
            toast.error("Argument must be a number");
            setInterval("");
          } else {
            setInterval(e.target.value ? parseInt(e.target.value) : "");
          }
        }}
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

  return (
    <>
      <InputPopUp title={title} message={information} form={inputForm} />
      <ToastContainer position="top-center" />
    </>
  );
}
export default RecurringTransactionInputs;
