import React from 'react'

function AltertMessage({type = "success", message = "This is a default message"} : {type?: string, message?: string}) {
  return (
    <div className={`${type == 'success' ? 'bg-green-600' : 'bg-red-600'} bg-opacity-15 text-center text-white my-2 py-0 px-1 rounded-md min-w-[25%] w-min mx-auto`}>
      <p>{message}</p>
    </div>
  )
}

export default AltertMessage
