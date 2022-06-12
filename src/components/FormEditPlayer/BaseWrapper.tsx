import React, { useState } from "react";
import Modal from "./Index";
import styled from "styled-components";
import { DesktopModalContainer } from "./ModalPopup.style";
interface BaseWrapperProps {
  isModalVisible: boolean;
  onBackdropClick: () => void;
  onCancel: () => void;
  onSubmitName: (arg: string) => void;
}

const BaseWrapper: React.FC<BaseWrapperProps> = ({
  onBackdropClick,
  isModalVisible,
  onSubmitName,
  onCancel,
}) => {
  const [name, setName] = useState<string>("");
  const handleNameInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  if (!isModalVisible) {
    return null;
  }

  return (
    <Modal
      onBackdropClick={onBackdropClick}
      onSubmitName={onSubmitName}
      onCancel={onCancel}
    >
      <DesktopModalContainer>
        <form
          onSubmit={(e: React.SyntheticEvent) => {
            e.preventDefault();
            console.log(name);
            onSubmitName(name);
            onCancel();
          }}
        >
          <h3 style={{ color: "rgb(130 223 45)" }}>Change Name Display</h3>
          <input
            onChange={handleNameInputChange}
            value={name}
            id="player-name"
            type="text"
            placeholder="Typing your name"
            name="playerName"
            maxLength={10}
            style={{
              display: "block",
              margin: "5px auto",
              height: "10%",
              padding: "10px",
            }}
          />
          <div style={{ marginTop: "20px" }}>
            <SubmitButton type="submit" title="CHANGE">
              {" "}
              CHANGE NAME
            </SubmitButton>
            <CancelButton onClick={onCancel} title="CANCEL">
              {" "}
              CANCEL
            </CancelButton>
          </div>
        </form>
      </DesktopModalContainer>
    </Modal>
  );
};
export default BaseWrapper;
const SubmitButton = styled.button`
  color: rgb(130 223 45);
  cursor: pointer;

  background: none;
  margin-right: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid rgb(130 223 45);
  &:hover {
    background: #057a05;
    color: white;
    font-weight: bold;
  }
`;
const CancelButton = styled.button`
  color: black;
  cursor: pointer;
  background: gray;
  margin-right: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid green;
  &:hover {
    background: #33333;
    color: rgb(130 223 45);
    font-weight: bold;
  }
`;
