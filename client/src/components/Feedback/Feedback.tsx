import React from 'react'
import { MessageBox , Input, Button} from "react-chat-elements";

import "react-chat-elements/dist/main.css"
import { AuthContext } from '../App/AuthContext';
import "./Feedback.css"

const data = [
  {
    from: "John Doe",
    date: "2019-01-01",
    text: "Hello",
    is_student: true
  },
  {
    from: "John Doe",
    date: "2019-01-01",
    text: "Hello",
    is_student: false
  },
  {
    from: "John Doe",
    date: "2019-01-01",
    text: "Hello",
    is_student: true
  },
]

function Feedback() {
  // get user
  // create referance to input
  const {user} = React.useContext(AuthContext)
  const inputRef = React.useRef<any>(null)
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
            data.push({
              from: user?.username || "Unknown",
              date: new Date().toISOString(),
              text: inputRef.current?.value,
              is_student: user?.is_student || false
            })
          }}
          title="Send"
        />
      </div>
    </div>
  )
}

export default Feedback