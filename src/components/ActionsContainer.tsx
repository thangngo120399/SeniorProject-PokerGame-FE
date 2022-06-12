import React, { useState } from "react";
import styled from "styled-components";
import { FCWithoutChildren } from "../types/component";
import FlickerBlink from "./Flicker/Flicker";

export const Actions: FCWithoutChildren<{
  canDeal: boolean;
  canCheck: boolean;
  canBet: boolean;
  onDealPress: () => unknown;
  onBetPress: (value: number) => unknown;
  onCheckPress: () => unknown;
  onCallPress: () => unknown;
  onFoldPress: () => unknown;
}> = ({
  canDeal,
  canCheck,
  canBet,
  onDealPress,
  onBetPress,
  onCheckPress,
  onCallPress,
  onFoldPress,
}) => {
  const [betInputValue, setBetInputValue] = useState<string>("");

  return (
    <ActionsContainer>
      {canDeal ? (
        <DealButton onClick={onDealPress} title="DEAL">
          DEAL
        </DealButton>
      ) : null}
      {canBet ? (
        <>
          <FlickerBlink />
          <BetInputContainer
            style={{
              marginTop: "10px",
            }}
          >
            <input
              style={{ width: "180px", padding: "3px", fontSize: "15px" }}
              type="text"
              value={betInputValue}
              onChange={(event) => setBetInputValue(event.target.value)}
            />
            <BetRaiseButton
              onClick={() => {
                onBetPress(Number(betInputValue));
                setBetInputValue("");
              }}
              disabled={!betInputValue}
            >
              {canCheck ? (
                <div style={{ cursor: "pointer" }}>Bet</div>
              ) : (
                <div style={{ cursor: "pointer" }}>Raise</div>
              )}
            </BetRaiseButton>
          </BetInputContainer>
          <BetInputContainer
            style={{
              padding: "5px",
            }}
          >
            {canCheck && (
              <>
                <CheckButton onClick={onCheckPress} title="Check">
                  CHECK
                </CheckButton>
              </>
            )}

            <CallButton onClick={onCallPress} title="Call">
              CALL
            </CallButton>
            <FoldButton onClick={onFoldPress} title="Fold">
              FOLD
            </FoldButton>
          </BetInputContainer>
        </>
      ) : null}
    </ActionsContainer>
  );
};

const ActionsContainer = styled.div`
  color: white;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  right: 0;
  bottom: 0;
  margin-bottom: 5px;
  margin-right: 5px;
  padding: 10px;
`;

const DealButton = styled.button`
  margin-left: 10px;
  background: none;
  height: 90px;
  width: 130px;
  border-radius: 14px;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid #31a231;
  color: rgb(79 246 79);
  font-size: 15px;
  margin: 0.4em;
  &:hover {
    background: #16741c;
    color: white;
  }
`;

const BetInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BetRaiseButton = styled.button`
  background: none;
  height: 40px;
  width: 75px;
  border-radius: 9px;
  font-weight: bold;
  border: 1px solid #31a231;
  color: rgb(79 246 79);
  font-size: 13px;
  cursor: pointer;
  margin: 0.4em;
  &:hover {
    background: #16741c;
    color: white;
  }
`;

const CheckButton = styled.button`
  margin-left: 10px;
  background: none;
  height: 80px;
  width: 120px;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid #31a231;
  color: rgb(79 246 79);
  font-size: 15px;
  cursor: pointer;
  &:hover {
    background: #16741c;
    color: white;
  }
`;

const CallButton = styled.button`
  margin-left: 10px;
  background: none;
  height: 80px;
  width: 120px;
  border-radius: 10px;
  font-weight: bold;
  border: 1px solid #31a231;
  color: rgb(79 246 79);
  font-size: 15px;
  cursor: pointer;
  &:hover {
    background: #16741c;
    color: white;
  }
`;

const FoldButton = styled.button`
  margin-left: 10px;
  background: none;
  height: 80px;
  width: 120px;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid #31a231;
  color: rgb(79 246 79);
  font-size: 15px;
  cursor: pointer;
  &:hover {
    background: #16741c;
    color: white;
  }
`;
