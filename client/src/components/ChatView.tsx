import ChatBubble from "./ChatBubble";
import AltertMessage from "./AltertMessage";
import { ChatMessage } from "./ChatContainer";

function ChatView({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="w-full h-full overflow-y-scroll bg-slate-900 rounded-lg">
      {messages.map((message, index) => {
        if (message.type == "chat") {
          return <ChatBubble key={index} chatMessage={message.message} />;
        } else if (message.type == "error") {
          return (
            <AltertMessage key={index} message={message.message} type="error" />
          );
        } else {
          return (
            <AltertMessage
              key={index}
              message={message.message}
              type="success"
            />
          );
        }
      })}
    </div>
  );
}

export default ChatView;
