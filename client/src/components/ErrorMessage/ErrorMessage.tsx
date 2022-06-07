import "./ErrorMessage.css";

const ErrorMessage = ({ err }: { err?: string }) => {
  return err ? <div className="ErrorMessage">{err}</div> : <></>;
};

export default ErrorMessage;
