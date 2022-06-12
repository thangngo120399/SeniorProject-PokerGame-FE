import React, { useContext } from "react";
import { observable } from "mobx";
import {
  ServerTableStateMessage,
  ServerCountDownMessage,
  LimitedTable,
  ServerSendMessage,
  Message,
  Seat,
} from "../poker_messages/server.message";
import type {
  ClientJoinTableMessage,
  ClientCreateTableMessage,
  ClientStartGameMessage,
  ClientPauseGameMessage,
  ClientResumeGameMessage,
  ClientPlaceBetMessage,
  ClientDealMessage,
  ClientFoldMessage,
  ClientCallMessage,
  ClientCheckMessage,
  ClientChangeDisplayNameMessage,
  ClientSendMessage,
  ClientKickPlayer,
} from "../poker_messages/client.message";

import { themes, getNextThemeName } from "../style/theme";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

export interface JoinTableOptions {
  seatToken: string;
  tableName: string;
}

export interface CreateTableOptions {
  tableName: string;
  numberOfSeats: number;
  startingChipCount: number;
  smallBlind: number;
  highlightRelevantCards: boolean;
}

export type ServerConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected";

interface AppState {
  themeName: string;
  connectionStatus: ServerConnectionStatus;
  table?: LimitedTable;
  seat?: Seat;
  timeLeft: number;
  messages: Message[];
  // username: string;
}

// const SOCKETIO_URL = "https://pokergame-ces-backend.herokuapp.com";
const SOCKETIO_URL = "http://localhost:8000";
export class Store {
  @observable data: AppState = {
    themeName: themes.dark.name,
    connectionStatus: "disconnected",
    timeLeft: 0,
    messages: [],
  };

  public socket = io(SOCKETIO_URL);

  connect = () => {
    this.data.connectionStatus = "connecting";

    this.socket.on("connect", () => {
      this.data.connectionStatus = "connected";

      const pathnameParts = window.location.pathname.split("/");

      const tableName = pathnameParts[1];
      const seatToken = pathnameParts[2];

      if (tableName && !seatToken) this.requestSeatToken(tableName);
      if (tableName && seatToken) this.onJoinTable({ tableName, seatToken });
    });

    this.socket.on("disconnect", (reason) => {
      this.data.connectionStatus = "disconnected";
      console.log(reason);
    });

    this.socket.on("connect_error", () => {
      this.data.connectionStatus = "disconnected";
    });

    this.socket.on("server/table-state", (data: ServerTableStateMessage) => {
      this.updateTableState(data.table);
    });
    this.socket.on("server/pause-game", (data: ServerTableStateMessage) => {
      if (this.data.table?.isPaused !== undefined) {
        this.data.table!.isPaused = true;
      }
    });
    this.socket.on("server/resume-game", (data: ServerTableStateMessage) => {
      if (this.data.table?.isPaused !== undefined) {
        this.data.table!.isPaused = false;
      }
    });
    this.socket.on("server/countdown", (data: ServerCountDownMessage) => {
      this.data.timeLeft = data.timeLeft;
    });
    this.socket.on("server/send-message", (data: ServerSendMessage) => {
      this.data.messages = data.messages;
    });
  };

  cycleTheme = () => {
    this.data.themeName = getNextThemeName(this.data.themeName);
  };

  private requestSeatToken = async (tableName: string) => {
    try {
      const response = await fetch(`${SOCKETIO_URL}/${tableName}`, {
        method: "GET",
      });
      const { seatToken, error } = await response.json();
      console.log(seatToken);
      if (!seatToken) {
        toast.error(error + " !!!");
      }

      this.onJoinTable({
        tableName,
        seatToken,
      });
    } catch (e) {
      console.log("error", e);
    }
  };

  private updateTableState = (table?: LimitedTable) => {
    this.data.table = table;
    if (
      table &&
      (window.location.pathname === "/" ||
        window.location.pathname === `/${table.name}`)
    ) {
      window.history.pushState(
        "page2",
        "Title",
        `${table.name}/${table.currentUser.seatToken}`
      );
    }
  };

  onJoinTable = (options: JoinTableOptions) => {
    const joinTableMessage: ClientJoinTableMessage = {
      type: "client/join-table",
      ...options,
    };

    // this.sendMessage(joinTableMessage);
    this.socket.emit("client/join-table", joinTableMessage);
  };

  onCreateTable = (options: CreateTableOptions) => {
    const createTableMessage: ClientCreateTableMessage = {
      type: "client/create-table",
      ...options,
    };

    // this.sendMessage(createTableMessage);
    this.socket.emit(
      "client/create-table",
      createTableMessage,
      (response: string) => {
        if (response === "TableName existed") {
          toast.error(response + " !!!");
        }
      }
    );
  };

