import React, { useState, useEffect } from "react";
import "./Input.css";
import Picker from "emoji-picker-react";
import smile from "../../icons/smile.png";
import close from "../../icons/close-icon.png";
import { FCWithoutChildren } from "../../types/component";
import type { IEmojiData } from "../../poker_messages/server.message";

export const Inputs: FCWithoutChildren<{
  message: string;
  setMessage: (text: string) => unknown;
  sendMessage: (event: any) => unknown;
  msgToxic: boolean;
}> = ({ message, setMessage, sendMessage, msgToxic }) => {
  const [chosenEmoji, setChosenEmoji] = useState<IEmojiData>();
  const [showEmoji, setShowEmoji] = useState(false);
  const handleShowEmoji = (event: any) => {
    event.preventDefault();
    setShowEmoji(!showEmoji);
  };
  useEffect(() => {
    if (chosenEmoji) {
      setMessage(message + chosenEmoji.emoji);
      setShowEmoji(false);
    }
  }, [chosenEmoji]);
  return (
    <form className="form">
      <button onClick={(e) => handleShowEmoji(e)} className="emojibutton">
        {showEmoji ? (
          <div title="Close Emoji">
            {" "}
            <img src={close} alt="close" />
          </div>
        ) : (
          <div title="Open Emoji">
            <img src={smile} alt="open" />
          </div>
        )}
      </button>
      {showEmoji && (
        <div style={{ position: "absolute", marginTop: "2rem" }}>
          <Picker
            onEmojiClick={(event, emojiObject) => setChosenEmoji(emojiObject)}
          />
        </div>
      )}
      <input
        id="inputChat"
        className="input"
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) =>
          event.key === "Enter" ? sendMessage(event) : null
        }
        style={{ color: msgToxic ? "red" : "#298450", background: "none" }}
      />
      <button
        style={{ bottom: 0 }}
        className="sendButton"
        onClick={(event) => sendMessage(event)}
        title="SEND"
      >
        Send
      </button>
    </form>
  );
};
