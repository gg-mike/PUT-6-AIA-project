import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as api from "../../api";
import Dropdown from "../../components/Dropdown";
import ErrorMessage from "../../components/ErrorMessage";
import Navbar from "../../components/Navbar";
import { Tournament } from "../../models";
import { StringDate, CompDates } from "../../utils";
import * as storage from "../../utils/storage";
import "./styles.css";

export const Single = () => {
  const [err, setErr] = useState<string | undefined>();
  const [user, setUser] = useState(storage.getUserProfile());
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isJoin, setJoin] = useState<boolean | null>(false);
  const [isEdit, setEdit] = useState(false);
  const [isPopup, setPopup] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const updateTournament = async () => {
    if (id === undefined) return navigate("/");
    try {
      const res = await api.getTournament(id);
      setTournament(res.data as Tournament);
    } catch (error) {
      api.errorData(error, navigate);
      navigate("/");
    }
  };

  useEffect(() => {
    if (err === undefined) return;
    const timer = setTimeout(() => setErr(undefined), 4000);
    return () => clearTimeout(timer);
  }, [err]);

  useEffect(() => {
    updateTournament();
  }, []);

  useEffect(() => {
    if (!tournament) return;

    if (
      CompDates(Date(), tournament.applicationDeadline) === 1 ||
      tournament.rankedPlayers?.length === tournament.participantsLimit
    )
      setJoin(null);
    else {
      if (user && tournament.rankedPlayers?.includes(user._id)) setJoin(false);
      else setJoin(true);
    }
    if (user && tournament?.creator === user._id && CompDates(Date(), tournament.startDate) === -1) setEdit(true);
    else setEdit(false);
  }, [tournament]);

  const editHandler = () => navigate(`/tournament/edit/${tournament!._id!}`);

  const joinHandler = async () => {
    try {
      await api.joinTournament(tournament!._id!, user!._id);
      updateTournament();
    } catch (error) {
      api.errorData(error, navigate);
    }
  };

  const unJoinPopup = () => setPopup(true);

  const unJoinHandler = async () => {
    try {
      await api.unJoinTournament(tournament!._id!, user!._id);
      updateTournament();
      setPopup(false);
    } catch (error) {
      api.errorData(error, navigate);
    }
  };

  const logoutHandler = () => {
    storage.clearUserProfile();
    setUser(null);
  };
  const createTournament = () => navigate("/tournament/create");

  return (
    <>
      <Navbar>
        <div className="Single-controls">
          {isEdit && (
            <button className="btn-solid" onClick={editHandler}>
              EDIT
            </button>
          )}
          {isJoin === true && (
            <button className="btn-solid" onClick={joinHandler}>
              JOIN
            </button>
          )}
          {isJoin === false && (
            <button className={`btn-solid ${isPopup ? "hidden" : ""}`} onClick={unJoinPopup}>
              UNJOIN
            </button>
          )}
        </div>
        {user && (
          <Dropdown className="Navbar-action" mainElement={<button className="btn-solid">{user.name}</button>}>
            <button className="btn-solid" onClick={logoutHandler}>
              LOGOUT
            </button>
            <button className="btn-solid" onClick={createTournament}>
              CREATE TOURNAMENT
            </button>
          </Dropdown>
        )}
        {user === null && (
          <Link className="Navbar-action" to="/sign-up">
            <button className="btn-solid">SIGN UP</button>
          </Link>
        )}
      </Navbar>
      {isPopup && (
        <div className="Popup">
          <p className="p-c">
            Do really want to unjoin the tournament?
            <br />
            <br />
          </p>
          <div className="Popup-controls fr">
            <button className="btn-solid" onClick={() => setPopup(false)}>
              NO
            </button>
            <button className="btn-solid" onClick={unJoinHandler}>
              YES
            </button>
          </div>
        </div>
      )}
      <div className={`Content Single-content ${isPopup ? "blur" : ""} fr`}>
        <ErrorMessage err={err} />
        <div className="Single-part Single-info fc">
          <div className="Single-info-main fr">
            <div className="fr">
              <h2>{tournament?.name}</h2>
              <h3>{tournament?.discipline}</h3>
            </div>
            <div className="fr">
              <h3>{tournament?.organizer}</h3>
              <button className="btn-thin" onClick={() => window.open(tournament?.location)}>
                <h3>
                  <span>Location </span>
                  <FontAwesomeIcon icon={faLocationDot} />
                </h3>
              </button>
            </div>
          </div>
          <div className="Single-details fr">
            <div className="Single-detail">
              <h3>Start date</h3>
              <h3 className="Single-date">{StringDate(tournament?.startDate)}</h3>
            </div>
            <div className="Single-detail">
              <h3>Application deadline</h3>
              <h3 className="Single-date">{StringDate(tournament?.applicationDeadline)}</h3>
            </div>
            <div className="Single-detail">
              <h3>Participants</h3>
              <h3>
                {tournament?.rankedPlayers ? tournament.rankedPlayers.length : 0}/{tournament?.participantsLimit}
              </h3>
            </div>
          </div>
        </div>
        <div className="Single-part Single-games">GAMES</div>
        {tournament?.sponsorsLogos && (
          <div className="Single-part Single-sponsors fc">
            <img src={tournament.sponsorsLogos} alt="Sponsors logos" />
          </div>
        )}
      </div>
    </>
  );
};
