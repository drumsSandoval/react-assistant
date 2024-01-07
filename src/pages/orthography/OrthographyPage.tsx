import { useState } from "react";
import {
  ChatBubble,
  Me,
  TextMessageBox,
  TypingLoader,
  OrthographyBubble,
} from "../../components";
import AssistantHandler from "../../AssistantHandler";
import { OrthographyResponse } from "../../interfaces";

interface Message {
  text: string;
  isGpt: boolean;
  info?: OrthographyResponse;
}

export const OrthographyPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);
    const { message, errors, userScore, ok } =
      await AssistantHandler.OrthographyCorrection(text);
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
          text: message,
          info: {
            errors,
            message,
            userScore,
          },
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
          <ChatBubble text="Hola, puedes escribir tu texto en español, y te ayudo con las correcciones" />

          {messages.map((message, index) =>
            message.isGpt ? (
              <OrthographyBubble
                key={index}
                errors={message.info?.errors || []}
                userScore={message.info?.userScore || 0}
                message={message.info?.message || ""}
              />
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
