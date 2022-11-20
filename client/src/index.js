import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Web3ReactProvider } from '@web3-react/core';
import reportWebVitals from './reportWebVitals';
import { createGlobalStyle } from 'styled-components';
import { ethers } from "ethers";

import 'react-tabs/style/react-tabs.css';

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: -webkit-linear-gradient(to right, #4834d4, #341f97);
    background: -webkit-linear-gradient(left, #4834d4, #341f97);
    background: linear-gradient(to right, #4834d4, #341f97);
    background: #03091f;
    font-family: 'Poppins', sans-serif;
    color: white;
  }
`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <GlobalStyle />
      <App />
    </Web3ReactProvider> 
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
