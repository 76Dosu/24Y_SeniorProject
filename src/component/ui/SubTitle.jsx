import React from "react";
import styled from "styled-components";

const SubTitleText = styled.p`
    font-size: 20px;
    font-weight:400;
    line-height:1.4;
    color:white;

    margin-top:${props => props.marginTop};
    margin-bottom:${props => props.marginBottom};
`

function SubTitle(props) {

    const { text, marginTop, marginBottom } = props;

    return (
        <SubTitleText marginTop={marginTop} marginBottom={marginBottom}>{text}</SubTitleText>
    )   

}

export default SubTitle;