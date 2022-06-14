export interface Game {
  idx: string;
  playerL: string;
  playerR: string;
  setBy?: string;
  confirmed?: boolean;
  winner: string;
  next: string | null;
  left: string | null;
  right: string | null;
  pos: number;
  level: number;
}
