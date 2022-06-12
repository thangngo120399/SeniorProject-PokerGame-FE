import React from "react";
import PropTypes from "prop-types";
import "./Message.css";
import type { Message } from "../../../poker_messages/server.message";
import ReactEmoji from "react-emoji";
import { FCWithoutChildren } from "../../../types/component";
export const MessageInput: FCWithoutChildren<{
  message: Message;
}> = ({ message }) => {
  const messageReal = message.text;
  const name = message.username;

  let isAdmin = false;

  if (name === "admin") {
    isAdmin = true;
  }
  return isAdmin ? (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundDark">
        <p className="messageText colorWhite Admin">
          {" "}
          {ReactEmoji.emojify(messageReal)}
        </p>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundDark">
        <p className="messageText colorWhite">
          {" "}
          {ReactEmoji.emojify(messageReal)}
        </p>
      </div>
      <p className="sentText pl-10">{name}</p>
    </div>
  );
};
