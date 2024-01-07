import { useState } from "react";
import { ChatBubble, Me, TextMessageBox, TypingLoader } from "../../components";
import AssistantHandler from "../../AssistantHandler";

interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);
    const { ok, content = "" } = await AssistantHandler.ProsConsDiscussions(
      text
    );
    if (!ok) {
      setMessages((prev) => [
        ...prev,
        { text: "No se pudo realizar la conexión", isGpt: true },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          isGpt: true,
          text: content,
        },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <ChatBubble text="Hola, puedes escribir para ayudarte a decidir entre un tema u otro" />

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
