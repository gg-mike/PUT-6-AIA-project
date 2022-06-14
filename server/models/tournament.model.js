import mongoose from "mongoose";

const gameSchema = mongoose.Schema({
  idx: {
    type: String,
    required: true,
  },
  playerL: {
    type: String,
    required: true,
  },
  playerR: {
    type: String,
    required: true,
  },
  setBy: {
    type: String,
  },
  confirmed: {
    type: Boolean,
  },
  winner: {
    type: String,
  },
  next: {
    type: String,
  },
  left: {
    type: String,
  },
  right: {
    type: String,
  },
  pos: {
    type: Number,
    required: true,
  },
  level: {
    type: Number,
    required: true,
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
  players: {
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
