import React from 'react'
import { MessageBox , Input, Button} from "react-chat-elements";

import "react-chat-elements/dist/main.css"
import useAPI from '../../api';
import { AuthContext } from '../App/AuthContext';
import "./Feedback.css"



function Feedback({team, username} : {team : string, username: string}) {

  // get user
  // create referance to input
  const {user} = React.useContext(AuthContext)
  const inputRef = React.useRef<any>(null)
  const [refresh, setRefresh] = React.useState(0)
  const [data, setData] = React.useState([
    
      {
        from: "Test Instructor",
        date: "2023-01-01",
        text: "Please ask any questions here",
        is_student: false
      }
  ])

  React.useEffect(() => {
    // fetch messages
    EnvironmentApi.environmentGetMessagesEnvironment(team, username).then((messages) => {
      setData(messages.map((message) => {
        return {
          from: message.user,
          date: message.timestamp,
          text: message.message,
          is_student: message.user === user?.username
        }
      }))
    })
  }, [refresh])

  const {EnvironmentApi} = useAPI();
  return (
    <div className="feedback">
      <h3 style={{
        textAlign: "center",
        padding: "0",
        margin: "0"
        
      }}>Feedback</h3>
      <div className="message-area">

        {data.map((message, index) => (
          <MessageBox
          //@ts-ignore
            position={message.is_student ? "right" : "left"}
            type={"text"}
            title={message.from}
            text={message.text}
            date={message.date}
          />
        ))}
      </div>
      <div className="footer">
        <div className="input-container">
        <Input
          // @ts-ignore
          placeholder="Type here..."
          multiline={true}
          maxHeight={100}
          referance={inputRef}
          />
        </div>
        <Button
          text={"Send"}
          onClick={() => {
              EnvironmentApi.environmentPostMessageEnvironment(team, username, {
                message: inputRef.current?.value,
                user: user?.username || "Unknown"
              }).then(() => { 
                setRefresh(refresh + 1)
                inputRef.current.value = ""
              })
              
            }}

          title="Send"
        />
      </div>
    </div>
  )
}

export default Feedback