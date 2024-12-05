import React, { useState } from "react";

function JoinRoom({ws} : {ws : WebSocket | null}) {

    const [roomId, setRoomId] = useState('');

    function joinRoom(e : React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!ws) {
            console.log('WebSocket is not connected');
            return;
        }
        if (roomId.trim() == '') {
            console.log('Room ID is empty');
            return;
        }

        ws.send(JSON.stringify({
            type: 'join',
            payload: {
                roomId: roomId
            }
        }))
    }
    
  return (
    <div className="w-[100px] h-[100px] bg-slate-950 absolute top-0 right-[20px] rounded-lg">
      <form className="p-2" onSubmit={joinRoom}>
        <input value={roomId} onChange={(e) => setRoomId(e.target.value)} type="text" className="w-full rounded-md p-1" placeholder="Room ID" />
        <button type="submit" className="w-full rounded-md p-1 bg-slate-500 mt-2 text-white">Join</button>
      </form>
    </div>
  );
}

export default JoinRoom;
