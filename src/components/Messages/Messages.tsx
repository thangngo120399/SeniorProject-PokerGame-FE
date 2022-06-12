import React from "react";
import "./Messages.css";
import ScrollToBottom from "react-scroll-to-bottom";
import { MessageInput } from "./Message/Message";
import { FCWithoutChildren } from "../../types/component";

export const Messages: FCWithoutChildren<{
  messages: { username: string; text: string }[];
}> = ({ messages }) => {
  return (
    <ScrollToBottom className="messages">
      {messages.map((message, i) => (
        <div key={i}>
          <MessageInput message={message} />
        </div>
      ))}
    </ScrollToBottom>
  );
};
