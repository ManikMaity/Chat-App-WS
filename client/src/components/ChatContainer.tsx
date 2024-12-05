import { useEffect, useRef, useState } from "react"
import ChatView from "./ChatView"
import SendChat from "./SendChat"
import JoinRoom from "./JoinRoom";

export interface ChatMessage {
  type : string,
  message : string
}

function ChatContainer() {

  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setMessages(prevMessage => [...prevMessage, {type : response.message, message : response?.data?.message}]);
      console.log(response);
    }

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type : "join",
        payload : {
          roomId : "default"
        }
      }));
    }
    setSocket(ws);
  }, []);



  return (
    <div className='h-screen w-screen flex justify-between bg-white flex-col p-2'>
      <div className="w-full h-[90%] relative">
      <JoinRoom ws={socket}/>
        <ChatView messages={messages}/>
      </div>
      <div className="w-full h-[9%]">
        <SendChat ws={socket}/>
      </div>
    </div>
  )
}

export default ChatContainer
