import "./Loader.css";

const Loader = ({ className }: { className?: string }) => {
  return <div className={`Loader ${className ? className : ""}`}></div>;
};

export default Loader;
