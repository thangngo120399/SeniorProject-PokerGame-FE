import styled, { css } from "styled-components";
import React from "react";
import { FCWithoutChildren } from "../../types/component";
export const FlipCards: FCWithoutChildren<{ index: number }> = ({ index }) => {
  return (
    <CardContainer index={index}>
      <Content />
    </CardContainer>
  );
};

const CardContainer = styled.div<{
  index: number;
}>`
  ${({ index }) =>
    index === 2 ? "transform: rotate(10deg)" : "transform: rotate(-10deg)"};

  background: #fff;
  display: flex;
  padding: 0.125rem 0.25rem;
  width: 3.5rem;
  height: 4.5rem;
  border-radius: 8px;
  box-shadow: 0 0 0.8rem 0 rgb(0 0 0 / 40%);
`;

const Content = styled.div`
  width: 100%;
  background: url(https://cdn.pokernow.club/card-back-e179802aacf69d36821f780d501e4706.png);
  background-size: cover;
  background-position: center;
`;
