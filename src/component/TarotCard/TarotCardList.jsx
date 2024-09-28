import React, { useEffect } from "react";
import styled from "styled-components";

//ui
import TarotCard from "./TarotCard.jsx";

function TarotCardList(props) {

    const { posts } = props;

    return (
        
        <Wrapper>
            {posts.map((post) => {

                return (
                    <TarotCard key={post.id} post={post}/>
                );

            })}
        </Wrapper>
        
    )   

}

//styled
const Wrapper = styled.div`
    width:fit-content;
`


export default TarotCardList;