import React from "react";
import styled from "styled-components";

const StyledButton = styled.div`
    width:fit-content;
    padding:16px 24px;
    background-color:#2B3034;
    border:1px solid #2B3034;
    border-radius:56px;

    font-size:18px;
    font-weight:bold;
    color:white;

    transition: .3s;
    cursor: pointer;

    &:hover {
        background-color:var(--main-color);
        border:1px solid var(--main-color);
        color:white;
    }
`

function WriteButtonUF(props) {

    const { buttonName } = props;

    return (
        <StyledButton>{buttonName}</StyledButton>
    )   

}

export default WriteButtonUF;