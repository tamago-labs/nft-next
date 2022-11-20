import styled from "styled-components"
import { Heading } from "rebass"

const Title = styled.h2`
    font-size: 90px;
    max-width: 600px;
    text-align: center;
    line-height: 110px;
    padding: 0px;
    margin: 0px;
    font-weight: bold;
    display: inline-block;
    background-image: linear-gradient(135deg, #846FF4 0%, #F17674 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    margin-left: auto;
    margin-right: auto;
`

const Container = styled.div`
    padding: 60px;
    display: flex;
`

const Subtitle = styled.div.attrs(() => ({ id: "about" }))`
    margin-top: 20px;
    text-align: center;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
`

const Jumbotron = () => {
    return (
        <Container>
            <div style={{ margin: "auto", display: "flex", flexDirection: "column" }}>
                <Title>
                    NFT Beyond JPEG
                </Title>
                <Subtitle>
                    {/* NFT Next is a DataDAO for self sovereign content allows content creators to publish illustrated novels in soulbound NFTs that the content is being protected by Merkle-Tree data protection scheme  */}
                    NFT Next is a DataDAO for self-sovereign content allows creators publish articles, illustrated novels in NFTs that the content is being viewed to DAO members only
                </Subtitle>
            </div>
        </Container>
    )
}

export default Jumbotron