import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { db } from "../../firebase"

import TarotCardList from "../TarotCard/TarotCardList";

function Tarot(props) {

    const [data, setData] = useState([]);

    useEffect(() => {
        let tempData = [];

        db.collection('tarot').get().then(function(qs) {
            qs.forEach(function(doc) {
                tempData.push(doc.data()) // <<===== doc마다 tempData를 배열에 추가
            })

            setData(tempData);
        })
    }, [])

    return (
        
        <Wrapper>

            <TarotCardList posts={data}/>

        </Wrapper>

    )   

}

const Wrapper = styled.div`
    width:100%;
    min-height:100vh;
    padding:0px 11.54% 100px 11.54%;

    background-color:var(--main-bcColor);
`

export default Tarot;