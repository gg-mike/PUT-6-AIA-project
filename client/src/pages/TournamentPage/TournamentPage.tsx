import { useParams, Navigate } from "react-router-dom";
import "./TournamentPage.css";

const TournamentPage = () => {
  const { name } = useParams();

  if (name === "home") return <Navigate to="/" />;

  return <div className="TournamentPage">Tournament: {name}</div>;
};

export default TournamentPage;
