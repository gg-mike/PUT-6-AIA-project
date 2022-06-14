import * as codes from "../server.errors.js";
import Tournament from "../models/tournament.model.js";
import User from "../models/user.model.js";

const lessThanNow = (date) => date.getTime() < new Date(Date()).getTime();

export const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.status(200).json(tournaments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", internalCode: codes.GET });
  }
};

export const getTournament = async (req, res) => {
  const { id } = req.params;

  try {
    const tournament = await Tournament.findById(id);
    if (!tournament) return res.status(404).json({ message: "Tournament doesn't exist" });
    res.status(200).json(tournament);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", internalCode: codes.GET_TOURNAMENT });
  }
};

export const createTournament = async (req, res) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthenticated", unAuth: true });

  const newTournament = req.body;

  try {
    const tournament = await Tournament.findOne({ name: newTournament.name });
    if (tournament) return res.status(400).json({ message: "Tournament with this name already exists" });

    await Tournament.create({ ...newTournament });
    res.status(201).json({ message: "Successfully created tournament" });
  } catch (error) {
    console.error(error);
    res.status(409).json({ message: "Something went wrong", internalCode: codes.CREATE });
  }
};

export const updateTournament = async (req, res) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthenticated", unAuth: true });

  const { id, changes } = req.body;

  try {
    const tournament = await Tournament.findById(id);
    if (!tournament) return res.status(404).json({ message: "Tournament doesn't exist" });

    if (lessThanNow(tournament.startDate)) return res.status(400).json({ message: "Tournament already started" });

    if (changes.participantsLimit && changes.participantsLimit < tournament.players.length)
      return res.status(400).json({ message: "In tournament participants number exceeds new limit" });

    await Tournament.findByIdAndUpdate(id, { ...changes });

    res.status(200).json({ message: "Successfully updated tournament" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", internalCode: codes.UPDATE });
  }
};

export const deleteTournament = async (req, res) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthenticated", unAuth: true });

  const { id } = req.params;

  try {
    const tournament = await Tournament.findById(id);
    if (!tournament) return res.status(404).json({ message: "Tournament doesn't exist" });

    if (lessThanNow(tournament.startDate)) return res.status(400).json({ message: "Tournament already started" });

    await Tournament.findByIdAndDelete(id);

    res.status(200).json({ message: "Successfully deleted tournament" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", internalCode: codes.DELETE });
  }
};

export const joinTournament = async (req, res) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthenticated", unAuth: true });

  const { id, player } = req.body;

  try {
    const tournament = await Tournament.findById(id);
    if (!tournament) return res.status(404).json({ message: "Tournament doesn't exist" });

    if (lessThanNow(tournament.applicationDeadline))
      return res.status(400).json({ message: "Application time for tournament ended" });

    if (tournament.players.includes(player))
      return res.status(400).json({ message: "Player already joined tournament" });

    if (tournament.players.length === tournament.participantsLimit)
      return res.status(400).json({ message: "Tournament is full" });

    tournament.players.push(player);

    await Tournament.findByIdAndUpdate(id, { players: tournament.players });

    res.status(200).json({ message: "Successfully joined tournament" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", internalCode: codes.JOIN });
  }
};

export const unJoinTournament = async (req, res) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthenticated", unAuth: true });

  const { id, player } = req.body;

  try {
    const tournament = await Tournament.findById(id);
    if (!tournament) return res.status(404).json({ message: "Tournament doesn't exist" });

    if (lessThanNow(tournament.startDate)) return res.status(400).json({ message: "Tournament already started" });

    if (!tournament.players.includes(player))
      return res.status(400).json({ message: "Player hasn't joined tournament" });

    await Tournament.findByIdAndUpdate(id, {
      players: tournament.players.filter((elem) => elem != player),
    });

    res.status(200).json({ message: "Successfully unjoined tournament" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", internalCode: codes.UN_JOIN });
  }
};

export const getTournamentTree = async (req, res) => {
  const { id } = req.params;

  try {
    const tournament = await Tournament.findById(id);
    if (!tournament) return res.status(404).json({ message: "Tournament doesn't exist" });

    if (tournament.games.length > 0) return res.status(200).json(tournament.games);

    const players = await User.find({ _id: { $in: tournament.players } });

    let games = getTree(players.map((elem) => elem.name));
    await Tournament.findByIdAndUpdate(id, { games });

    res.status(200).json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, internalCode: codes.TREE });
  }
};

export const setScores = async (req, res) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthenticated", unAuth: true });
  const { id, gameIdx } = req.params;
  const { setter, winner } = req.body;

  try {
    const tournament = await Tournament.findById(id);
    if (!tournament) return res.status(404).json({ message: "Tournament doesn't exist" });

    const games = tournament.games;
    if (!games.filter((elem) => elem.idx === gameIdx).length)
      return res.status(404).json({ message: "Game doesn't exist" });
    const currGame = games.filter((elem) => elem.idx === gameIdx)[0];

    if (currGame.confirmed !== undefined)
      return res.status(400).json({ message: "Scores already set. Waiting for confirmation" });

    currGame.setBy = setter;
    currGame.winner = winner;
    currGame.confirmed = false;

    await Tournament.findByIdAndUpdate(id, { games });
    return res.status(200).json({ message: "Scores updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, internalCode: codes.SET_SCORES });
  }
};

export const confirmScores = async (req, res) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthenticated", unAuth: true });
  const { id, gameIdx } = req.params;
  const { value } = req.body;

  try {
    const tournament = await Tournament.findById(id);
    if (!tournament) return res.status(404).json({ message: "Tournament doesn't exist" });

    const games = tournament.games;
    if (!games.filter((elem) => elem.idx === gameIdx).length)
      return res.status(404).json({ message: "Game doesn't exist" });
    const currGame = games.filter((elem) => elem.idx === gameIdx)[0];

    if (value) {
      currGame.confirmed = true;
      if (currGame.next) {
        let nextGame = games.filter((elem) => elem.idx === currGame.next);
        if (nextGame.left === currGame.idx) nextGame.playerL = currGame.winner;
        if (nextGame.right === currGame.idx) nextGame.playerR = currGame.winner;
      }
    } else {
      currGame.setBy = "";
      currGame.scoreL = "";
      currGame.scoreR = "";
      currGame.confirmed = undefined;
    }
    await Tournament.findByIdAndUpdate(id, { games });
    res.status(200).json({ message: "Confirmation done" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, internalCode: codes.CONF_SCORES });
  }
};

class Game {
  idx;
  playerL = "";
  playerR = "";
  scoreL = "";
  scoreR = "";
  confirmed = false;
  winner = "";
  next = null;
  left = null;
  right = null;
  pos;
  level;
}

function generateTree(start, end, next, players) {
  if (start > end) return null;
  let mid = parseInt((start + end) / 2);
  let game = new Game();
  game.idx = mid.toString();
  game.next = next;
  game.left = generateTree(start, mid - 1, mid, players);
  game.right = generateTree(mid + 1, end, mid, players);
  if (game.left === null && game.right === null) {
    game.level = 1;
    game.playerL = players.pop();
    game.playerR = players.pop();
  } else if (game.left !== null && game.right !== null) game.level = game.left.level + 1;
  else if (game.left !== null) {
    game.level = 1;
    game.left.level = 0;
    game.playerR = players.pop();
  } else if (game.right !== null) {
    game.level = 1;
    game.right.level = 0;
    game.playerL = players.pop();
  }
  return game;
}

function addPos(game, pos) {
  if (game === null) return;
  game.pos = game.level ? pos : parseInt(pos / 2);
  addPos(game.left, pos * 2);
  addPos(game.right, pos * 2 + 1);
}

function treeToArray(game) {
  if (game === null) return [];
  let left = game.left;
  let right = game.right;
  game.left = left ? left.idx : null;
  game.right = right ? right.idx : null;
  return [game].concat(treeToArray(left)).concat(treeToArray(right));
}

function getTree(players) {
  let root = generateTree(
    0,
    players.length - 2,
    null,
    players.sort((a, b) => 0.5 - Math.random())
  );
  addPos(root, 0);
  return treeToArray(root);
}
