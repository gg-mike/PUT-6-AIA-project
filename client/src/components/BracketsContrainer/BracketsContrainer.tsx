import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import * as api from "../../api";
import { Game } from "../../models";
import Bracket from "../Bracket/Bracket";
import "./BracketsContrainer.css";
import { connectElements } from "./PathDrawrer";

type BracketsContainerProps = {
  tournamentId: string;
  games?: Game[];
};

const BracketsContrainer = ({ tournamentId, games: _games }: BracketsContainerProps) => {
  const pathsRefs = useRef<Array<SVGPathElement>>([]);
  const bracketsRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [games, setGames] = useState(_games);
  const navigate = useNavigate();

  const updatePaths = () => {
    let i = 0;
    if (!paths.length) return;
    if (games === undefined || games.length === 0) return;
    games.forEach((elem) => {
      if (elem.left !== null) {
        connectElements(
          pathsRefs.current[i],
          bracketsRefs.current.get(elem.left)!,
          bracketsRefs.current.get(elem.idx)!
        );
        i++;
      }
      if (elem.right !== null) {
        connectElements(
          pathsRefs.current[i],
          bracketsRefs.current.get(elem.right)!,
          bracketsRefs.current.get(elem.idx)!
        );
        i++;
      }
    });
  };

  const brackets = games?.map((game) => (
    <Bracket
      key={game.level + ":" + game.pos}
      ref={(elem) => bracketsRefs.current.set(game.idx, elem!)}
      tournamentId={tournamentId}
      game={game}
      isLevel0={Boolean(games.filter((elem) => elem.level === 0).length)}
      updatePaths={updatePaths}
    />
  ));
  const [paths, setPaths] = useState<JSX.Element[]>([]);

  const createPath = (key: number) => (
    <path className="BracketsContainer-path" key={key} ref={(elem) => pathsRefs.current.push(elem!)} />
  );
  const configure = () => {
    if (games === undefined || games.length === 0) return;
    let _paths: JSX.Element[] = [];
    let maxLvl = 0;
    games?.forEach((game) => {
      if (game.left !== null) _paths.push(createPath(_paths.length));
      if (game.right !== null) _paths.push(createPath(_paths.length));
      if (game.level > maxLvl) maxLvl = game.level;
    });
    setWidth(20 * (maxLvl + 1));
    setHeight(10 * Math.pow(2, maxLvl - 2));
    setPaths(_paths);
  };

  const getGames = async () => {
    try {
      let res = await api.getTournamentTree(tournamentId!);
      setGames(res.data);
    } catch (error) {
      api.errorData(error, navigate);
    }
  };

  useEffect(() => {
    if (games === undefined || games.length === 0) getGames();
  }, []);

  useEffect(() => {
    configure();
  }, [games]);

  useEffect(() => updatePaths(), [paths]);

  return (
    <div className="BracketsContainer" style={{ height: height + "em", width: width + "em" }}>
      <svg className="BracketsContainer-paths">{paths}</svg>
      {brackets}
    </div>
  );
};

export default BracketsContrainer;
