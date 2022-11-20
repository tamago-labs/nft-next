import React from "react";
import styled from "styled-components";


const TextLink = styled.a`
  color: inherit;
  font-size: 14px;

  :hover {
    cursor: pointer;
    color: white;
  }

  :not(:first-child) {
    margin-left: 10px;
  }

`;

const Container = styled.div`
position: fixed;
left: 0;
bottom: 0;
width: 100%; 
color: white;
text-align: center;
padding: 10px; 
background: #03091f;
a {
    color: inherit;
}
`;

const Footer = () => {
    return (
        <Container>
            Made with ❤️ from <a target="_blank" href="https://tamagonft.xyz">Tamago Labs</a> during <a target="_blank" href="https://fevm.ethglobal.com/">Hack FEVM'22</a>
        </Container>
    );
};

export default Footer;
