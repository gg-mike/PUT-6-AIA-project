import { StringDate, CompDates } from "../../utils/date";
import { Tournament } from "../../models";
import "./Card.css";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

type CardProps = {
  tournament: Tournament;
  user?: string;
};

const Card = ({ tournament, user }: CardProps) => {
  const [info, setInfo] = useState("");
  const [joined, setJoined] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && tournament.players.includes(user)) return setJoined(true);

    if (tournament.games.length && !tournament.games.filter((elem) => elem.winner === "").length)
      return setInfo("Ended");
    if (CompDates(Date(), tournament.startDate) >= 0) return setInfo("Started");
    if (tournament.players.length === tournament.participantsLimit) return setInfo("Full");
    if (CompDates(Date(), tournament.applicationDeadline) === 1) return setInfo("Closed");
  }, []);

  return (
    <div className="Card" onClick={() => navigate(`/tournament/${tournament._id}`)}>
      {joined && (
        <div className="Card-info" style={{ backgroundColor: "green" }}>
          JOINED
        </div>
      )}
      {info && !joined && (
        <div className="Card-info" style={{ backgroundColor: "var(--primary-ld)" }}>
          {info}
        </div>
      )}
      <h2>{tournament.name}</h2>
      <table>
        <tbody>
          <tr>
            <td>{tournament.discipline}</td>
            <td>{tournament.organizer}</td>
          </tr>
          <tr>
            <td>Start date</td>
            <td>{StringDate(tournament.startDate)}</td>
          </tr>
          <tr>
            <td>Applications deadline</td>
            <td>{StringDate(tournament.applicationDeadline)}</td>
          </tr>
          <tr>
            <td>Participants</td>
            <td>
              {tournament.players.length}/{tournament.participantsLimit}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Card;
