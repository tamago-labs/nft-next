import { useState, useEffect, useCallback } from "react"
import { Flex, Box, Text, Image } from "rebass"
import {
    Label,
    Input
} from '@rebass/forms'
import { ethers } from "ethers"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import { Plus } from "react-feather"
import useNextDAO from "../hooks/useNextDAO"
import InfoModal from "../modals/infoModal"
import { Button } from "rebass"
import { shortAddress } from "../helper"

const Container = styled.div`
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 700px; 
    
`

const Item = styled.div`
    border: 1.5px solid grey;
    padding: 10px;
    border-style: dashed;
    border-radius: 10px;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    :hover {
        border-style: solid;
    }
`

const TokenItem = styled(Item)`
    img {
        width: 100%;
    }
`

const PageSelector = styled.div`
    color: white;
    height: 100%; 
    border-right: 1.5px solid white;
`



const MenuItem = styled.div`
    padding: 20px;
    padding-bottom: 10px;
    border-bottom: 1.5px solid white;
    ${props => props.topLine && `
        margin-top: 5px;
        border-top: 1.5px solid white;
    `}
    ${props => props.active && `
    text-decoration: underline;
`}

    cursor: pointer;
    :hover {
        text-decoration: underline;
        
    }
`

const Content = styled.div`
    color: white;
    height: 100%; 
    border-left: 1.5px solid white; 
`

const InfoPanel = styled(Box).attrs(() => ({ width: [1 / 2] }))`
border-right: 1.5px solid white;
`

const ActionPanel = styled(Box).attrs(() => ({ width: [1 / 2] }))`

`


