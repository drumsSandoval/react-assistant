import { OrthographyResponse } from "./interfaces";

class AssistantHandler {
  static api = import.meta.env.VITE_API_DEV;

  static async OrthographyUseCase(prompt: string) {
    try {
      const resp = await fetch(`${this.api}/gpt/orthography-check`, {
        method: "POST",
        body: JSON.stringify({ prompt }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!resp.ok) {
        throw new Error("No se pudo realizar la corrección");
      }
      const data: OrthographyResponse =
        (await resp.json()) as OrthographyResponse;
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
}

export default AssistantHandler;
