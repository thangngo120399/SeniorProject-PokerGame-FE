import React, { useState, useEffect } from "react";
import "./Coundown.css";
import { useStore } from "../../state/store";
import type { FCWithoutChildren } from "../../types/component";
import { observer } from "mobx-react";

const CountDown: FCWithoutChildren = () => {
  const store = useStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 1000);
  }, [show]);

  if (!show) return null;

  let timeRemaining = store.data.timeLeft;
  return (
    <div>
      <div className="pomodoro">
        <div className="timer">{timeRemaining}</div>
      </div>
    </div>
  );
};

export default observer(CountDown);
