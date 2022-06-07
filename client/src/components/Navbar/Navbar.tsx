import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ children }: any) => {
  return (
    <div className="Navbar fr">
      <Link className="Navbar-title" to="/">
        <h1>Online tournaments</h1>
      </Link>
      {children}
    </div>
  );
};

export default Navbar;
