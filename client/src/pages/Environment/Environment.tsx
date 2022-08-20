import { Stack } from "@mui/material";
import React from "react";
import { Suspense } from "react";
import CircularIndeterminate from "../../components/common/CircularInderminate";


import './Environment.css'

import Editor from '../../components/Editor/Editor';

const Term = React.lazy(async () => {
    return import('../../components/Terminal/Terminal');
})

// const sleep = (ms:  number) => new Promise( resolve => setTimeout(resolve, ms))
export default function Environment() {
    
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
            <Editor></Editor>
            <Stack flex={1}>
                <Suspense fallback={<CircularIndeterminate />}>
                    <Term />
                </Suspense>

            </Stack>
        </Stack>

    </>
}