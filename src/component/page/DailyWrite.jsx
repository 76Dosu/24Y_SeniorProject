import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
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
    min-height:100vh;
    padding:0px 11.54% 100px 11.54%;
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

const LoadingContainer = styled.div`
    width:100vw;    
    height:100vh;
    position:fixed;
    top:0;
    left:0;
    z-index:99;
    background-color:rgba(0, 0, 0, 0.7);
    
    display:flex;
    align-items:center;
    justify-content:center;
`

const typingAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-50%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const LoadingText = styled.p`
    font-size:24px;
    color:white;
    display: inline-block;
    span {
        display: inline-block;
        opacity: 0;
        animation: ${typingAnimation} 2s infinite;
        animation-delay: calc(0.1s * var(--i));
    }
`;

function DailyWrite(props) {

    const navigate = useNavigate()

    // 사용자 입력 받아오기
    const [title, setTitle] = useState("")
    const [prompt, setPrompt] = useState("");

    
    const [results, setResults] = useState(""); // callGPTKeyword 결과
    const [emotionalScore, setEmotionalScore] = useState("");// callGPTAnalysis
    const [analysisReason, setAnalysisReason] = useState(""); // callGPTReason
    const [analysisSolution, setAnalysisSolution] = useState(""); // callGPTSolution
    const [tarot, setTarot] = useState(""); // callGPTTarot

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const handleContentsChange = (e) => {
        setPrompt(e.target.value);
    }
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    // axios로 사용자 데이터 db.json으로 넘기기
    const onSubmit = useCallback(() => {
        let timestamp = new Date().getTime().toString();
    
        let year = new Date().getFullYear();
        let month = new Date().getMonth();
        let day = new Date().getDate();
        let myTime = `${year}.${month + 1}.${day}`;
    
        db.collection('daily').doc(timestamp).set({
            id: timestamp,
            title: title,
            prompt: prompt,
            keyword: results,
            date: myTime,
            score: emotionalScore,
            reason: analysisReason,
            solution: analysisSolution,
            tarot: tarot,
        });

        if (emotionalScore >= 80) {
            db.collection('tarot').doc(timestamp).set({
                id: timestamp,
                title: title,
                prompt: prompt,
                date: myTime,
                tarot: tarot,
            });
        }
    
        navigate('/choicePicture', { state: { timestamp, results } }); 
    }, [title, prompt, results, emotionalScore, analysisReason, analysisSolution, tarot, navigate]); // 필요한 의존성 추가

    const handleClick = async (e) => {
        try {

            await callGPTKeyword(prompt);
            await callGPTAnalysis(prompt);
            await callGPTReason(prompt);
            await callGPTSolution(prompt);
            await callGPTTarot(prompt);
            
            setIsSubmitted(true);

        } catch (error) {
            console.error("Error:", error);
        }
    }
    useEffect(() => {
        if (isSubmitted) {
            onSubmit();
            setIsSubmitted(false);
        }
    }, [isSubmitted, onSubmit]); // 의존성 배열에 onSubmit 추가

    const createDaily = (e) => {
        setPrompt("오늘은 날씨가 너무 좋았다. 아침에 일어나자마자 창문을 열었는데, 맑은 하늘과 시원한 바람이 느껴져서 기분이 상쾌했다. 출근 준비를 마치고 집을 나서기 전에 근처 카페에 들러 따뜻한 라떼 한 잔을 샀다.");
    };

    const ENDPOINT_URL = "https://api.openai.com/v1/chat/completions";
    const GPT_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

    // callGPTKeyword 함수
    function callGPTKeyword(prompt) {
        setIsLoading(true);
        return fetch(ENDPOINT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GPT_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{
                    role: "user",
                    content: `${prompt}라는 내용의 일기를 요약할 수 있는 키워드 5개를 순서없이 한줄에 나열해줘. 연결은 콤마로 해줘`
                }]  
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Keyword API Response:", data);
            setResults(data.choices[0].message.content);
        })
        .catch((error) => {
            console.error("Error in callGPTKeyword:", error);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    // callGPTAnalysis 함수
    function callGPTAnalysis(prompt) {
        setIsLoading(true);
        return fetch(ENDPOINT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GPT_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{
                    role: "user",
                    content: `${prompt}라는 일기에 대해서 일기속 드러나는 감정에 대해서 점수로 내줘. 부정적인 감정이 많으면 점수를 낮게 줘도 돼 100점 만점이고 "80"처럼 숫자만 출력해주면 돼`
                }]  
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Analysis API Response:", data);
            setEmotionalScore(data.choices[0].message.content);
        })
        .catch((error) => {
            console.error("Error in callGPTAnalysis:", error);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    // callGPTReason 함수
    function callGPTReason(prompt) {
        setIsLoading(true);
        return fetch(ENDPOINT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GPT_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{
                    role: "user",
                    content: `${prompt}라는 일기의 감정 점수를 매길건데 일기속 드러나는 감정적인 부분에서 일기를 분석하고 점수를 책정해줘 긍적적인 감정과 부정적인 감정이 어디서 나타났는지 설명해줘, 대신 점수는 생략하고 일기 점수를 책정한 근거를 100자 아래로 줄 글로 보여줘. 말투는 ~니다로 해줘`
                }]  
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("AnalysisReason API Response:", data);
            setAnalysisReason(data.choices[0].message.content);
        })
        .catch((error) => {
            console.error("Error in AnalysisReason:", error);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    // callGPTSolution 함수
    function callGPTSolution(prompt) {
        setIsLoading(true);
        return fetch(ENDPOINT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GPT_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{
                    role: "user",
                    content: `${prompt}라는 일기 속에서 부정적인 감정을 해소하려면 어떻게 해야하는지, 긍정적인 감정을 강화하려면 어떻게 해야하는지 일기 속의 내용을 근거로 감정적인 부분에서 피드백 해줘. 글은 100자 아래로 줄 글로 보여줘주고 말투는 ~니다로 해줘`
                }]  
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("AnalysisSolution API Response:", data);
            setAnalysisSolution(data.choices[0].message.content);
        })
        .catch((error) => {
            console.error("Error in AnalysisSolution:", error);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    // callGPTTarot 함수
    function callGPTTarot(prompt) {
        setIsLoading(true);
        return fetch(ENDPOINT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GPT_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{
                    role: "user",
                    content: `${prompt}라는 일기를 가지고 타로카드를 만들거야. 너가 해줄 일은 해당 일기의 이름을 지어주고 일기에서 긍정적인 부분을 강화시킬수 있는 대책안을 1개만 작성해줘. 타로카드 이름은 "**의 카드"처럼 **에 키워드를 넣어주고 대책안은 50자정도의 줄글이어야 해. 또한, 타로 카드 이름과 대책안은 ,로 구분해줘. 대신 타로 카드이름과 대책안을 구분 짓는거 외에는 ,를 쓰지말아줘`
                }]  
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Tarot API Response:", data);
            setTarot(data.choices[0].message.content);
        })
        .catch((error) => {
            console.error("Error in Tarot:", error);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    const loadingText = "일기를 분석 중입니다.";
    const animatedLoadingText = loadingText.split("").map((char, index) => (
        <span key={index} style={{ "--i": index }}>{char === " " ? "\u00A0" : char}</span>
    ));

    return (

        <div>
        {
            isLoading === true 
            
            ?

                
                <Wrapper>

                    <LoadingContainer>
                        <LoadingText>{animatedLoadingText}</LoadingText>
                    </LoadingContainer>
                    
                    <Header></Header>

                    <TitleFrame>
                        <Title text="오늘 하루를 간단히 적어보세요."></Title>
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
                

            :

                <Wrapper>
                
                
                <Header></Header>

                <TitleFrame>
                    <Title text="오늘 하루를 간단히 적어보세요."></Title>
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

        }
    </div>
    )

}

export default DailyWrite;  