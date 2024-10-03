import React from "react";
import styled from "styled-components";

const TitleText = styled.p`
    font-size: 32px;
    font-weight:600;
    color:white;
`

function Title(props) {

    const { text } = props;

    return (
        <TitleText>{text}</TitleText>
    )   

}

export default Title;