const ItemDetail = ({ token, dealInfo }) => {

    const { account } = useWeb3React()

    const [currentPage, setPage] = useState(1)

    const { reveal, fetchBalance,  buy, setPrice } = useNextDAO()

    
    const [balance, setBalance] = useState(0)
    const [result, setResult] = useState()
    const [recoverCount, setRecoverCount] = useState(0)
    const [newPrice, setNewPrice] = useState(0.1)

    const { tokenId, pages, currentPrice, traded, currentHolder, previousHolder } = token

    useEffect(() => {
        if (account && token) {
            startReveal()
        }
        return () => {
            setRecoverCount(0)
        }

    }, [account, token, currentPage, tokenId])

    useEffect(() => {
        token && fetchBalance(token).then(setBalance)
    },[token])

    const startReveal = useCallback(async () => {

        if (token) {

            const { pages } = token
            const page = pages[currentPage - 1]

            let max = Number(page.length)

            if (currentPage == 1) {
                max -= 1
            }

            let result = ""
            for (let i = 0; i < max; i++) {

                const output = await reveal({
                    tokenId,
                    wordIndex: i,
                    pageIndex: currentPage - 1,
                    words: page.words,
                    leaves: page.leaves
                })
                if (!output) {
                    setResult(undefined)
                    break
                }
                result = `${result}${output}`
                setResult(result)
                setRecoverCount(i + 1)
            }
            // localStorage.setItem(`${account}${tokenId}`, result)
        }
    }, [token, currentPage, tokenId, reveal, account])

    const onBuy = useCallback(async () => {
        await buy(token)
    }, [buy, token])

    const onSetPrice = useCallback(async () => {
        await setPrice(token, newPrice)
    }, [setPrice, token, newPrice])

    return (
        <>
            <Flex style={{ height: "400px", borderBottom: "1.5px solid white" }} mt={-3}>
                <Box width={[1 / 6]}>
                    <PageSelector>
                        {pages.map((page, index) => {
                            return (
                                <MenuItem onClick={() => setPage(index + 1)} active={page.page === currentPage} key={index}>
                                    Page{` `}{index + 1}
                                </MenuItem>
                            )
                        })}
                    </PageSelector>
                </Box>
                <Box p={2} style={{ display: "flex" }} width={[4 / 6]}>
                    {pages[currentPage - 1] &&
                        (
                            <>
                                <img style={{ marginLeft: "auto", marginRight: "auto" }} src={pages[currentPage - 1].image} />
                            </>
                        )
                    }
                </Box>
                <Box width={[2 / 6]}>
                    <Content>
                        {pages[currentPage - 1] &&
                            (
                                <Box p={2}>
                                    {result
                                        ?
                                        <>{result}</>
                                        :
                                        <>{pages[currentPage - 1].words.reduce((result, item) => `${result}, ${item}`, "")}</>
                                    }
                                </Box>
                            )
                        }
                    </Content>
                </Box>
            </Flex>
            <Flex style={{ borderBottom: "1.5px solid white" }}>
                <InfoPanel>
                    <Flex>
                        <Box p={2} width={[1 / 3]}>
                            <div>Current Price</div>
                            <div>{ethers.utils.formatEther(currentPrice)} TFIL</div>
                        </Box>
                        <Box p={2} width={[1 / 3]}>
                            <div>Balance</div>
                            <div>
                                {balance}
                            </div>
                        </Box>
                        <Box p={2} width={[1 / 3]}>
                            <div>Traded</div>
                            <div>{traded}</div>
                        </Box>
                    </Flex>

                    <Flex>
                        <Box p={2} style={{ display: "flex", flexDirection: "row" }} width={[1]}>
                            <Button onClick={onBuy} style={{ background: "blue", cursor: "pointer", marginRight: "5px" }}>
                                Buy
                            </Button>
                            {` `}

                        </Box>
                    </Flex>
                </InfoPanel>
                <ActionPanel>
                    <Flex>
                        <Box p={2} width={[1 / 2]}>
                            <div>Current Owner</div>
                            <div>{shortAddress(currentHolder)}</div>
                        </Box>
                        <Box p={2} width={[1 / 2]}>
                            <div>Previous Owner</div>
                            <div>{shortAddress(previousHolder)}</div>
                        </Box>
                    </Flex>
                    <Flex>
                        <Box p={2} style={{ display: "flex", flexDirection: "row" }} width={[1]}>

                            <Button onClick={onSetPrice} style={{ background: "blue", cursor: "pointer", marginRight: "5px" }}>
                                Set New Price
                            </Button>
                            <Input
                                value={newPrice}
                                id='newPrice'
                                name='newPrice'
                                type='number'
                                step={"0.1"}
                                style={{ width: "80px", marginRight: "5px" }}
                                // style={{ borderColor: errors['title'] && "red" }}
                                // placeholder={t("titlePlaceHolder")}
                                onChange={(e) => setNewPrice(e.target.value)}
                            />
                            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                                TFIL
                            </div>
                        </Box>
                    </Flex>
                </ActionPanel>
            </Flex>
            <Flex style={{ display: "flex", flexDirection: "column" }} p={2} >
                {/* <div>Deal Info</div>   */}

                <Flex flexWrap="wrap">
                    <Box p={2} width={[1 / 4]}>
                        <div>Deal ID</div>
                        <div>67</div>
                    </Box>
                    <Box p={2} width={[1 / 4]}>
                        <div>Label</div>
                        <div>{shortAddress(dealInfo.label, 10, -8)}</div>
                    </Box>
                    <Box p={2} width={[1 / 4]}>
                        <div>Client ID</div>
                        <div>{(dealInfo.client)}</div>
                    </Box>
                    <Box p={2} width={[1 / 4]}>
                        <div>Provider ID</div>
                        <div>{(dealInfo.provider)}</div>
                    </Box>
                    {/* <Box p={2} width={[1 / 4]}>
                        <div>Term</div>
                        <div>{(dealInfo.term)}</div>
                    </Box> */}
                    <Box p={2} width={[1 / 4]}>
                        <div>Total Price</div>
                        <div>{ethers.utils.formatEther((dealInfo.totalPrice))}{` FIL`}</div>
                    </Box>
                    <Box p={2} width={[1 / 4]}>
                        <div>Client Collateral</div>
                        <div>{ethers.utils.formatEther((dealInfo.clientCollateral))}{` FIL`}</div>
                    </Box>
                    <Box p={2} width={[1 / 4]}>
                        <div>Provider Collateral</div>
                        <div>{ethers.utils.formatEther((dealInfo.providerCollateral))}{` FIL`}</div>
                    </Box>

                </Flex>

            </Flex>
        </>

    )
}

const Main = () => {

    const { tokens, token, select, deselect, dealInfo } = useNextDAO()

    return (
        <>
            <InfoModal
                visible={token}
                toggle={() => deselect()}
                title={token && token.name || ""}
            >
                {token &&
                    <ItemDetail
                        token={token}
                        dealInfo={dealInfo}
                    />
                }
            </InfoModal>
            <Container>
                <Flex flexWrap={"wrap"}>
                    {tokens.map((token, index) => {

                        const { image } = token

                        return (
                            <Box p={1} key={index} width={[1 / 3]}>
                                <TokenItem onClick={() => select(token)}>
                                    <img src={image} />
                                </TokenItem>
                            </Box>
                        )
                    })}
                    <Box p={1} width={[1 / 3]}>
                        <Item onClick={() => alert("Use Remix to add new item.")}>
                            <div style={{ margin: "auto", textAlign: "center" }}>
                                <div>
                                    <Plus size={32} />
                                </div>
                                <div>
                                    Add Item
                                </div>
                            </div>
                        </Item>
                    </Box>
                </Flex>

            </Container>
        </>

    )
}

export default Main