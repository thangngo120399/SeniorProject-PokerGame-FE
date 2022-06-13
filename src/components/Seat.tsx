import React, { useState, useMemo } from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { isSameCard, describeHand } from "@pairjacks/poker-cards";
import CountUp from "react-countup";
import ChipBall from "./ChipBall";
import "./Seat.css";
import { CardComponent } from "../components/Cards/Card";
import type { Hand, Cards } from "@pairjacks/poker-cards";
import type { Seat } from "../poker_messages/server.message";
import type { FCWithoutChildren } from "../types/component";
import CountDown from "../components/ClockCountdown/Coundown";
import { FlipCards } from "../components/Cards/FlipCard";
import closeIcon from "../icons/closeIcon.png";
import { animated, useSpring, config } from "react-spring";
import AnimatedNumber from "./AnimatedNumber";

function getPosiTionInEcliipse(
  index: number,
  totalSeat: number
): { top: number; right: number } {
  const widthRadius = 35; // 40vw
  const heightRaius = 33; // 40vh
  const angle = (2 * Math.PI * index) / totalSeat;
  const x = heightRaius * Math.cos(angle);
  const y = widthRadius * Math.sin(angle);
  const top = 45 + x;
  const right = 50 + y;
  return { top, right };
}

const SeatComponent: FCWithoutChildren<{
  winAmount: number;
  isHostInSeat: boolean;
  isHost: boolean;
  isWinner: boolean;
  isActive: boolean;
  index: number | undefined;
  totalSeat: number;
  timeRemaining: number;
  tableName: string;
  seat: Seat;
  isStartGame: boolean;
  isGameDealed: boolean;
  isCurrentUser: boolean;
  isTurn: boolean;
  isFolded: boolean;
  isBust: boolean;
  isDealer: boolean;
  canDeal: boolean;
  canCheck: boolean;
  canBet: boolean;
  hand?: Hand;
  pocketCards?: Cards;
  onDisplayNamePress?: () => unknown;
  onDealPress: () => unknown;
  onBetPress: (value: number) => unknown;
  onCheckPress: () => unknown;
  onCallPress: () => unknown;
  onFoldPress: () => unknown;
  onKickPress: (playerTokenToKick: string) => unknown;
}> = ({
  winAmount,
  isHostInSeat,
  isHost,
  isWinner,
  isActive,
  isStartGame,
  isGameDealed,
  timeRemaining,
  index,
  totalSeat,
  tableName,
  seat,
  isCurrentUser,
  isFolded,
  isBust,
  isDealer,
  isTurn,
  canDeal,
  canBet,
  canCheck,
  hand,
  pocketCards,
  onDisplayNamePress,
  onBetPress,
  onCallPress,
  onCheckPress,
  onFoldPress,
  onDealPress,
  onKickPress,
}) => {
  const [betInputValue, setBetInputValue] = useState<string>("");
  const emoji = useMemo(() => {
    if (isBust) return "😵";
    return seat.displayName;
  }, [isBust, isFolded, seat.displayName]);
  if (!index) {
    index = 0;
  }
  const { top, right } = getPosiTionInEcliipse(index, totalSeat);
  const kickPlayer = (seatToken: string) => {
    if (window.confirm("DOy")) {
      onKickPress(seatToken);
    }
  };
  return (
    <OuterContainer top={top} right={right}>
      <BetChipBallContainer>
        <ChipBall chipCount={seat.chipsBetCount} />
      </BetChipBallContainer>
      {seat.isEmpty ? (
        <EmptySeat>
          <h3 style={{ margin: "3rem 3.2rem", color: "#eee" }}>Empty</h3>
        </EmptySeat>
      ) : isFolded ? (
        <FoldPlayer>
          <DisplayName
            title="Change display name"
            onClick={onDisplayNamePress}
            isCurrentPlayer={isCurrentUser}
          >
            {emoji}
          </DisplayName>

          <ValueContainer isCurrentPlayer={isCurrentUser}>
            <AnimatedNumber value={seat.chipCount} />
          </ValueContainer>
          <FoldIcon>
            {" "}
            <svg
              id="Capa_1"
              enable-background="new 0 0 512.001 512.001"
              height="110"
              viewBox="0 0 512.001 512.001"
              width="120"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path
                  fill="#666"
                  d="m512.001 84.853-84.853-84.853-171.147 171.147-171.148-171.147-84.853 84.853 171.148 171.147-171.148 171.148 84.853 84.853 171.148-171.147 171.147 171.147 84.853-84.853-171.148-171.148z"
                ></path>
              </g>
            </svg>
          </FoldIcon>
        </FoldPlayer>
      ) : isActive ? (
        <>
          <SeatContainer
            isCurrentPlayer={isCurrentUser}
            isTurn={isTurn}
            isWinner={isWinner}
          >
            <>
              {isWinner && (
                <WinAmount>
                  + <CountUp className="CountUp" end={winAmount} duration={2} />
                </WinAmount>
              )}
              <RolePlayer>
                {isHostInSeat && <HostIcon>H</HostIcon>}
                {isDealer && <DealerButton title="DEALER">D</DealerButton>}
              </RolePlayer>
              {!isGameDealed && !isCurrentUser && isHost && (
                <KickPlayerButton
                  onClick={() => kickPlayer(seat.token)}
                  title="Kick Player"
                >
                  <img
                    style={{
                      right: "3px",
                      position: "absolute",
                      bottom: "0px",
                    }}
                    src={closeIcon}
                    alt="close icon"
                  />
                </KickPlayerButton>
              )}
              <DisplayName
                title="Change display name"
                onClick={onDisplayNamePress}
                isCurrentPlayer={isCurrentUser}
              >
                {emoji}
              </DisplayName>
              <ValueContainer isCurrentPlayer={isCurrentUser}>
                <AnimatedNumber value={seat.chipCount} />
              </ValueContainer>
              <Item>
                <PocketCards>
                  <Wrapper>
                    {pocketCards
                      ? pocketCards.map((myCard, index) => (
                          <div>
                            <CardComponent
                              index={index + 1}
                              card={myCard}
                              highlight={
                                isCurrentUser &&
                                !!hand?.rankCards.find((card) =>
                                  isSameCard(card, myCard)
                                )
                              }
                            />
                          </div>
                        ))
                      : isGameDealed && (
                          <>
                            <FlipCards index={1} />
                            <FlipCards index={2} />
                          </>
                        )}
                  </Wrapper>
                </PocketCards>
              </Item>
            </>
            {isGameDealed && isStartGame && isTurn && <CountDown />}
            <HighHands>
              {hand ? Object.values(describeHand(hand))[0] : " "}
            </HighHands>
          </SeatContainer>
        </>
      ) : (
        <AwayPlayer>
          <DisplayName
            title="Change display name"
            onClick={onDisplayNamePress}
            isCurrentPlayer={isCurrentUser}
          >
            {emoji}
          </DisplayName>
          {!isGameDealed && !isCurrentUser && isHost && (
            <KickPlayerButton
              onClick={() => onKickPress(seat.token)}
              title="Kick Player"
            >
              <img src={closeIcon} alt="close icon" />
            </KickPlayerButton>
          )}
          <svg
            version="1.1"
            id="Capa_1"
            x="0px"
            y="0px"
            width="60px"
            height="60px"
            viewBox="0 0 612 612"
          >
            <g>
              <g id="cloud-off">
                <path
                  fill="#ed4f1c"
                  d="M494.7,229.5c-17.851-86.7-94.351-153-188.7-153c-38.25,0-73.95,10.2-102,30.6l38.25,38.25 c17.85-12.75,40.8-17.85,63.75-17.85c76.5,0,140.25,63.75,140.25,140.25v12.75h38.25c43.35,0,76.5,33.15,76.5,76.5 c0,28.05-15.3,53.55-40.8,66.3l38.25,38.25C591.6,438.6,612,400.35,612,357C612,290.7,558.45,234.6,494.7,229.5z M76.5,109.65 l71.4,68.85C66.3,183.6,0,249.9,0,331.5c0,84.15,68.85,153,153,153h298.35l51,51l33.15-33.15L109.65,76.5L76.5,109.65z M196.35,229.5l204,204H153c-56.1,0-102-45.9-102-102c0-56.1,45.9-102,102-102H196.35z"
                ></path>
              </g>
            </g>
          </svg>
          <h3 style={{ color: "#ed4f1c", marginBlockStart: "0px" }}>Away</h3>
        </AwayPlayer>
      )}
    </OuterContainer>
  );
};

