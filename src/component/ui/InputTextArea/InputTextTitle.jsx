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
    outline: none; /* 기본 브라우저 아웃라인 제거 */
    border: none; /* 원하는 포커스 스타일 추가 */
    background-color: none; /* 포커스 시 배경색 변경 */
  }
`

function InputTextTitle(props) {

    const { value, onChange } = props;

    return (
        <StyledTextArea onChange={onChange} value={value} maxLength="50" placeholder={"ex) 멋진 졸업 전시회"} ></StyledTextArea>
    )

}

export default InputTextTitle;