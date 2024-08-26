import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

import { db } from "../../firebase"

//ui
import Header from "../ui/Header";

import Title from "../ui/Title";
import GenImage from "../ui/GenImage";

import WriteButtonF from "../ui/Button/WriteButtonF";
import WriteButtonUF from "../ui/Button/WriteButtonUF";

//image

//styled
const Wrapper = styled.div`
    width:100%;
    height:100vh;
    padding:0px 11.54%;

    background-color:var(--main-bcColor);
`

const TitleFrame = styled.div`
    text-align:center;
    margin-top:100px;
`

const SubText = styled.p`
    font-size:20px;
    font-weight:400;
    color:white;

    margin-top:12px;
    margin-bottom:80px;
`

const GenImageFrame = styled.div`
    display:flex;
    align-items:center;
    justify-content: space-between;

    width:100%;
    gap:24px;
`

const EntireButtonFrame = styled.div`
    display:flex;
    align-items:center;
    justify-content: center;

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

const InputFrame = styled.div`    
    display:flex;
    flex-direction:column;
    align-items:center;

    width:100%;
    height: fit-content;

    position:relative;
`

const Input = styled.input`
    width:fit-content;
    display:none;
`

const Label = styled.label`
    width:inherit;
    height:100%;

    position:absolute;
    cursor:pointer;
`

function ChoicePicture() {

    const navigate = useNavigate();
    const location = useLocation();

    // 이미지 생성
    const GPT_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

    const [imageUrlA, setImageUrlA] = useState('');
    const [imageUrlB, setImageUrlB] = useState('');
    const [imageUrlC, setImageUrlC] = useState('');

    const generateImage = useCallback(async () => {
        try {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GPT_API_KEY}`
                },
                body: JSON.stringify({
                model: "dall-e-2",
                prompt: `${location.state.results}를 대표하는 그림을 그려줘`,
                n: 3,
                size: '1024x1024'
                })
            });
    
            const data = await response.json();
            setImageUrlA(data.data[0].url);
            setImageUrlB(data.data[1].url);
            setImageUrlC(data.data[2].url);
        } catch (error) {
            console.error('Error generating image:', error);
        }
    }, [location.state.results, GPT_API_KEY]); // 필요한 의존성 추가
    
    useEffect(() => {
        generateImage();
    }, [generateImage]); // 의존성 배열에 추가

    // 선택 이미지 콘솔찍기
    const [choosedImageUrl, setChoosedImageUrl] = useState(imageUrlB);

    const imageClick = (url) => {
        return () => {
            setChoosedImageUrl(url);

            console.log(location.state.timestamp);
            console.log(choosedImageUrl);
        };
    };

    const SubmitImage = () => {

        db.collection('daily').doc(location.state.timestamp).update({
            image: choosedImageUrl,
        })

        navigate('/')
    }
    
      
    return (
        
        <Wrapper>
            <Header></Header>

            <TitleFrame>
                <Title text="등록할 대표 이미지를 선택하세요."></Title>
                <SubText>김희찬님의 2024년 5월 3일 하루를 바탕으로 생성된 이미지입니다.</SubText>
            </TitleFrame>

            <GenImageFrame>
                <InputFrame onClick={imageClick(imageUrlA)}>
                    <GenImage imgURL={imageUrlA} isSelected={choosedImageUrl === imageUrlA}></GenImage>
                    <Label for="imgA"></Label>
                    <Input name="img" id="imgA" value={imageUrlA} type="radio"></Input>
                </InputFrame>
                
                <InputFrame onClick={imageClick(imageUrlB)}>
                    <GenImage imgURL={imageUrlB} isSelected={choosedImageUrl === imageUrlB}></GenImage>
                    <Label for="imgB"></Label>
                    <Input name="img" id="imgB" value={imageUrlB} type="radio"></Input>
                </InputFrame>

                <InputFrame onClick={imageClick(imageUrlC)}> 
                    <GenImage imgURL={imageUrlC} isSelected={choosedImageUrl === imageUrlC}></GenImage>
                    <Label for="imgC"></Label>
                    <Input name="img" id="imgC" value={imageUrlC} type="radio"></Input>
                </InputFrame>
            </GenImageFrame>

            <EntireButtonFrame>
                <WriteButtonFrame onClick={( ) => {navigate(-1)}}>
                    <WriteButtonUF buttonName="뒤로가기"></WriteButtonUF>
                </WriteButtonFrame>

                <WriteButtonFrame onClick={SubmitImage}>
                    <WriteButtonF buttonName="다음으로"></WriteButtonF>
                </WriteButtonFrame>
            </EntireButtonFrame> 
        </Wrapper>
        
    )   

}

export default ChoicePicture;