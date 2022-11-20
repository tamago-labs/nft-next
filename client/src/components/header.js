
import { useState } from "react"
import { Flex, Box, Text, Image } from "rebass"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import LogoPNG from '../assets/logo.png'
import { Button } from "./base"
import { Connectors, SUPPORT_CHAINS } from "../constants";
import { shortAddress } from "../helper"

const Container = styled(Flex)`
    a {
        color: inherit;
        :not(:first-child) {
            margin-left: 15px;
        }
    }
`

const Header = () => {

    const context = useWeb3React()
    const { account, activate, deactivate, error, chainId } = context

    // handle logic to recognize the connector currently being activated
    const [activatingConnector, setActivatingConnector] = useState()

    return (
        <Container p={2}>
            <Box p={2} width={[1 / 3]}>
                <Image
                    src={LogoPNG}
                    sx={{
                        width: ['60%', '12%'],
                    }}
                />
            </Box>
            <Box style={{ display: "flex" }} p={2} width={[1 / 3]}>
                <div style={{ margin: "auto" }}>
                    <a href="#about">
                        NFT Next?
                    </a>
                    {` `}
                    <a target="_blank" href="https://github.com/tamago-labs/nft-next">
                        GitHub
                    </a>
                    {` `}
                    <a target="_blank" href="https://twitter.com/PisuthD">
                        Twitter
                    </a>
                </div>
            </Box>
            <Box p={2} style={{ display: "flex" }} width={[1 / 3]}>
                <div style={{ margin: "auto", marginRight: "0px" }}>
                    {!account && Connectors && Connectors.map((item, i) => (
                        <Button
                            onClick={() => {
                                setActivatingConnector(item.connector)
                                activate(item.connector)
                            }}
                            key={i} >
                            Connect Wallet
                        </Button>
                    ))}
                    {
                        account &&
                        <div>
                            {shortAddress(account)}{` `}(Chain : {chainId})
                        </div>
                    }
                </div>
            </Box>
        </Container>
    )
}

export default Header