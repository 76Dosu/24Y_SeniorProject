import React, { useState } from "react";
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
    height: 400px;
`

const Input = styled.input`
    width:fit-content;
    display:none;
`

const Label = styled.label`
    width:24px;
    height:24px;
    border:1px solid white;
`

function ChoicePicture(props) {

    const navigate = useNavigate();
    const location = useLocation();

    // //키워드 값 동기처리
    // const [keyword, setKeyworld] = useState('')

    // const getPosts = () => {
    //         axios.get('http://localhost:3001/posts').then((res) => {
    //         setKeyworld(res.data[res.data.length - 1].keyword);
    //     })
    // }

    // // 이미지 생성
    // const GPT_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

    // const [imageUrlA, setImageUrlA] = useState('');
    // const [imageUrlB, setImageUrlB] = useState('');
    // const [imageUrlC, setImageUrlC] = useState('');

    // const generateImage = async () => {
    //     try {
    //     const response = await fetch('https://api.openai.com/v1/images/generations', {
    //         method: 'POST',
    //         headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${GPT_API_KEY}`
    //         },
    //         body: JSON.stringify({
    //         model: "dall-e-2",
    //         prompt: `${keyword}를 대표하는 그림을 그려줘`,
    //         n: 3,
    //         size: '1024x1024'
    //         })
    //     });

    //     const data = await response.json();
    //         setImageUrlA(data.data[0].url);
    //         setImageUrlB(data.data[1].url);
    //         setImageUrlC(data.data[2].url);
    //     } catch (error) {
    //         console.error('Error generating image:', error);
    //     }
    // };

    // // 대표이미지 등록
    // useEffect(() => {
    //     getPosts();
    //     generateImage();
    // }, []);

    const testUrlA = "https://newsimg.hankookilbo.com/2016/04/13/201604131460701467_1.jpg";
    const testUrlB = "https://previews.123rf.com/images/koufax73/koufax731601/koufax73160100120/50945869-%ED%95%84%EB%93%9C-%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95-%EC%9D%B4%EB%AF%B8%EC%A7%80%EC%97%90%EC%84%9C-%EC%82%B0%EC%B1%85%ED%95%98%EB%8A%94-%EC%A0%8A%EC%9D%80-%EA%B3%A0%EC%96%91%EC%9D%B4.jpg";
    const testUrlC = "https://img.freepik.com/premium-photo/cat-near-computer-mouse-work-office-computer-square-format_199743-1487.jpg";

    // 선택 이미지 콘솔찍기
    const [choosedImageUrl, setChoosedImageUrl] = useState(testUrlB);

    const imageClick = (url) => {
        return () => {
            setChoosedImageUrl(url);
            // getPostById(location.state.timestamp);

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
                <SubText>김희찬님의 2024년 5월 3일 일기를 바탕으로 생성된 이미지입니다.</SubText>
            </TitleFrame>

            <GenImageFrame>
                <InputFrame onClick={imageClick(testUrlA)}>
                    <GenImage imgURL={testUrlA}></GenImage>
                    <Label for="imgA"></Label>
                    <Input name="imgA" id="imgA" value={testUrlA} type="radio"></Input>
                </InputFrame>
                
                <InputFrame onClick={imageClick(testUrlB)}>
                    <GenImage imgURL={testUrlB}></GenImage>
                    <Label for="imgB"></Label>
                    <Input name="imgB" id="imgB" value={testUrlB} type="radio"></Input>
                </InputFrame>

                <InputFrame onClick={imageClick(testUrlC)}> 
                    <GenImage imgURL={testUrlC}></GenImage>
                    <Label for="imgC"></Label>
                    <Input name="imgC" id="imgC" value={testUrlC} type="radio"></Input>
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