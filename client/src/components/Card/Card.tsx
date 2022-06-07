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
    if (user && tournament.rankedPlayers?.includes(user)) return setJoined(true);
    if (tournament.rankedPlayers?.length === tournament.participantsLimit) setInfo("Full");
    else if (CompDates(Date(), tournament.applicationDeadline) === 1) setInfo("Closed");
    else if (CompDates(Date(), tournament.startDate) >= 0) setInfo("Started");
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
              {tournament.rankedPlayers ? tournament.rankedPlayers.length : 0}/{tournament.participantsLimit}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Card;
