import { Box, Container, Stack, styled } from "@mui/material";
import { red } from "@mui/material/colors";
import React from "react";
import ScrollTabs from "../../components/ScrollTabs/ScrollTabs";
import { Suspense } from "react";
import CircularIndeterminate from "../../components/common/CircularInderminate";


import './Environment.css'

import Editor from '../../components/Editor/Editor';

const Term = React.lazy(async () => {
    return import('../../components/Terminal/Terminal');
})

const sleep = (ms:  number) => new Promise( resolve => setTimeout(resolve, ms))


export default function Environment(){
    const [chosenFile, setChosenFile] = React.useState(1)
    React.useEffect(()=>{
        // Editor to load file
    }, [chosenFile])
    return <>
        <Stack sx={{
            margin: "auto",
            padding: 0,
            width: "80%",
            height: "60%",
            justifyContent: "center",
            marginTop: "80px",
            marginBottom: "80px"
        }} direction="row" justifyContent={"center"}>
            <Stack flex={1} >
                <ScrollTabs
                    tabList={[
                        {
                            tab: "file 1",
                            id: 1
                        }
                    ]}
                    setChosen = {setChosenFile}
                />
                {/* <E/> */}
                <Editor></Editor>
            </Stack>
            <Stack flex={1}>
                <Suspense fallback={<CircularIndeterminate/>}>
                    <Term/>
                </Suspense>

            </Stack>
        </Stack>
        
    </>
}