import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../../api";
import Card from "../../components/Card";
import Dropdown from "../../components/Dropdown";
import Navbar from "../../components/Navbar";
import Search from "../../components/Search";
import { Tournament } from "../../models";
import * as storage from "../../utils/storage";
import "./Main.css";

const chunk = (arr: Array<any>, n: number = 8) => {
  const res: Array<any> = [];
  for (let i = 0; i < arr.length; i += n) res.push(arr.slice(i, i + n));
  return res;
};

const Main = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(storage.getUserProfile());
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [chunks, setChunks] = useState<Tournament[][]>([]);
  const [activeChunk, setActiveChunk] = useState<Tournament[]>([]);
  const [currPage, setCurrPage] = useState(0);
  const [isUpcomming, setUpcomming] = useState(false);
  const navigate = useNavigate();

  const updateTournaments = () => {
    const filtered = tournaments.filter((elem) => search === "" || elem.name.toLowerCase().includes(search));
    const upcomming = filtered.filter((elem) => !isUpcomming || elem.rankedPlayers?.includes(user!._id));
    const sorted = upcomming.sort((a, b) => Number(a.name > b.name));
    setChunks(chunk(sorted));
  };

  const updateChunk = () => {
    if (chunks.length === 0) return setActiveChunk([]);
    setCurrPage(0);
    setActiveChunk(chunks[0]);
  };
  const updatePage = () => (currPage < chunks.length ? setActiveChunk(chunks[currPage]) : undefined);

  const load = async () => {
    try {
      let res = await api.getTournaments();
      setTournaments(res.data as Tournament[]);
    } catch (error) {
      api.errorData(error, navigate);
    }
  };

  useEffect(() => {
    storage.clearNextPage();
    load();
  }, []);
  useEffect(updateTournaments, [tournaments, search, isUpcomming]);
  useEffect(updateChunk, [chunks]);
  useEffect(updatePage, [currPage]);

  const searchHandler = (data: string) => setSearch(data.toLowerCase());

  const logoutHandler = () => {
    storage.clearUserProfile();
    setUser(null);
  };

  const createTournament = () => navigate("/tournament/create");
  const createCard = (tournament: Tournament) => <Card key={tournament._id} tournament={tournament} user={user?._id} />;

  const cards = activeChunk.map((elem) => createCard(elem));

  return (
    <>
      <Navbar>
        <div className="Page-controls">
          {user && !isUpcomming && (
            <button className="btn-solid btn-l" onClick={() => setUpcomming(true)}>
              UPCOMMING
            </button>
          )}
          {user && isUpcomming && (
            <button className="btn-solid btn-l" onClick={() => setUpcomming(false)}>
              ALL
            </button>
          )}
          <button
            disabled={chunks.length === 0 || currPage === 0}
            onClick={() => setCurrPage(currPage - 1)}
            className={`btn-solid btn-${user ? "c" : "l"}`}
          >
            PREVIOUS
          </button>
          <button
            disabled={chunks.length === 0 || currPage === chunks.length - 1}
            onClick={() => setCurrPage(currPage + 1)}
            className="btn-solid btn-r"
          >
            NEXT
          </button>
        </div>
        <Search searchCallback={searchHandler} />
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
      <div className="Content">{cards}</div>
    </>
  );
};

export default Main;
