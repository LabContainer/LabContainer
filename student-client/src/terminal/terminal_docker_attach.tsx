// Import XTerm
import { XTerm } from 'xterm-for-react'
import { useEffect, useRef } from 'react';
import { AttachAddon } from 'xterm-addon-attach';

function Term(){
    const xtermRef = useRef<XTerm>(null)
    const socketRef = useRef<WebSocket>()

    const server_url='wss://localhost:2375/v1.41/containers/c23f49681fa9/attach/ws?logs=0&stream=1&stdin=1&stdout=1&stderr=1';
    
    
    // Attach the socket to term

    useEffect(() => {
        socketRef.current = new WebSocket(server_url);
        const { current : socket} = socketRef
        const attachAddon = new AttachAddon(socket);

        xtermRef.current?.terminal.loadAddon(attachAddon)
    }, [])
    
    return <>
        <XTerm className='terminal-container'
            ref={xtermRef}
        />
    </>
}

export default Term