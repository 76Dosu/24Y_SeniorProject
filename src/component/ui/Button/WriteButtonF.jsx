import React from "react";
import styled from "styled-components";

const StyledButton = styled.div`
    width:fit-content;
    padding:16px 24px;
    background-color:white;
    border:1px solid white;
    border-radius:56px;
    font-size:18px;
    font-weight:bold;
    color:#15191C;

    transition: .3s;
    cursor: pointer;

    &:hover {
        background-color:white;
        color:#2B3034;
    }
`

function WriteButtonF(props) {

    const { buttonName } = props;

    return (
        <StyledButton>{buttonName}</StyledButton>
    )   

}

export default WriteButtonF;