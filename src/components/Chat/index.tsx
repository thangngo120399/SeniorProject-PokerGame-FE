import React, { useEffect, useState } from "react";
import { toJS } from "mobx";
import "./Chat.css";
import { useStore } from "../../state/store";
import { Messages } from "../Messages/Messages";
import { Inputs } from "../Input/Input";
import type { FCWithoutChildren } from "../../types/component";
import { observer } from "mobx-react";
import banToxic from "../../services/banToxic.service";

import { toast } from "react-toastify";
const Chat: FCWithoutChildren = () => {
  const store = useStore();
  const [message, setMessage] = useState("");
  const [msgToxic, setMsgToxic] = useState(false);
  const POSITIVE = "POSITIVE";
  const NEGATIVE = "NEGATIVE";
  const isHost = store.data.table?.currentUser.isHost || false;
  let messages = store.data.messages;
  const sendMessage = (event: any) => {
    event.preventDefault();
    banToxic.checkToxic(message).then(
      (response: any) => {
        if (response.data === NEGATIVE) {
          toast.warning("Don't curse each other!!!");
          setMsgToxic(true);
          return;
        } else {
          store.sendMessage(message);
          setMessage("");
          setMsgToxic(false);
        }
      },
      (error: any) => {
        const message =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        toast.error(message);
      }
    );
    // if (message) {
    //   store.sendMessage(message);
    // }
    // setMessage("");
  };
  return (
    <div className="container">
      <Messages messages={messages} />
      <Inputs
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        msgToxic={msgToxic}
      />
    </div>
  );
};

export default observer(Chat);
