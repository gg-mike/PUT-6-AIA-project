import { faCheck, faCrown, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../../api";
import { Game, Tournament } from "../../models";
import * as storage from "../../utils/storage";
import "./Bracket.css";

type BracketProps = {
  tournamentId: string;
  game: Game;
  isLevel0: boolean;
  updatePaths: () => void;
};

const getPosition = (pos: number, level: number, isLevel0: boolean) => {
  const baseStep = 5;
  let top = 0;
  if (level === 0) top = pos * baseStep;
  else top = pos * baseStep * Math.pow(2, level - 1) + baseStep * Math.pow(2, level - 2) - baseStep / 2;
  return { top: top + "em", left: (isLevel0 ? level : level - 1) * 20 + "em" };
};

const Bracket = forwardRef<HTMLDivElement, BracketProps>(
  ({ tournamentId, game: _game, isLevel0, updatePaths }, ref) => {
    const user = storage.getUserProfile();
    const [game, setGame] = useState(_game);
    const [isEditable, setEditable] = useState(false);
    const [isEdit, setEdit] = useState(false);
    const [isConfirmed, setConfirmed] = useState<boolean | undefined>(undefined);
    const [winner, setWinner] = useState(game.winner);
    const navigate = useNavigate();

    useEffect(() => {
      if (!user) return;
      if (user.name !== game.playerL && user.name !== game.playerR) return;
      if (game.playerL === "" || game.playerR === "") return;
      if (user.name === game.setBy) return;

      if (game.confirmed === undefined) return setEditable(true);
      if (game.confirmed) return setConfirmed(true);
      setConfirmed(false);
      setWinner(game.winner);
    }, [user, game]);

    const editHandler = () => setEdit(true);
    const confirmHandler = async () => {
      if (isEdit) {
        setEdit(false);
        try {
          await api.setScores(tournamentId, game.idx, user!.name, winner);
        } catch (error) {
          let data = api.errorData(error, navigate);
          if (data?.unAuth) {
            storage.clearUserProfile();
            navigate(`/sign-in/_tournament_${tournamentId}`);
          }
        }
        setEditable(false);
      } else {
        try {
          await api.confirmScores(tournamentId, game.idx, true);
        } catch (error) {
          let data = api.errorData(error, navigate);
          if (data?.unAuth) {
            storage.clearUserProfile();
            navigate(`/sign-in/_tournament_${tournamentId}`);
          }
        }
      }
      updateGame();
    };
    const discardHandler = async () => {
      if (isEdit) {
        setEdit(false);
        setWinner(game.winner);
      } else {
        try {
          await api.confirmScores(tournamentId, game.idx, false);
        } catch (error) {
          let data = api.errorData(error, navigate);
          if (data?.unAuth) {
            storage.clearUserProfile();
            navigate(`/sign-in/_tournament_${tournamentId}`);
          }
        }
        setConfirmed(undefined);
        setEditable(true);
      }
      updateGame();
    };

    const updateGame = async () => {
      try {
        let res = await api.getTournament(tournamentId);
        setGame((res.data as Tournament).games.filter((elem) => elem.idx === game.idx)[0]);
      } catch (error) {
        api.errorData(error, navigate);
      }
    };

    useEffect(() => updatePaths(), [isConfirmed, isEditable]);

    return (
      <div ref={ref} className="Bracket" style={getPosition(game.pos, game.level, isLevel0)}>
        <table>
          <tbody>
            <tr className={game.confirmed === true && game.winner !== game.playerL ? "loser" : ""}>
              <td>{game.playerL}</td>
              {isEdit && (
                <td className="input">
                  <input
                    type="radio"
                    value={game.playerL}
                    name={game.playerL + game.playerR}
                    onChange={(e) => setWinner((e.target as HTMLInputElement).value)}
                  />
                </td>
              )}
              {!isEdit && <td>{winner !== "" && winner === game.playerL && <FontAwesomeIcon icon={faCrown} />}</td>}
              {isEditable && !isEdit && (
                <td>
                  <button className="btn-solid" onClick={editHandler}>
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                </td>
              )}
              {(isConfirmed === false || isEdit) && (
                <td>
                  <button className="btn-solid" onClick={confirmHandler}>
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                </td>
              )}
            </tr>
            <tr className={game.confirmed === true && game.winner !== game.playerR ? "loser" : ""}>
              <td>{game.playerR}</td>
              {isEdit && (
                <td className="input">
                  <input
                    type="radio"
                    value={game.playerR}
                    name={game.playerL + game.playerR}
                    onChange={(e) => setWinner((e.target as HTMLInputElement).value)}
                  />
                </td>
              )}
              {!isEdit && <td>{winner !== "" && winner === game.playerR && <FontAwesomeIcon icon={faCrown} />}</td>}
              {(isConfirmed === false || isEdit) && (
                <td>
                  <button className="btn-solid" onClick={discardHandler}>
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
);

export default Bracket;
