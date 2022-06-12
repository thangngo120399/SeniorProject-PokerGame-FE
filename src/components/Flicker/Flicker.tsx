import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Flicker } from "react-flicker";
function FlickerBlink() {
  return (
    <FlickerContainer>
      <Flicker interval={100} jumpChangeFreq={0.1}>
        <Point />
      </Flicker>

      <FlickerItem>YOUR TURN</FlickerItem>
    </FlickerContainer>
  );
}

export default FlickerBlink;
const FlickerContainer = styled.div`
  width: 200px;
  color: #ff0;
  text-align: center;
`;
const Point = styled.div`
  width: 15px;
  height: 15px;
  display: inline-block;
  border-radius: 10px;
  background: yellow;
  margin-right: 10px;
  box-shadow: 0 0 1rem #ebff;
`;
const FlickerItem = styled.div`
  font-size: 15px;
  display: inline-block;
`;
