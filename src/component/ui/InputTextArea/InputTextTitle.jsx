import React from "react";
import styled from "styled-components";

const StyledTextArea = styled.textarea`
    width:100%;
    height:76px;
    padding:24px 12px;

    border-radius: 8px;
    
    font-size:28px;
    font-weight:700;
    line-height:1;
    color:white;
    background-color:transparent;
    border:none;
    resize:none; 

    &:focus {
    outline: none;
    border: none;
    background-color: none;
  }
`

function InputTextTitle(props) {

    const { value, onChange } = props;

    return (
        <StyledTextArea onChange={onChange} value={value} maxLength="50" placeholder={"본인의 이름을 적어주세요"} ></StyledTextArea>
    )

}

export default InputTextTitle;