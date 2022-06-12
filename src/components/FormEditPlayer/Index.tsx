import React, { useState } from "react";
import ReactDom from "react-dom";
import  styled from "styled-components";
import "./FormEditPlayer.css";
interface ModalProps{
  onBackdropClick:()=>void;
  onCancel:()=>void;
  onSubmitName:(arg:string)=>void;
}

const Overlay = styled.div`
  background-color:rgba(0,0,0,0.6);
  z-index: 10000;
  position: fixed;
  height: 100%;
  width: 100%;
   top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    `;
const Modal: React.FC<ModalProps> = ({onBackdropClick, children, onSubmitName, onCancel})=>{
  return ReactDom.createPortal(<Overlay>
    {children}

  </Overlay>, document.getElementById('modal-root')!);
}
export default Modal;
