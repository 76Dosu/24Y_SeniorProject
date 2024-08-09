import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { db } from "../../firebase"

//ui
import Header from "../ui/Header";
import WriteButtonF from "../ui/Button/WriteButtonF";
import WriteButtonUF from "../ui/Button/WriteButtonUF";

import Title from "../ui/Title";

import InputTextContents from "../ui/InputTextArea/InputTextContents";
import InputTextTitle from "../ui/InputTextArea/InputTextTitle";

//styled
const Wrapper = styled.div`
    width:100%;
    height:100vh;
    padding:0px 11.54%;
    background-color:var(--main-bcColor);
`

const TitleFrame = styled.div`
    width:100%;
    display:flex;
    align-items:flex-end;
    
    margin-top:100px;
`

const DivideLine = styled.div`
    height:1px;
    background-color:white;
    margin:12px 0px 0px 0px;
`

const WriteFrame = styled.div`
    display:flex;
    flex-direction: column;
`

const InputFrame = styled.div`
    display:flex;
    align-items:flex-start;
    border-bottom:2px solid #333;
`

const InputTitleFrame = styled(InputFrame)`
    display:flex;
    align-items:center;
`

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

const TestText = styled.p`
    font-size:24px;
`

function DailyWrite(props) {

    const navigate = useNavigate()

    // 사용자 입력 받아오기
    const [title, setTitle] = useState("")
    const [prompt, setPrompt] = useState("");
    const [results, setResults] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleContentsChange = (e) => {
        setPrompt(e.target.value);
    }
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    // axios로 사용자 데이터 db.json으로 넘기기
    const onSubmit = () => {
        let timestamp = new Date().getTime().toString();

        let year = new Date().getFullYear()
        let month = new Date().getMonth();
        let day = new Date().getDate()
        let myTime = `${year}.${month + 1}.${day}`

        db.collection('daily').doc(timestamp).set({
            id: timestamp,
            title : title,
            prompt: prompt,
            keyword: results,
            date: myTime,
        })

        // axios.post(`http://localhost:3001/posts`, {
        //     id: timestamp,
        //     title : title,
        //     prompt: prompt,
        //     keyword: results,
        //     date: myTime,
        //     image:'',
        // })

        navigate('/choicePicture', {state : {timestamp}})
    };

    const handleClick = (e) => {
        callGPT(prompt, results);
    }

    useEffect(() => {
        if (isSubmitted) {
            onSubmit();
            setIsSubmitted(false);
        }
    }, [isSubmitted, results]);

    const createDaily = (e) => {
        setPrompt("오늘은 날씨가 너무 좋았다. 아침에 일어나자마자 창문을 열었는데, 맑은 하늘과 시원한 바람이 느껴져서 기분이 상쾌했다. 출근 준비를 마치고 집을 나서기 전에 근처 카페에 들러 따뜻한 라떼 한 잔을 샀다. 카페 사장님이 친절하게 인사해주셔서 아침부터 기분이 좋았다. 출근길에 음악을 들으며 여유롭게 걸었다. 회사에 도착해서는 큰 프로젝트를 마무리하느라 바쁜 시간을 보냈다. 팀원들과 협력하며 문제를 해결해 나가는 과정이 뜻깊었다. 드디어 프로젝트가 성공적으로 끝나서 모두가 환호했다. 점심시간에는 동료들과 함께 새로운 식당을 찾아갔다. 추천받은 파스타를 주문했는데, 정말 맛있어서 모두가 만족했다. 식사 후에는 근처 공원에서 잠시 산책을 하며 소화를 시켰다. 오후에는 조금 피곤했지만, 커피 한 잔을 마시고 나니 다시 기운이 났다. 퇴근 후에는 집으로 바로 가지 않고 공원에 들러 산책을 했다. 저녁 노을이 아름다워서 사진도 몇 장 찍었다. 집에 돌아와서는 가족들과 함께 저녁 식사를 준비했다. 오늘 메뉴는 모두가 좋아하는 불고기였다. 식사를 하면서 하루 동안 있었던 일들을 이야기하며 즐거운 시간을 보냈다. 식사 후에는 설거지를 도와드리고, 잠시 거실에서 TV를 보며 휴식을 취했다. 피곤했지만 만족스러운 하루였다. 잠들기 전에 좋아하는 책을 조금 읽으며 하루를 마무리했다. 오늘도 감사한 하루였다.");
    };

    const ENDPOINT_URL = "https://api.openai.com/v1/chat/completions";
    const GPT_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

    // callGPT([질문], [저장할 배열])
    function callGPT(prompt) {
        fetch(ENDPOINT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GPT_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: `${prompt}라는 내용의 일기를 요약할 수 있는 키워드 5개를 순서없이 한줄에 나열해줘. 연결은 콤마로 해줘`
                }]  
            })
        })
            .then(response => response.json())
            .then(data => {
                // 응답은 data.choices[0].message.content로 불러와져서 result 배열에 저장
                setResults((data.choices[0].message.content));
                setIsSubmitted(true);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    return (

        <Wrapper>
            <Header></Header>

            <TitleFrame>
                <Title text="하루를 기록해보세요!"></Title>
            </TitleFrame>

            <DivideLine />

            <WriteFrame>
                <InputTitleFrame>
                    <InputTextTitle onChange={handleTitleChange} value={title}></InputTextTitle>
                </InputTitleFrame>

                <InputFrame>
                    <InputTextContents onChange={handleContentsChange} value={prompt}></InputTextContents>
                </InputFrame>
            </WriteFrame>

            <TestText>{results}</TestText>


            <EntireButtonFrame>
                <WriteButtonFrame onClick={createDaily}>
                    <WriteButtonUF buttonName="테스트 일기생성"></WriteButtonUF>
                </WriteButtonFrame>     

                <WriteButtonFrame onClick={(e) => {navigate(-1)}}>
                    <WriteButtonUF buttonName="뒤로가기"></WriteButtonUF>
                </WriteButtonFrame>

                <WriteButtonFrame onClick={handleClick}>
                    <WriteButtonF buttonName="다음으로"></WriteButtonF>
                </WriteButtonFrame>
            </EntireButtonFrame> 

        </Wrapper>

    )

}

export default DailyWrite;  