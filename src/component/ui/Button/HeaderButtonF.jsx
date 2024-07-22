import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledButton = styled.div`
    width:fit-content;
    padding:12px 16px;
    margin-right:${props => props.marginRight};
    background-color:var(--main-color);
    border:1px solid var(--main-color);
    border-radius:50px;

    font-size:18px;
    font-weight:bold;
    color:white;

    transition: .3s;
    cursor: pointer;

    &:hover {
        background-color:var(--main-color);
        color:white;
    }
`

function FunctionButtonF(props) {

    const navigate = useNavigate();
    const { buttonName, marginRight, navigateLink } = props;

    return (
        <StyledButton onClick={() => {navigate(`/${navigateLink}`)}} marginRight={marginRight}>{buttonName}</StyledButton>
    )   

}

export default FunctionButtonF;