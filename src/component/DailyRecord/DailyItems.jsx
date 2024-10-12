import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

//styled
const Wrapper = styled.div`
    display:flex;

    width:49%;
    max-height:200px;
    min-height:200px;
    padding:24px;
    margin-top: 24px;

    background-color:#2B3034;
    border-radius:8px;
    cursor:pointer;
    transition:.3s;

    &:hover {
        background-color:#444;
    }
`

const DailyInfoContainer = styled.div`
    width:100%;
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
    font-size:14px;
    color:#888;
    margin-top:auto;
`

const Daily = styled.p`
    width:100%;
    font-size:14px;
    line-height:1.4;
    color:#CCC;
    margin-top: 8px;
`

function DailyItems(props) {
    const { post, imgUrl } = props;
    const navigate = useNavigate();

    const testClick = () => {
        navigate('/post/' + post.id)
    }

    // prompt의 길이를 100자로 제한
    const truncatedPrompt = post.prompt.length > 100
        ? post.prompt.slice(0, 100) + "..."
        : post.prompt;

    return (
        <Wrapper onClick={testClick}>
            <DailyImage src={imgUrl} />

            <DailyInfoContainer>
                <DailyTItle>{post.title}</DailyTItle>
                <Daily>{truncatedPrompt}</Daily>
                <DailyWriteTime>{post.date}</DailyWriteTime>
            </DailyInfoContainer>
        </Wrapper>
    );
}

export default DailyItems;