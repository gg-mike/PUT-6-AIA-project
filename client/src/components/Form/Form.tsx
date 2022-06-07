import "./Form.css";

type FormProps = {
  rows?: number;
  cols?: number;
  hideSubmit?: boolean;
  submitText?: string;
  submitCallback: () => void;
  children?: any;
};

const Form = ({ rows, cols, hideSubmit, submitText, submitCallback, children }: FormProps) => {
  let style: React.CSSProperties = { gridTemplateColumns: "", gridTemplateRows: "", rowGap: "1em", columnGap: "1em" };
  if (rows !== undefined) style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  if (cols !== undefined) {
    style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    if (cols === 1) style.columnGap = "";
  }

  return (
    <div className="Form" style={{ ...style }}>
      {children}
      {hideSubmit !== true && (
        <button id="submit" className="btn-solid" onClick={submitCallback}>
          {submitText ? submitText : "SUBMIT"}
        </button>
      )}
    </div>
  );
};

export default Form;
