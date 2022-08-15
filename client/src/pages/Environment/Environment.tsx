import { Box, Container, Stack, styled } from "@mui/material";
import { red } from "@mui/material/colors";
import React from "react";

import Editor from '../../components/Editor/Editor';
import Term from '../../components/Terminal/Terminal';
import ScrollTabs from "../../components/ScrollTabs/ScrollTabs";

import './Environment.css'

export default function Environment(){
    const [chosenFile, setChosenFile] = React.useState(1)
    React.useEffect(()=>{
        // Editor to load file
    }, [chosenFile])
    const E = styled(Editor)({
        // padding: "10px"
    })
    return <>
        <Stack sx={{
            margin: 0,
            padding: 0,
        }} direction="row" justifyContent={"center"}>
            <Stack flex={1}>
                <ScrollTabs
                    tabList={[
                        "hey"
                    ]}
                    setChosen = {setChosenFile}
                />
                {/* <E/> */}
                <Editor></Editor>
            </Stack>
            <Box flex={1}>
            <Term></Term>

            </Box>
        </Stack>
        
    </>
}