export default observer(SeatComponent);

const OuterContainer = styled.div<{
  top: number;
  right: number;
}>`
  top: ${(props) => `${props.top}vh`};
  right: ${(props) => `${props.right}vw`};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  position: absolute;
  transform: translate(50%, -50%);
`;

const SeatContainer = styled.ul<{
  isCurrentPlayer: boolean;
  isTurn: boolean;
  isWinner: boolean;
}>`
  position: relative;
  border-radius: 20px;
  width: 11rem;
  height: 8rem;
  padding: 1em;
  margin-block-start: 0;
  border: ${({ isWinner, theme, isTurn, isCurrentPlayer }) =>
    isWinner
      ? `4px solid ${theme.colors.currentTurnAccent}`
      : `
  ${
    isTurn
      ? `2px solid ${theme.colors.currentTurnAccent}`
      : `1px solid ${isCurrentPlayer ? theme.colors.keyline : "transparent"}`
  }`};
  list-style-type: none;
  background-color: ${({ isCurrentPlayer, theme }) =>
    isCurrentPlayer
      ? theme.colors.playerSeatBackground
      : theme.colors.opponentSeatBackground};
  box-shadow: ${({ isWinner, theme, isTurn, isCurrentPlayer }) =>
    isWinner
      ? theme.colors.currentBoxShadowWinner
      : `
  ${isTurn ? theme.colors.currentBoxShadowAccent : "none"}`};
`;

