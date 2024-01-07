import { OrthographyResponse, ProsConsDiscussion } from "./interfaces";

class AssistantHandler {
  static api = import.meta.env.VITE_API_DEV;

  static async fetchAssistant(url = "", prompt = "") {
    try {
      const resp = await fetch(this.api + url, {
        method: "POST",
        body: JSON.stringify({ prompt }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!resp.ok) {
        throw new Error("No se pudo realizar la corrección");
      }
      return resp.json();
    } catch (_) {
      throw new Error("No se pudo realizar la corrección");
    }
  }

  static async OrthographyCorrection(prompt: string) {
    try {
      const data: OrthographyResponse = (await this.fetchAssistant(
        "/gpt/orthography-check",
        prompt
      )) as OrthographyResponse;
      return {
        ok: true,
        ...data,
      };
    } catch (_) {
      return {
        ok: false,
        userScore: 0,
        errors: [],
        message: "No se pudo realizar la corrección",
      };
    }
  }

  static async ProsConsDiscussions(prompt: string) {
    try {
      const data: ProsConsDiscussion = (await this.fetchAssistant(
        "/gpt/pros-cons-discusser",
        prompt
      )) as ProsConsDiscussion;
      console.log({ data });
      return {
        ok: true,
        ...data,
      };
    } catch (_) {
      return {
        ok: false,
        role: "",
        content: "",
      };
    }
  }

  static async *ProsConsDiscussionsStream(
    prompt: string,
    abortSignal?: AbortSignal
  ) {
    try {
      const resp = await fetch(this.api + "/gpt/pros-cons-discusser-stream", {
        method: "POST",
        body: JSON.stringify({ prompt }),
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortSignal,
      });
      if (!resp.ok) {
        throw new Error("No se pudo realizar la conexión");
      }
      const reader = resp.body?.getReader();
      if (!reader) {
        throw new Error("No se pudo generar el reader");
      }
      const decoder = new TextDecoder();
      let text = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const decodeChunk = decoder.decode(value, { stream: true });
        text += decodeChunk;
        yield text;
      }
    } catch (_) {
      throw new Error("No se pudo generar el reader");
    }
  }
}

export default AssistantHandler;
