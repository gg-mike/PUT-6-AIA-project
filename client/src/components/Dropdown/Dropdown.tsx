import "./Dropdown.css";

type DropdownProps = {
  className?: string;
  mainElement: JSX.Element;
  children: any;
};

const Dropdown = ({ className, mainElement, children }: DropdownProps) => {
  return (
    <div className={`Dropdown ${className ? className : ""}`}>
      {mainElement}
      <div className="Dropdown-list">{children}</div>
    </div>
  );
};

export default Dropdown;
