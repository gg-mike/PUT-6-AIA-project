import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorMessage from "../ErrorMessage";
import Loader from "../Loader";
import "./Container.css";

type ContainerProps = {
  subtitle?: string;
  error?: string;
  backContentBtn?: boolean;
  loading?: boolean;
  children?: any;
};

const Container = ({ subtitle, error, backContentBtn, loading, children }: ContainerProps) => {
  const [err, setErr] = useState<string | undefined>();

  useEffect(() => setErr(error), [error]);

  useEffect(() => {
    if (err === undefined) return;
    const timer = setTimeout(() => setErr(undefined), 4000);
    return () => clearTimeout(timer);
  }, [err]);

  return (
    <>
      {loading && (
        <div className="Container-load">
          <Loader />
        </div>
      )}
      {!loading && (
        <div className="Container">
          <Link className="Container-back" to="/">
            <button className="btn-thin">
              <FontAwesomeIcon icon={faAngleLeft} />
              <span>Back to main page</span>
            </button>
          </Link>
          <div className="Container-content">
            <h1 className="Container-title">Online tournaments</h1>
            {subtitle && <h2 className="Container-title">{subtitle}</h2>}
            <ErrorMessage err={err} />
            {children}
            {backContentBtn && (
              <Link className="Container-content-back" to="/">
                <button className="btn-solid">GO BACK TO MAIN PAGE</button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Container;
