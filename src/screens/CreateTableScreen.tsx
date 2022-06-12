import React, { useReducer, useCallback } from "react";
import styled from "styled-components";

import ConnectionStatus from "../components/ConnectionStatus";

import type { Reducer, FormEventHandler, ChangeEventHandler } from "react";
import type { FCWithoutChildren } from "../types/component";
import type { CreateTableOptions } from "../state/store";

import "./CreateTableScreen.scss";

const updateOptionsAction = (payload: Partial<CreateTableOptions>) => ({
  payload,
  type: "updateOptions",
});

const reducer: Reducer<
  CreateTableOptions,
  ReturnType<typeof updateOptionsAction>
> = (state, action) => {
  switch (action.type) {
    case "updateOptions":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const CreateTableScreen: FCWithoutChildren<{
  onCreateTable: (options: CreateTableOptions) => void;
}> = ({ onCreateTable }) => {
  const [state, dispatch] = useReducer(reducer, {
    tableName: "",
    numberOfSeats: 5,
    smallBlind: 1,
    startingChipCount: 100,
    highlightRelevantCards: false,
  });

  const handleSubmit = useCallback<FormEventHandler>(
    (event) => {
      event.preventDefault();
      if (state.tableName) onCreateTable(state);
    },
    [onCreateTable, state]
  );

  const handleTableNameChange = useCallback<InputChangeHandler>(
    (event) => dispatch(updateOptionsAction({ tableName: event.target.value })),
    []
  );

  const handleNumSeatsChange = useCallback<InputChangeHandler>(
    (event) =>
      dispatch(
        updateOptionsAction({ numberOfSeats: Number(event.target.value) })
      ),
    []
  );

  const handleSmallBlindChange = useCallback<InputChangeHandler>(
    (event) =>
      dispatch(updateOptionsAction({ smallBlind: Number(event.target.value) })),
    []
  );

  const handleChipCountChange = useCallback<InputChangeHandler>(
    (event) =>
      dispatch(
        updateOptionsAction({ startingChipCount: Number(event.target.value) })
      ),
    []
  );

  const handleHighlightRelevantCardsChange = useCallback<InputChangeHandler>(
    (event) =>
      dispatch(
        updateOptionsAction({
          highlightRelevantCards: event.target.checked,
        })
      ),
    []
  );

  return (
    <Wrapper>
      <Container>
        <ConnectionStatus />
        <CreateTableForm onSubmit={handleSubmit}>
          <Title>CREATE TABLE</Title>
          <FormItem>
            Table Name:
            <FormInput
              value={state.tableName}
              onChange={handleTableNameChange}
              placeholder={"Type the TableName"}
            />
          </FormItem>
          <FormItem>
            Number of players:
            <FormInputNumber
              min="2"
              max="10"
              value={state.numberOfSeats}
              onChange={handleNumSeatsChange}
            />
          </FormItem>
          <FormItem>
            Small Blind:
            <FormInputNumber
              min="1"
              value={state.smallBlind}
              onChange={handleSmallBlindChange}
            />
          </FormItem>
          <FormItem>
            Starting Chip Count:
            <FormInputNumber
              min="50"
              value={state.startingChipCount}
              onChange={handleChipCountChange}
            />
          </FormItem>
          <FormItem>
            Highlight Relevant Cards:
            <FormCheckBox
              type="checkbox"
              name="highlightRelevantCards"
              value="Highlight Relevant Cards:"
              checked={state.highlightRelevantCards}
              onChange={handleHighlightRelevantCardsChange}
            />
          </FormItem>
          <SubmitButton disabled={!state.tableName}>Submit</SubmitButton>
        </CreateTableForm>
      </Container>
      <ul className="bg-bubbles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </Wrapper>
  );
};

export default CreateTableScreen;

const Wrapper = styled.div`
  display: flex;
  flex: 1 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #50a3a2;
  background: -webkit-linear-gradient(
    top left,
    #8bcaa6 0%,
    #3fa76c 30%,
    #8bcaa6 70%,
    #256440 100%
  );
  height: 96vh;
`;

const Container = styled.div``;

const Title = styled.h1`
  color: white;
  border-bottom: 1px solid white;
  padding-bottom: 20px;
`;

const CreateTableForm = styled.form`
  box-shadow: 0px 2px 30px 2px #d3d0d0;
  text-align: center;
  border-radius: 50px;
  margin-top: 4%;
  padding: 20px;
  background: rgba(1, 1, 1, 0.6);
  display: inline-block;
  width: 500px;
  color: black;
  display: flex;
  flex-direction: column;
  border: 1px solid #9fd3b5;
  z-index: 2;
`;

const FormItem = styled.label`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  color: white;
`;

const FormInput = styled.input.attrs(() => ({ type: "text" }))`
  width: 170px;
  margin-left: 1em;
  border-radius: 5px;
  border: 2px solid white;
  padding: 2px;
  z-index: 3;
`;
const FormInputNumber = styled.input.attrs(() => ({ type: "number" }))`
  margin-left: 1em;
  width: 170px;
  border-radius: 5px;
  border: 2px solid white;
  padding: 2px;
  z-index: 3;
`;
const FormCheckBox = styled.input.attrs(() => ({ type: "checkbox" }))`
  margin-left: 1em;
  cursor: pointer;
  z-index: 3;
`;

const SubmitButton = styled.button`
  background: rgba(63, 167, 108, 1);
  margin-top: 10px;
  width: 300px;
  height: 55px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  color: white;
  font-family: Quicksand;
  align-self: center;
  margin-top: 20px;
  border: 1px solid white;
  z-index: 3;
  &:hover {
    color: white;
    background: rgb(84 158 65);
    cursor: pointer;
  }
`;

type InputChangeHandler = ChangeEventHandler<HTMLInputElement>;
