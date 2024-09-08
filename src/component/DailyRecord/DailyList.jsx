import React from "react";
import styled from "styled-components";

//ui
import DailyItems from '../DailyRecord/DailyItems.jsx'

//image

//styled
const Wrapper = styled.div`
    width:100%;
`

function DailyList(props) {

    const { posts, onClickItem, imgUrl } = props;
    
    return (
        
        <Wrapper>
            {posts.map((post, index) => {

                return (
                    <DailyItems key={post.id} post={post} imgUrl={imgUrl[index]} onClick={() => onClickItem(post)}></DailyItems>
                );

            })}
        </Wrapper>
        
    )   

}

export default DailyList;