import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

import { db } from "../../firebase"

//ui
import WriteButtonF from "../ui/Button/WriteButtonF";
import WriteButtonUF from "../ui/Button/WriteButtonUF";
import Title from "../ui/Title";
import InputTextContents from "../ui/InputTextArea/InputTextContents";
import InputTextTitle from "../ui/InputTextArea/InputTextTitle";

//styled
const Wrapper = styled.div`
    width:100%;
    min-height:100vh;
    padding:0px 11.54%;
    background-color:var(--main-bcColor);

    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content: center;
`

const TitleFrame = styled.div`
    width:100%;
`

const DivideLine = styled.div`
    width: 100%;
    height:1px;
    background-color:white;
    margin:12px 0px 0px 0px;
`

const WriteFrame = styled.div`
    width: 100%;
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
    width: 100%;
    display:flex;
    align-items:center;
    justify-content:space-between;

    margin-top:60px;    
`

const WriteButtonFrame = styled.div`
    display:flex;
    width:fit-content;
`

const CreateDaily = styled.div`
    width:fit-content;
`

const FunctionBtn = styled.div`
    display:flex;
    gap:20px;
`

const WhatIsThis = styled.div`
    display:flex;
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

// 팝업 스타일
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter:blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
`;

const ModalContent = styled.div`
    background-color: var(--main-bcColor);
    padding:40px 20px;
    border-radius: 24px;
    width: 40%;
    color:white;
    
    display:flex;
    flex-direction:column;
    align-items: center;
`;

const ModalTitle = styled.p`
    font-size: 24px;
    font-weight: bold;
    color:var(--main-color);

    margin-bottom:24px;
`;

const ModalParagraph = styled.p`
    font-size: 16px;
    line-height:1.4;
    margin-bottom:4px;
    color:white;
`;

const ModalCheck = styled.div`
    margin-top:40px;
`

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
    const [randomDaily, setRandomDaily] = useState('');

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // 팝업 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // 입력 핸들러
    const handleContentsChange = (e) => setPrompt(e.target.value);
    const handleTitleChange = (e) => setTitle(e.target.value);

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
        if (!title || !prompt) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

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

    const createDaily = async (e) => {
        try {
            const diary = await CreateRandomDaily();
            setPrompt(diary);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const ENDPOINT_URL = "https://api.openai.com/v1/chat/completions";
    const GPT_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

    // callGPTKeyword 함수
    function CreateRandomDaily() {
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
                    content: `무슨 주제이든 상관없으니까 참신한 주제의 60자정도의 일기를 줄글로 써줘, 부정적이거나 긍정적인거 아무거나 괜찮아 `
                }]
            })
        })
            .then(response => response.json())
            .then(data => {
                const diary = data.choices[0].message.content;
                setRandomDaily(diary);
                return diary;
            })
            .catch((error) => {
                console.error("Error in RandomDaily Creating:", error);
            })
    }

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
                    content: `${prompt}라는 일기를 가지고 타로카드를 만들거야. 너가 해줄 일은 해당 일기의 이름을 지어주고 일기에서 긍정적인 부분을 강화시킬수 있는 색다른 대책안을 1개만 작성해줘. 타로카드 이름은 "**의 카드"처럼 **에 키워드를 넣어주고 대책안은 50자정도의 줄글이어야 해. 또한, 타로 카드 이름과 대책안은 ,로 구분해줘. 대신 타로 카드이름과 대책안을 구분 짓는거 외에는 ,를 쓰지말아줘`
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
                            <FunctionBtn>
                                <WhatIsThis onClick={openModal}>
                                    <WriteButtonUF buttonName="이게 뭐하는거에요?"></WriteButtonUF>
                                </WhatIsThis>
                                <CreateDaily onClick={createDaily}>
                                    <WriteButtonUF buttonName="랜덤 일기 생성하기"></WriteButtonUF>
                                </CreateDaily>
                            </FunctionBtn>

                            <FunctionBtn>
                                <WriteButtonFrame onClick={(e) => { navigate(-1) }}>
                                    <WriteButtonUF buttonName="처음으로"></WriteButtonUF>
                                </WriteButtonFrame>

                                <WriteButtonFrame disabled={!title || !prompt} onClick={handleClick}>
                                    <WriteButtonF buttonName="다음으로">
                                    </WriteButtonF>
                                </WriteButtonFrame>
                            </FunctionBtn>

                        </EntireButtonFrame>
                    </Wrapper>


                    :

                    <Wrapper>

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
                            <FunctionBtn>
                                <WhatIsThis onClick={openModal}>
                                    <WriteButtonUF buttonName="이게 뭐하는거에요?"></WriteButtonUF>
                                </WhatIsThis>
                                <CreateDaily onClick={createDaily}>
                                    <WriteButtonUF buttonName="랜덤 일기 생성하기"></WriteButtonUF>
                                </CreateDaily>
                            </FunctionBtn>

                            <FunctionBtn>
                                <WriteButtonFrame onClick={(e) => { navigate(-1) }}>
                                    <WriteButtonUF buttonName="처음으로"></WriteButtonUF>
                                </WriteButtonFrame>

                                <WriteButtonFrame disabled={!title || !prompt} onClick={handleClick}>
                                    <WriteButtonF buttonName="다음으로">
                                    </WriteButtonF>
                                </WriteButtonFrame>
                            </FunctionBtn>

                        </EntireButtonFrame>
                        {/* 팝업이 열려 있을 때만 오버레이와 모달을 표시 */}
                        {isModalOpen && (
                            <ModalOverlay>
                                <ModalContent>
                                    <ModalTitle>일기를 작성해보세요.</ModalTitle>
                                    <ModalParagraph>AI가 작성한 일기를 감정을 분석해주고 시각화해줍니다.</ModalParagraph>
                                    <ModalParagraph>무슨 일기를 써야할지 모르겠다면 랜덤 일기 생성하기를 눌러보세요.</ModalParagraph>
                                    <ModalCheck onClick={closeModal}> 
                                        <WriteButtonUF buttonName="확인했어요">확인했어요</WriteButtonUF>
                                    </ModalCheck>
                                    
                                </ModalContent>
                            </ModalOverlay>
                        )}
                    </Wrapper>

            }
        </div>
    )

}

export default DailyWrite;  