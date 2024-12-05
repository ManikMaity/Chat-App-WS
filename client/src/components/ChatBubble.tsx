
function ChatBubble({chatMessage = "This is a default message"}:{chatMessage:string}) {
  return (
    <div className='min-w-[25%] w-min h-min p-3 rounded-lg bg-slate-600 text-white m-2'>
      <p>{chatMessage}</p>
    </div>
  )
}

export default ChatBubble
