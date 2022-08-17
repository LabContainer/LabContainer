// Import XTerm
import { XTerm } from 'xterm-for-react'
import { io } from 'socket.io-client'
import { useEffect, useRef } from 'react';
import { useImmer } from "use-immer";
import { Socket } from 'dgram';

// import './Terminal.css'
import useToken from '../App/useToken';
import { Box } from '@mui/material';
import './Terminal.css'

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
    const {token} = useToken()
    const [data, setData] = useImmer("")
    const xtermRef = useRef<XTerm>(null)
    const socketRef = useRef<Socket>()
    const commandRef = useRef<string>("")
    // Connect to remote container via ssh
    useEffect( () => {
        const server_url='http://localhost:8080';
        
        socketRef.current = io(server_url, {
            query: {token}
        }) as unknown as Socket;
        const { current : socket} = socketRef
        
        socket.on("connect", () => {
            console.log("Connected")
            xtermRef.current?.terminal.writeln("Backend Connected!")
        });

        socket.on("data", msg => {
            setData(msg)
        })

        socket.on("disconnect", function() {
            xtermRef.current?.terminal.writeln("***Disconnected from backend***");
        });
    }, [setData, token])

    useEffect(() => {
        xtermRef.current?.terminal.write(data)
    }, [data])

    

    return <Box sx={{

    }} flex={1}>
        <XTerm className='terminal-container'
            ref={xtermRef}
            onKey={onKey}
        />
    </Box>
}

export default Term