import mongoose from "mongoose";

const gameSchema = mongoose.Schema({
  player1: {
    type: String,
    required: true,
  },
  player2: {
    type: String,
    required: true,
  },
  score1: {
    type: Number,
    required: true,
  },
  score2: {
    type: Number,
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  winner: {
    type: String,
  },
  level: {
    type: Number,
    required: true,
  },
  parent1: {
    type: String,
  },
  parent2: {
    type: String,
  },
});

const tournamentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  discipline: {
    type: String,
    required: true,
  },
  organizer: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  participantsLimit: {
    type: Number,
    required: true,
  },
  applicationDeadline: {
    type: Date,
    required: true,
  },
  rankedPlayers: {
    type: [String],
    default: [],
  },
  sponsorsLogos: {
    type: String,
  },
  games: {
    type: [gameSchema],
    default: [],
  },
});

const Tournament = mongoose.model("Tournament", tournamentSchema);

export default Tournament;
