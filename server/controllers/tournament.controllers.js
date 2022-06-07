import * as codes from "../server.errors.js";
import Tournament from "../models/tournament.model.js";

const lessThanNow = (date) => date.getTime() < new Date(Date()).getTime();

export const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.status(200).json(tournaments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, internalCode: codes.GET });
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
    res.status(500).json({ message: error.message, internalCode: codes.GET_TOURNAMENT });
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
    res.status(409).json({ message: error.message, internalCode: codes.CREATE });
  }
};

export const updateTournament = async (req, res) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthenticated", unAuth: true });

  const { id, changes } = req.body;

  try {
    const tournament = await Tournament.findById(id);
    if (!tournament) return res.status(404).json({ message: "Tournament doesn't exist" });

    if (lessThanNow(tournament.startDate)) return res.status(400).json({ message: "Tournament already started" });

    if (changes.participantsLimit && changes.participantsLimit < tournament.rankedPlayers.length)
      return res.status(400).json({ message: "In tournament participants number exceeds new limit" });

    await Tournament.findByIdAndUpdate(id, { ...changes });

    res.status(200).json({ message: "Successfully updated tournament" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, internalCode: codes.UPDATE });
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
    res.status(500).json({ message: error.message, internalCode: codes.DELETE });
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

    if (tournament.rankedPlayers.includes(player))
      return res.status(400).json({ message: "Player already joined tournament" });

    if (tournament.rankedPlayers.length === tournament.participantsLimit)
      return res.status(400).json({ message: "Tournament is full" });

    tournament.rankedPlayers.push(player);

    await Tournament.findByIdAndUpdate(id, { rankedPlayers: tournament.rankedPlayers });

    res.status(200).json({ message: "Successfully joined tournament" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, internalCode: codes.JOIN });
  }
};

export const unJoinTournament = async (req, res) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthenticated", unAuth: true });

  const { id, player } = req.body;

  try {
    const tournament = await Tournament.findById(id);
    if (!tournament) return res.status(404).json({ message: "Tournament doesn't exist" });

    if (lessThanNow(tournament.startDate)) return res.status(400).json({ message: "Tournament already started" });

    if (!tournament.rankedPlayers.includes(player))
      return res.status(400).json({ message: "Player hasn't joined tournament" });

    await Tournament.findByIdAndUpdate(id, {
      rankedPlayers: tournament.rankedPlayers.filter((elem) => elem != player),
    });

    res.status(200).json({ message: "Successfully unjoined tournament" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, internalCode: codes.UN_JOIN });
  }
};
