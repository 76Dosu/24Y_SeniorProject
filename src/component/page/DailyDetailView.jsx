import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from 'styled-components';

import { db } from '../../firebase'

import Header from "../ui/Header";
import Title from "../ui/Title"

// style
const Wrapper = styled.div`
    width:100%;
    min-height:100vh;
    padding:0px 11.54% 100px 11.54%;

    background-color:var(--main-bcColor);
`

const TitleFrame = styled.div`
    width:100%;
    margin-top:100px;
`
const DailyScore = styled.p`
    font-size: 20px;
    font-weight: 400;
    color:var(--main-color);
    margin-bottom:8px;
`

const DivideLine = styled.div`
    height:1px;
    background-color:white;
    margin:12px 0px 0px 0px;
`

const ContentsContainer = styled.div`
    width:100%;
    margin-top:24px;

    display:flex;
    gap:24px;
`

// 일기 내용
const DailyContainer = styled.div`
    width:100%;
    height:fit-content;
    border-radius:8px;
    background-color:#2B3034;
    padding:20px;
`

const DailyContentsTitle = styled.p`
    font-size: 24px;
    font-weight: 700;
    color:white;
`

const DailyKeywordFrame = styled.p`
    width:fit-content;
    display:flex;
    align-items: center;
    gap:12px;
    margin-top:12px;
`

const DailyKeyword = styled.p`
    width:fit-content;
    font-size: 14px;
    font-weight: 400;
    color:#2B3034;
    background-color:white;
    border-radius:50px;
    padding:8px 16px;
`

const DailyContents = styled.p`
    font-size:16px;
    font-weight: 400;
    line-height:1.8;
    color:#DDDDDD;

    margin:24px 0px 0px 0px;
`

const DailyImage = styled.img`
    width:50%;
    border-radius:8px;
    margin-top:60px;
`

// 일기 분석 내용
const DailyAnalContainer = styled.div`
    width:100%;
    height:fit-content;
    border-radius:8px;
    background-color:#2B3034;
    padding:20px;
`

const DailyAnalysisItem = styled.div`
    width:100%;
    margin-bottom:60px;

    &:last-child {
        margin-bottom:0px;
    }
`

function DailyDetailView() {

    const postId = useParams().id;

    const [post, setPost] = useState({
        id : "",
        date: "",
        choosedImage: "",
        keyword: "",
        prompt: "",
        title : "",
        score : "",
        reason : "",
        solution : ""
    })

    useEffect(() => {
        db.collection('daily').doc(postId).get().then(function(doc) {
            setPost(doc.data())

            setKeywordArray(doc.data().keyword.split(',').map(item => item.trim()));
        })
    },[postId]);

    const [keywordArray, setKeywordArray] = useState([]);


    return (
        
        <Wrapper>

            <Header/>
            
            <TitleFrame>
                
                <DailyScore>일기 점수 {post.score}점</DailyScore>
                <Title text={post.title}/>
                <DailyKeywordFrame>
                    <DailyKeyword>{keywordArray[0]}</DailyKeyword>
                    <DailyKeyword>{keywordArray[1]}</DailyKeyword>
                    <DailyKeyword>{keywordArray[2]}</DailyKeyword>
                    <DailyKeyword>{keywordArray[3]}</DailyKeyword>
                    <DailyKeyword>{keywordArray[4]}</DailyKeyword>
                </DailyKeywordFrame>
            </TitleFrame>
            <DivideLine />

            <ContentsContainer>

                
                {/* 일기 내용 */}
                <DailyContainer>
                    <DailyContentsTitle>일기 내용</DailyContentsTitle>
                    <DailyContents>{post.prompt}</DailyContents>
                    <DailyImage src={post.choosedImage}/>
                </DailyContainer>

                {/* 일기 분석 내용 */}
                <DailyAnalContainer>

                    {/* 근거 */}
                    <DailyAnalysisItem>
                        <DailyContentsTitle>분석 근거</DailyContentsTitle>
                        <DailyContents>{post.reason}</DailyContents>
                    </DailyAnalysisItem>

                    {/* 피드백 */}
                    <DailyAnalysisItem>
                        <DailyContentsTitle>감정 피드백</DailyContentsTitle>
                        <DailyContents>{post.solution}</DailyContents>
                    </DailyAnalysisItem>
                    
                </DailyAnalContainer>

            </ContentsContainer>

        </Wrapper>
        
    )   

}

export default DailyDetailView;