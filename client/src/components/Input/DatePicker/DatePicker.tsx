import { ChangeEvent, useEffect, useRef, useState } from "react";
import { updateSubmitBtn, getClasses, setValid } from "../InputUtils";
import { CompDates, StringDate } from "../../../utils/date";
import "./DatePicker.css";

type DatePickerProps = {
  name?: string;
  className?: string;
  init?: string;
  min?: string;
  required?: boolean;
  update: (data?: string) => void;
};

const DatePicker = ({ name, className, init, min, required, update }: DatePickerProps) => {
  const [value, setValue] = useState(init ? init : "");
  const [first, setFirst] = useState(true);
  const [labelText, setLabelText] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => (required && !init ? getClasses(ref)?.add("not-set") : undefined), []);

  useEffect(() => {
    let ret = "";

    if (first) setFirst(false);
    else {
      getClasses(ref)?.remove("not-set");
      if (required && value === "") ret = "This field is required";
      if (min && CompDates(value, min) === -1) ret = `At least ${StringDate(min)}`;
    }

    setLabelText(ret ? ret : "");
    setValid(ref, !ret);

    update(value);
    updateSubmitBtn();
  }, [value]);

  return (
    <div className={`DatePicker fr ${className ? className : ""}`}>
      <div>{name}</div>
      <div>
        <input ref={ref} type="date" onChange={(e: ChangeEvent) => setValue((e.target as any).value)} value={value} />
        <label>{labelText}</label>
      </div>
    </div>
  );
};

export default DatePicker;
