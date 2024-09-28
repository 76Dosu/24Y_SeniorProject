import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

//page
import MainPage from './component/page/MainPage';
import DailyWrite from './component/page/DailyWrite';
import ChoicePicture from './component/page/ChoicePicture';
import ViewDaily from './component/page/ViewDaily';
import DailyDetailView from './component/page/DailyDetailView';
import Tarot from './component/page/Taort';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
            <Route index element={<MainPage />}></Route>
            <Route path="/write" element={<DailyWrite />}></Route>
            <Route path="/choicePicture" element={<ChoicePicture />}></Route>
            <Route path="/viewDaily" element={<ViewDaily />}></Route>
            <Route path="/post/:id" element={<DailyDetailView />}></Route>

            <Route path="/tarot" element={<Tarot />}></Route>
        </Routes>
    </BrowserRouter>
);