const Item = styled.li`
  position: absolute;
  left: -66%;
  top: 21%;
  margin-bottom: 0.4em;
`;

const BetChipBallContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  padding-bottom: 0;
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
`;

const PocketCards = styled.div`
  display: flex;
  justify-content: center;
`;
const RolePlayer = styled.div`
  position: absolute;
  width: 70px;
  height: 35px;
  display: inline-block;
  left: 57%;
  top: 6%;
`;
const DealerButton = styled.div`
  font-weight: bold;
  background-color: #e84848;
  color: white;
  right: 40px;
  display: inline-block;
  display: flex;
  float: right;
  margin-right: 4px;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 12px;
  border-radius: 15px;
`;
const HostIcon = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  background: red;
  float: right;
  margin-right: 4px;
  width: 20px;
  height: 20px;
  font-size: 12px;
  border-radius: 15px;
`;

const EmptySeat = styled.div`
  position: relative;
  border-radius: 10px;
  width: 10.5em;
  height: 7.5em;
  background: #333;
  border: 2px dashed #eee;
  opacity: 0.4;
`;
const FoldPlayer = styled.div`
  position: relative;
  border-radius: 20px;
  width: 10.5em;
  height: 7.5em;
  background: #333;
  opacity: 0.7;
  text-align: center;
`;
const DisplayName = styled.div<{
  isCurrentPlayer: boolean;
}>`
  color: ${({ isCurrentPlayer }) => (isCurrentPlayer ? "#33333" : "white")};
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
`;
const KickPlayerButton = styled.button`
  position: absolute;
  background: #5b5c59;
  color: white;
  left: 89%;
  top: 0;
  cursor: pointer;
  border-start-end-radius: 14px;
  &:hover {
    background: black;
  }
  width: 18px;
  height: 16px;
`;

const HighHands = styled.div`
  border-radius: 5px;
  background: #ce4949;
  padding: 0px 5px;
  color: white;
  font-size: 0.875rem;
  font-weight: bold;
  margin-left: 0px;
  margin-top: 8px;
  text-align: center;
`;
const AwayPlayer = styled.div`
  position: relative;
  border-radius: 10px;
  width: 10.5em;
  height: 7.5em;
  background: #eee;
  opacity: 0.5;
  text-align: center;
`;

const Wrapper = styled.div`
  display: flex;
`;
const WinAmount = styled.div`
  top: -14%;
  position: absolute;
  border: 1px solid gray;
  left: 22%;
  width: 5rem;
  text-align: center;
  border-radius: 6px;
  color: #fff;
  font-size: 1.25rem;
  font-weight: bold;
  background: #2e8a2e;
`;
const FoldIcon = styled.div`
  position: absolute;
  top: 4%;
  opacity: 0.4;
  left: 12%;
`;
const ValueContainer = styled(animated.div)<{
  isCurrentPlayer: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ isCurrentPlayer }) => (isCurrentPlayer ? "black" : "#53cb30")};
  padding: 5px 20px;
  border-radius: 8px;
  border: ${({ isCurrentPlayer }) =>
    isCurrentPlayer ? "1px solid black" : "1px solid green"};

  text-align: center;
  font-size: 20px;
`;
