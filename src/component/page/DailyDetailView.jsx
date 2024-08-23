import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

import { db } from '../../firebase'

import Header from "../ui/Header";
import Title from "../ui/Title"

//styled
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


function DailyDetailView(props) {

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
                <DailyContainer></DailyContainer>
            </ContentsContainer>

        </Wrapper>
        
    )   

}

export default DailyDetailView;