  onStartGame = () => {
    const tableName = this.data.table?.name;
    const seatToken = this.data.table?.currentUser.seatToken;

    if (!tableName || !seatToken) {
      return;
    }

    const startGameMessage: ClientStartGameMessage = {
      type: "client/start-game",
      tableName,
      seatToken,
    };

    // this.sendMessage(startGameMessage);
    this.socket.emit("client/start-game", startGameMessage);
  };
  onPauseGame = () => {
    const tableName = this.data.table?.name;
    const seatToken = this.data.table?.currentUser.seatToken;

    if (!tableName || !seatToken) {
      return;
    }

    const pauseGameMessage: ClientPauseGameMessage = {
      type: "client/pause-game",
      tableName,
      seatToken,
    };

    // this.sendMessage(startGameMessage);
    this.socket.emit("client/pause-game", pauseGameMessage);
  };
  onResumeGame = () => {
    const tableName = this.data.table?.name;
    const seatToken = this.data.table?.currentUser.seatToken;

    if (!tableName || !seatToken) {
      return;
    }

    const resumeGameMessage: ClientResumeGameMessage = {
      type: "client/resume-game",
      tableName,
      seatToken,
    };

    // this.sendMessage(startGameMessage);
    this.socket.emit("client/resume-game", resumeGameMessage);
    toast.success("Game was returned !!!");
  };
  onChangeDisplayName = (name: string) => {
    const tableName = this.data.table?.name;
    const seatToken = this.data.table?.currentUser.seatToken;

    if (!tableName || !seatToken) {
      return;
    }

    const changeNameMessage: ClientChangeDisplayNameMessage = {
      type: "client/change-display-name",
      tableName,
      seatToken,
      displayName: name,
    };

    // this.sendMessage(startGameMessage);
    this.socket.emit("client/change-display-name", changeNameMessage);
  };

  onDeal = () => {
    const tableName = this.data.table?.name;
    const seatToken = this.data.table?.currentUser.seatToken;

    if (!tableName || !seatToken) {
      return;
    }

    const dealMessage: ClientDealMessage = {
      type: "client/deal",
      tableName,
      seatToken,
    };

    // this.sendMessage(dealMessage);
    this.socket.emit("client/deal", dealMessage);
  };

  onPlaceBet = (chipCount: number) => {
    const tableName = this.data.table?.name;
    const seatToken = this.data.table?.currentUser.seatToken;

    if (!tableName || !seatToken || !chipCount) {
      return;
    }

    const placeBetMessage: ClientPlaceBetMessage = {
      type: "client/place-bet",
      tableName,
      seatToken,
      chipCount,
    };

    // this.sendMessage(placeBetMessage);
    this.socket.emit("client/place-bet", placeBetMessage);
  };

  onCall = () => {
    const tableName = this.data.table?.name;
    const seatToken = this.data.table?.currentUser.seatToken;

    if (!tableName || !seatToken) {
      return;
    }

    const callMessage: ClientCallMessage = {
      type: "client/call",
      tableName,
      seatToken,
    };

    // this.sendMessage(callMessage);
    this.socket.emit("client/call", callMessage);
  };

  onCheck = () => {
    const tableName = this.data.table?.name;
    const seatToken = this.data.table?.currentUser.seatToken;

    if (!tableName || !seatToken) {
      return;
    }

    const checkMessage: ClientCheckMessage = {
      type: "client/check",
      tableName,
      seatToken,
    };

    // this.sendMessage(callMessage);
    this.socket.emit("client/check", checkMessage);
  };

  onFold = () => {
    const tableName = this.data.table?.name;
    const seatToken = this.data.table?.currentUser.seatToken;

    if (!tableName || !seatToken) {
      return;
    }

    const foldMessage: ClientFoldMessage = {
      type: "client/fold",
      tableName,
      seatToken,
    };

    this.socket.emit("client/fold", foldMessage);
    toast.warning("You were folded !!!");
  };
  sendMessage = (text: string) => {
    const tableName = this.data.table?.name;
    const seatToken = this.data.table?.currentUser.seatToken;

    if (!tableName || !seatToken) {
      return;
    }
    const sendMessage: ClientSendMessage = {
      type: "client/send-message",
      tableName,
      text,
      seatToken,
    };

    this.socket.emit("client/send-message", sendMessage);
  };
  onKick = (playerTokenToKick: string) => {
    const tableName = this.data.table?.name;
    const seatToken = this.data.table?.currentUser.seatToken;

    if (!tableName || !seatToken || !playerTokenToKick) {
      return;
    }

    const kickMessage: ClientKickPlayer = {
      type: "client/kick",
      tableName,
      playerTokenToKick,
      seatToken,
    };

    this.socket.emit("client/kick", kickMessage, (response: string) => {
      if (response) {
        toast.error(response + " !!!");
      }
    });
  };
}

export const StoreContext = React.createContext<Store>(new Store());

export const useStore = () => useContext(StoreContext);
