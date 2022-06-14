import { Game } from "./Game";

export interface Tournament {
  _id?: string;
  name: string;
  discipline: string;
  organizer: string;
  creator: string;
  startDate: string;
  location: string;
  participantsLimit: number;
  applicationDeadline: string;
  players: string[];
  sponsorsLogos: string;
  games: Game[];
}
