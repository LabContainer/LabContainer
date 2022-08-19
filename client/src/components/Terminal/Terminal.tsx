// Import XTerm
import { XTerm } from 'xterm-for-react'
import { io, Socket } from 'socket.io-client'
import { useContext, useEffect, useRef, useState } from 'react';
import { useImmer } from "use-immer";
import { FitAddon } from 'xterm-addon-fit'
import { Box, Chip, Stack, Typography } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import './Terminal.css'
import { AuthContext } from '../App/AuthContext';
import CircularIndeterminate from '../common/CircularInderminate';
import { Pending } from '@mui/icons-material';
import { Container } from '@mui/system';
import { refresh } from '../App/fetch';

enum EnvStatus{
    disconnected,
    connected,
    connecting
}

function Term(){
    function onKey(event : {key : string, domEvent: KeyboardEvent}){
        const  {key , domEvent} = event
        const code = key.charCodeAt(0);
        if(code === 127){   //Backspace
            if(commandRef.current.length > 0)
            xtermRef.current?.terminal.write("\b \b");
            commandRef.current = commandRef.current.slice(0,-1)
        } else if (code === 13) {
            for(let i = 0; i < commandRef.current.length; i++){
                xtermRef.current?.terminal.write("\b \b");
            }
            commandRef.current = commandRef.current.concat('\n')
            socketRef.current?.emit('data', commandRef.current)
            commandRef.current = ""
        } else if(domEvent.key === 'ArrowUp' || domEvent.key === 'ArrowDown'){
            socketRef.current?.emit('data', key)
        } else if(domEvent.key === 'ArrowLeft' || domEvent.key === 'ArrowRight'){
            // pass
        } 
        else {
            commandRef.current = commandRef.current.concat(key) 
            xtermRef.current?.terminal.write(key)
        }
    }
    const {token, refresh_token, setToken} = useContext(AuthContext)
    const [data, setData] = useImmer("")
    const xtermRef = useRef<XTerm>(null)
    const socketRef = useRef<Socket>()
    const commandRef = useRef<string>("")
    const reconnectRef = useRef<NodeJS.Timer>()
    const [status, setStatus] = useState(EnvStatus.disconnected)
    

    // Connect to remote container via ssh
    useEffect( () => {
        // Initial load
        setStatus(EnvStatus.disconnected)
        const server_url='http://localhost:8080';
        socketRef.current = io(server_url, {
            query: {token}
        }) as unknown as Socket;
        setStatus(EnvStatus.connecting)

        let fitaddon = new FitAddon();
        xtermRef.current?.terminal.loadAddon(fitaddon);
        fitaddon.fit()

        xtermRef.current?.terminal.attachCustomKeyEventHandler(( event : KeyboardEvent ) => {
            if(event.repeat) return true
            if(event.ctrlKey){
                if(event.key === "c"){
                    const text = xtermRef.current?.terminal.getSelection();
                    if(text)
                        navigator.clipboard.writeText(text)
                }
                if(event.key === "v"){
                    navigator.clipboard.readText().then(text => {
                        if(text) {
                            commandRef.current = commandRef.current.concat(text) 
                            xtermRef.current?.terminal.write(text)
                            navigator.clipboard.writeText("")
                        }

                    })
                }
            }
            return true
        })
        return () => {
            if(socketRef.current?.connected){
                socketRef.current.disconnect()
            }
        }
    }, [token])

    useEffect(() => {
        xtermRef.current?.terminal.write(data)
    }, [data])

    useEffect(() => {
        const tryConnect = async () => {
            setStatus(EnvStatus.connecting)
            const server_url='http://localhost:8080';
            const auth_url='http://localhost:5000';
            await refresh(auth_url, refresh_token, setToken)
            if (socketRef?.current?.connected === false) {
                // use a connect() or reconnect() here if you want
                socketRef.current = io(server_url, {
                    query: {token}
                }) as unknown as Socket;
            }
        }
        reconnectRef.current = setInterval(tryConnect, 2000)
        socketRef?.current?.on("connect", () => {
            xtermRef.current?.terminal.writeln("Backend Connected!")
            clearInterval(reconnectRef.current)
            setStatus(EnvStatus.connected)
        });

        socketRef?.current?.on("data", msg => {
            setData(msg)
        })
        socketRef?.current?.on("disconnect", function() {
            xtermRef.current?.terminal.writeln("***Disconnected from backend***");
            reconnectRef.current = setInterval(tryConnect, 5000)
            setStatus(EnvStatus.disconnected)
        });
        return () => clearInterval(reconnectRef.current)
    }, [token, refresh_token, setToken, setData])
    

    return <Stack sx={{
    }} flex={1}>
        <Stack direction="row" spacing={1}>
            <Container sx={{
                backgroundColor: "white",
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
                borderLeft: "1px solid",
                padding: "7px"
            }}>
                <Typography sx={{width: "fit-content", paddingRight: "10px"}}>
                    Remote Environment Status : 
                </Typography>
                {/* <Box> */}
                    { status === EnvStatus.connected ?    <Chip label="Connected!"    color="success" onDelete={()=>{}} deleteIcon={<DoneIcon />  } /> : null}
                    { status === EnvStatus.disconnected ? <Chip label="Disconnected!" color="error"   onDelete={()=>{}} deleteIcon={<CloseIcon /> } /> : null}
                    { status === EnvStatus.connecting ?   <Chip label="Connecting..." color="warning" onDelete={()=>{}} deleteIcon={<Pending   /> } /> : null}
                {/* </Box> */}
            </Container>
        </Stack>
        <XTerm className='terminal-container'
            ref={xtermRef}
            onKey={onKey}
            options={{
                theme: {
                    background: "#151942",
                    foreground: "#FFF"
                },
                fontSize: 15,
                rendererType: 'dom',
                fontFamily: `'Fira Mono', monospace`,
                convertEol: true,
                
            }}
        />
    </Stack>
}

export default Term