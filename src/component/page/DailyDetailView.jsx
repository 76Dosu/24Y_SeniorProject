import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from 'styled-components';

import { db } from '../../firebase'

import Header from "../ui/Header";
import Title from "../ui/Title"

// style
const Wrapper = styled.div`
    width:100%;
    padding:0px 11.54% 100px 11.54%;

    background-color:var(--main-bcColor);
`

const TitleFrame = styled.div`
    width:100%;
    margin-top:100px;
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
    border-radius:8px;
    background-color:#2B3034;
    padding:20px;
`

const DailyContentsTitle = styled.p`
    font-size: 24px;
    font-weight: 700;
    color:white;
`

const DailyContents = styled.p`
    font-size:16px;
    font-weight: 400;
    line-height:1.8;
    color:#DDDDDD;

    margin:16px 0px 60px 0px;
`

const DailyImage = styled.img`
    width: 200px;
    border-radius:8px;
`

// 일기 분석 내용
const DailyAnalContainer = styled.div`
    width:100%;
    border-radius:8px;
    background-color:#2B3034;
    padding:20px;
`

function DailyDetailView() {

    const postId = useParams().id;

    const [post, setPost] = useState({
        id : "",
        date: "",
        image: "",
        keyword: "",
        prompt: "",
        title : "",
    })

    useEffect(function() {
        db.collection('daily').doc(postId).get().then(function(doc) {
            setPost(doc.data())
        })     
    },[postId]);

    return (
        
        <Wrapper>

            <Header/>
            
            <TitleFrame>
                <Title text={post.title}/>
            </TitleFrame>
            <DivideLine />

            <ContentsContainer>
                {/* 일기 내용 */}
                <DailyContainer>
                    <DailyContentsTitle>일기 내용</DailyContentsTitle>
                    <DailyContents>{post.prompt}</DailyContents>

                    <DailyImage src={post.image}/>
                </DailyContainer>

                {/* 일기 분석 내용 */}
                <DailyAnalContainer>
                    <DailyContentsTitle>분석 내용</DailyContentsTitle>
                </DailyAnalContainer>

            </ContentsContainer>

        </Wrapper>
        
    )   

}

export default DailyDetailView;