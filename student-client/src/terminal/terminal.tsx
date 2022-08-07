// Import XTerm
import { XTerm } from 'xterm-for-react'
import { io } from 'socket.io-client'
import { useEffect, useRef } from 'react';
import { useImmer } from "use-immer";
import { Socket } from 'dgram';

import './terminal.css'

function Term(){
    function onData(data : string){
        // socketRef.current?.emit('data', data)
    }
    function onKey(event : {key : string, domEvent: KeyboardEvent}){
      const  {key , domEvent} = event
      const code = key.charCodeAt(0);
      console.log(code)
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
        } 
        else {
            commandRef.current = commandRef.current.concat(key) 
            xtermRef.current?.terminal.write(key)
        }
    }
    const [data, setData] = useImmer("")
    const xtermRef = useRef<XTerm>(null)
    const socketRef = useRef<Socket>()
    const commandRef = useRef<string>("")
    // Connect to remote container via ssh
    useEffect( () => {
        const server_url='ws://localhost:8080';
        
        socketRef.current = io(server_url) as unknown as Socket;
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
    }, [setData])

    useEffect(() => {
        // You can call any method in XTerm.js by using 'xterm xtermRef.current.terminal.[What you want to call]
        console.log(data)
        xtermRef.current?.terminal.write(data)
    }, [data])

    

    return <>
        <XTerm className='terminal-container'
            ref={xtermRef}
            onData={onData}
            onKey={onKey}
        />
    </>
}

/**
 * 
});
 * term.write("\r\n*** Connected to backend***\r\n");
// Browser -> Backend
term.on("data", function(data) {
  //console.log(data);
  //                        alert("Not allowd to write. Please don't remove this alert without permission of Ankit or Samir sir. It will be a problem for server'");
  socket.emit("data", data);
});
// Backend -> Browser
socket.on("data", function(data) {
  term.write(data);
});
socket.on("disconnect", function() {
  term.write("\r\n*** Disconnected from backend***\r\n");
});
 */

export default Term