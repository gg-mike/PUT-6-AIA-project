export interface Game {
  player1: string;
  player2: string;
  score1: number;
  score2: number;
  confirmed?: boolean;
  winner: string;
  level: number;
  parent1?: string;
  parent2?: string;
}
