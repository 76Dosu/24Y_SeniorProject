import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

//ui

//image

//styled
const Wrapper = styled.div`
    display:flex;

    width:100%;
    padding:24px;
    margin-bottom:24px;

    background-color:#2B3034;
    border-radius:8px;
    cursor:pointer;

    &:first-child {
        margin-top:24px;
    }

    &:last-child {
        margin-bottom:0px;
    }
`

const DailyInfoContainer = styled.div`
    display:flex;
    flex-direction:column;
`

const DailyImage = styled.img`
    width: 160px;
    height: 160px;
    object-fit: cover;
    border-radius:4px;

    margin-right:32px;
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
    const navigate = useNavigate();

    const testClick = () => {

        navigate('/post/' + post.id)

    }

    return (
        
        <Wrapper onClick={testClick}>
            <DailyImage src={post.choosedImage}/>

            <DailyInfoContainer>
                <DailyTItle>{post.title}</DailyTItle>
                <DailyWriteTime>{post.date}</DailyWriteTime>
            </DailyInfoContainer>
            
        </Wrapper>
        
    )   

}

export default DailyItems;