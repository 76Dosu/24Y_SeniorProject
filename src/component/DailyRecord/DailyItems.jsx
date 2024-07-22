import React from "react";
import styled from "styled-components";

//ui

//image

//styled
const Wrapper = styled.div`
    width:100%;
    padding:24px;
    margin-bottom:24px;

    background-color:#2B3034;
    border-radius:8px;

    &:first-child {
        margin-top:24px;
    }

    &:last-child {
        margin-bottom:0px;
    }
`

const DailyTItle = styled.p`
    font-size:24px;
    color:white;
    font-weight:bold;
`

const DailyWriteTime = styled.p`
    width:14px;
    color:#888;
`

function DailyItems(props) {

    const { post } = props;

    return (
        
        <Wrapper>
            <DailyTItle>{post.title}</DailyTItle>
            <DailyWriteTime>{post.date}</DailyWriteTime>
        </Wrapper>
        
    )   

}

export default DailyItems;