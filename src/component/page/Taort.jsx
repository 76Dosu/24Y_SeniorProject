import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { db } from "../../firebase"

import TarotCardList from "../TarotCard/TarotCardList";
import Title from "../ui/Title"
import WriteButtonF from "../ui/Button/WriteButtonF";
import WriteButtonUF from "../ui/Button/WriteButtonUF";

function Tarot(props) {

    const [selectedCount, setSelectedCount] = useState(0)
    const [data, setData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        let tempData = [];

        db.collection('tarot').get().then(function (qs) {
            qs.forEach(function (doc) {
                tempData.push(doc.data()) // <<===== doc마다 tempData를 배열에 추가
            })

            setData(tempData);
        })
    }, [])

    return (

        <Wrapper>

            <CardCount>({selectedCount}/3)</CardCount>
            <Title text="카드 3장을 골라주세요!" />

            <TarotCardList posts={data} setSelectedCount={setSelectedCount} />

            <EntireButtonFrame>
                <WriteButtonFrame onClick={(e) => { navigate(-1) }}>
                    <WriteButtonUF buttonName="뒤로가기"></WriteButtonUF>
                </WriteButtonFrame>

                <WriteButtonFrame>
                    <WriteButtonF buttonName="다음으로"></WriteButtonF>
                </WriteButtonFrame>
            </EntireButtonFrame>
        </Wrapper>

    )

}

const Wrapper = styled.div`
    width:100%;
    height:100vh;
    padding:0px 11.54%;

    display:flex;
    flex-direction: column;
    align-items:center;
    justify-content: center;

    background-color:var(--main-bcColor);
`

const CardCount = styled.div`
    margin-bottom: 8px;
    font-size: 24px;
    color: white;
`;

const EntireButtonFrame = styled.div`
    display:flex;
    align-items:center;
    justify-content:flex-end;

    margin-top:60px;    
`

const WriteButtonFrame = styled.div`
    display:flex;
    width:fit-content;

    margin-right:20px;

    &:last-child {
        margin-right:0px;
    }
`

export default Tarot;