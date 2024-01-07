import { useRef, useState } from "react";
import { ChatBubble, Me, TextMessageBox, TypingLoader } from "../../components";
import AssistantHandler from "../../AssistantHandler";

interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsStreamPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const abortController = useRef(new AbortController());
  const isRunning = useRef(false);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);
    if (isRunning.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }
    try {
      const stream = AssistantHandler.ProsConsDiscussionsStream(
        text,
        abortController.current.signal
      );

      setMessages((messages) => [...messages, { text: "", isGpt: true }]);
      for await (const text of stream) {
        setMessages((messages) => {
          const newMessages = [...messages];
          newMessages[newMessages.length - 1].text = text;
          return newMessages;
        });
      }
      setIsLoading(false);
      isRunning.current = false;
    } catch (error) {
      isRunning.current = false;
      setMessages((prev) => [
        ...prev,
        { text: "No se pudo realizar la conexión", isGpt: true },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <ChatBubble text="Que deseas comparar hoy?" />

          {messages.map((message, index) =>
            message.isGpt ? (
              <ChatBubble key={index} text={message.text} />
            ) : (
              <Me key={index} text={message.text} />
            )
          )}

          {isLoading && (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader />
            </div>
          )}
        </div>
      </div>

      <TextMessageBox
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        disableCorrections
      />
    </div>
  );
};
