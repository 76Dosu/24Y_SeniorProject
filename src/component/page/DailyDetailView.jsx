import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

import { db } from '../../firebase'

//image

//styled
const Wrapper = styled.div`
    width:100%;
    padding:0px 11.54% 100px 11.54%;

    background-color:var(--main-bcColor);
`

const Title = styled.p`
    font-size:20px;
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
        db.collection('post').doc(postId).get().then(function(doc) {
            setPost(doc.data())
        })     
    },[postId]);

    return (
        
        <Wrapper>

            <Title>{post.title}</Title>

        </Wrapper>
        
    )   

}

export default DailyDetailView;