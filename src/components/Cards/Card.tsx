import styled, { css } from "styled-components";
import React from "react";
import { boolean } from "@storybook/addon-knobs";
import { Card } from "@pairjacks/poker-cards";
import { FCWithoutChildren } from "../../types/component";
import { useStore } from "../../state/store";
const f = {
  Two: "2",
  Three: "3",
  Four: "4",
  Five: "5",
  Six: "6",
  Seven: "7",
  Eight: "8",
  Nine: "9",
  Ten: "10",
  Jack: "J",
  Queen: "Q",
  King: "K",
  Ace: "A",
};

const s = {
  Diamonds: "♦",
  Clubs: "♣",
  Heart: "♥",
  Spades: "♠",
};

const colors = {
  Diamonds: "#db3131",
  Heart: "#db3131",
  Clubs: "#2c2c2c",
  Spades: "#2c2c2c",
};

export const CardComponent: FCWithoutChildren<{
  index?: number;
  card: Card;
  isBig?: boolean;
  highlight?: boolean;
}> = ({ index, card, isBig = false, highlight = false }) => {
  const [face, suit] = card;
  const store = useStore();

  return (
    <CardContainer
      index={index}
      color={colors[suit]}
      isBig={isBig}
      highlight={store.data.table?.highlightRelevantCards ? highlight : false}
      isHighLightCard={store.data.table!.highlightRelevantCards}
    >
      <F isBig={isBig}>{f[face]}</F>
      <S isBig={isBig}>{s[suit]}</S>
    </CardContainer>
  );
};
const CardContainer = styled.div<{
  index?: number;
  color: string;
  isBig: boolean;
  highlight: boolean;
  isHighLightCard: boolean;
}>`
  ${({ index }) =>
    index
      ? index === 2
        ? "transform: rotate(10deg)"
        : "transform: rotate(-10deg)"
      : ""};
  
  width: 3.65rem;
  height: 5rem;
  position: relative;
  background: white;
  border-radius: 8px;
  font-size: bold;
  box-shadow: 0 0 0.8rem 0 rgb(0 0 0 / 40%);
  ${({ color }) => `color: ${color};`}
  ${({ isBig }) =>
    isBig &&
    css`
      width: 4.5rem;
      height: 6rem;
    `}
    box-shadow:
    ${({ highlight, isHighLightCard }) =>
      isHighLightCard
        ? highlight
          ? "-9px 12px 0px -4px #34c6b3ee"
          : "none"
        : ""};
     opacity:
    ${({ highlight, isHighLightCard }) =>
      isHighLightCard ? (highlight ? "1" : "0.8") : "1"};
`;

const F = styled.div<{
  isBig: boolean;
}>`
  position: absolute;
  font-size: 26px;
  font-weight: 600;
  left: 10%;

  ${({ isBig }) => isBig && `font-size: 35px;`}
`;

const S = styled.div<{
  isBig: boolean;
}>`
  position: absolute;
  font-size: 50px;
  top: 50%;
  left: 50%;
  transform: translate(-40%, -40%);
  ${({ isBig }) => isBig && `font-size: 70px;`}
`;
