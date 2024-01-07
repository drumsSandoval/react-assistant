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
}

export default AssistantHandler;
