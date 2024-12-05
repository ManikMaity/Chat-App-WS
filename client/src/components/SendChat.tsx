import React, { useState } from 'react'

function SendChat({ws} : {ws : WebSocket | null}) {

    const [message, setMessage] = useState('');

    function sendMessage(e : React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      if (message.trim() == '') {
          return;
      }
      if (!ws) {
        console.log('WebSocket is not connected');
          return;
      }
      ws.send(JSON.stringify({
        type: 'chat',
        payload : {
            message : message
        }
      }));

      setMessage('');
    }

  return (
    <div className='w-full h-full bg-slate-800 rounded-lg'>
      <form onSubmit={sendMessage} className='flex justify-between w-full h-full p-2'>
        <input placeholder="Type a message" type="text" value={message} onChange={(e) => setMessage(e.target.value)} className='w-[90%] h-full outline-none p-2' />
        <button type='submit' className='w-[9%] h-full bg-slate-600'>Send</button>
      </form>
    </div>
  )
}

export default SendChat
