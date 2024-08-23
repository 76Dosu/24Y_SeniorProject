import React from "react";
import styled from "styled-components";

const SubTitleText = styled.p`
    font-size: 20px;
    font-weight:400;
    line-height:1.4;
    color:white;

    margin-top:${props => props.mt};
    margin-bottom:${props => props.mb};
`

function SubTitle(props) {

    const { text, mt, mb } = props;

    return (
        <SubTitleText mt={mt} mb={mb}>{text}</SubTitleText>
    )   

}

export default SubTitle;