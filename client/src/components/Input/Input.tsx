import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getValidator, updateSubmitBtn, getClasses, setValid } from "./InputUtils";
import "./Input.css";

type InputProps = {
  name?: string;
  type?: string;
  className?: string;
  init?: string;
  min?: number;
  max?: number;
  required?: boolean;
  regex?: string;
  update: (data?: string) => void;
};

const Input = ({ name, type, className, init, min, max, required, regex, update }: InputProps) => {
  const [value, setValue] = useState(init ? init : "");
  const [first, setFirst] = useState(true);
  const [labelText, setLabelText] = useState(name);
  const [isShow, setShow] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const validate = getValidator(type ? type : "text", min, max, required, regex);

  useEffect(() => (required && !init ? getClasses(ref)?.add("not-set") : undefined), []);

  useEffect(() => {
    let ret = "";

    if (first) setFirst(false);
    else {
      getClasses(ref)?.remove("not-set");
      ret = validate ? validate(value) : "";
    }

    setLabelText(ret ? ret : name);
    setValid(ref, !ret);

    update(ret ? undefined : ref.current!.value);
    updateSubmitBtn();
  }, [value]);

  return (
    <div className={`Input ${className ? className : ""}`}>
      <div>
        <input
          ref={ref}
          placeholder={name}
          type={type && !isShow ? type : "text"}
          onChange={(e: ChangeEvent) => setValue((e.target as any).value)}
          value={value}
        />
        <label>{labelText}</label>
      </div>
      {type === "password" && (
        <button className="btn-solid" onClick={() => setShow((isShow) => !isShow)}>
          <FontAwesomeIcon icon={isShow ? faEyeSlash : faEye} />
        </button>
      )}
    </div>
  );
};

export default Input;
