import { Cards } from "@pairjacks/poker-cards";

export interface ClientPot {
  players: string[];
  chipCount: number;
}

export interface Seat {
  readonly winAmount: number;
  readonly isHost: boolean;
  readonly isWinner: boolean;
  readonly isActive: boolean;
  readonly token: string;
  readonly isEmpty: boolean;
  readonly isDealer: boolean;
  readonly isTurnToBet: boolean;
  readonly isFolded: boolean;
  readonly isBust: boolean;
  readonly chipCount: number;
  readonly chipsBetCount: number;
  readonly displayName: string;
  readonly pocketCards?: Cards;
}
export interface Message {
  username: string;
  text: string;
}
export const SKIN_TONE_NEUTRAL = "neutral";
export const SKIN_TONE_LIGHT = "1f3fb";
export const SKIN_TONE_MEDIUM_LIGHT = "1f3fc";
export const SKIN_TONE_MEDIUM = "1f3fe";
export const SKIN_TONE_MEDIUM_DARK = "1f3ff";
export const SKIN_TONE_DARK = "1f3fd";

export type SkinTones =
  | typeof SKIN_TONE_NEUTRAL
  | typeof SKIN_TONE_LIGHT
  | typeof SKIN_TONE_MEDIUM_LIGHT
  | typeof SKIN_TONE_MEDIUM
  | typeof SKIN_TONE_MEDIUM_DARK
  | typeof SKIN_TONE_DARK;

export interface IEmojiData {
  unified: string;
  originalUnified: string;
  names: Array<string>;
  emoji: string;
  activeSkinTone: SkinTones;
}
type BettingRound = "pre-deal" | "pre-flop" | "flop" | "turn" | "river";

export interface LimitedTable {
  isPaused: boolean;
  readonly timeRemaining?: number;
  readonly isStarted: boolean;
  readonly name: string;
  readonly bettingRound: BettingRound;
  readonly activePot: ClientPot;
  readonly splitPots: ClientPot[];
  readonly seats: Seat[];
  readonly communityCards: Cards;
  readonly maxBetChipCount: number;
  readonly highlightRelevantCards: boolean;
  readonly currentUser: {
    seatToken: string;
    isHost: boolean;
  };
}

/**
 * Messages
 */
export interface ServerTableStateMessage {
  type: "server/table-state";
  table?: LimitedTable;
}

export interface ServerPauseGameMessage {
  type: "server/pause-game";
}

export interface ServerResumeGameMessage {
  type: "server/resume-game";
}

export interface ServerCountDownMessage {
  type: "server/countdown";
  timeLeft: number;
}

export interface ServerSendMessage {
  type: "server/send-message";
  messages: { username: string; text: string }[];
}
