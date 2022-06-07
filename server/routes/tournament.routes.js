import express from "express";
import auth from "../middleware/auth.js";

import {
  getTournaments,
  getTournament,
  createTournament,
  updateTournament,
  deleteTournament,
  joinTournament,
  unJoinTournament,
} from "../controllers/tournament.controllers.js";

const router = express.Router();

router.get("/", getTournaments);
router.get("/:id", getTournament);
router.post("/", auth, createTournament);
router.patch("/", auth, updateTournament);
router.delete("/:id", auth, deleteTournament);
router.patch("/addPlayer", auth, joinTournament);
router.patch("/delPlayer", auth, unJoinTournament);

export default router;
