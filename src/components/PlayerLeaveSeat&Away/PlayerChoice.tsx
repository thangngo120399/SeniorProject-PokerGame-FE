import React, { useState } from "react";
import "./PlayerChoice.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faUserAlt,
  faChevronCircleLeft
} from "@fortawesome/free-solid-svg-icons";
// PHAI CAI VA IMPORT 2 CAI TREN NAY MS DC, CONG VS COI TUT CHO FA TRONG REACT NX
type Props = {
  playerName: string;
};
const PlayerChoice: React.FC<Props> = (props) => {
  const [show, setShow] = useState(false);
  const [isAway, setIsAway] = useState(false);
  const showModal = () => {
    setShow(true);
  };
  const hiddenModal = () => {
    setShow(false);
  };
  const handleAwayClicked = () => {
    // THEM XLI LOGIC CHO NI NX
    setIsAway(true);
  };
  const handleBackClicked = () => {
    // THEM XLI LOGIC CHO NI NX
    setIsAway(false);
  };
  const showLeaveMess = show ? "display-block" : "display-none";
  const showImBack = isAway ? "display-block" : "display-none";
  const hideAwayBtn = isAway ? "display-none" : "display-block";
  return (
    <div>
      <div className={showLeaveMess}>
        <div className="popup-leave-mess">
          <span>
            Are you sure that you want to leave your seat?
            <br />
            You will enter in check/fold mode until the hand's end
          </span>
          <button className="confirm-btn" onClick={hiddenModal}>
            CONFIRM
          </button>
          {/* CHINH LAI SU KIEN ONCLICK VS 1 FUNC XLI LOGIC KHAC CHO BTN CONFIRM NAY NE */}
          <button onClick={hiddenModal}>CANCEL</button>
        </div>
      </div>

      <div className="choice-list">
        <div className="choice-btn">
          <button onClick={showModal}>
            <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
          </button>
          <label>Leave Seat</label>
        </div>
        <div className={hideAwayBtn}>
          <div className="choice-btn">
            <button>
              <FontAwesomeIcon
                icon={faUserAlt}
                onClick={handleAwayClicked}
                className="icon"
              />
            </button>
            <label>Away</label>
          </div>
        </div>
        <div className={showImBack}>
          <div className="choice-btn">
            <button>
              <FontAwesomeIcon
                icon={faChevronCircleLeft}
                onClick={handleBackClicked}
                className="icon"
              />
            </button>
            <label>I'm back</label>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlayerChoice;
