// telegram.ts
import axios from "axios";

const BOT_TOKEN = "8443840381:AAELByGjR20upJiPRHbVNkZojlR4yNfuLQY";
const CHAT_ID = "-1003132803793";
const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

function escapeMarkdownV2(s: string) {
  // Telegram MarkdownV2 escaping
  return s.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

async function sendTelegram(text: string) {
  // Telegram limit ~4096 chars; chunk if needed
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += 3500)
    chunks.push(text.slice(i, i + 3500));
  for (const chunk of chunks) {
    await axios.post(`${API}/sendMessage`, {
      chat_id: CHAT_ID,
      text: chunk,
      parse_mode: "MarkdownV2",
      disable_web_page_preview: true,
    });
  }
}

export async function notifyError(
  err: unknown,
  context: Record<string, any> = {}
) {
  try {
    const safe = scrub(err, context);
    const payload = [
      `*${escapeMarkdownV2(safe.title)}*`,
      "`" + escapeMarkdownV2(safe.error) + "`",
      safe.stack ? "```\n" + safe.stack.slice(0, 3000) + "\n```" : "",
      Object.keys(safe.meta).length
        ? "*meta*: `" + escapeMarkdownV2(JSON.stringify(safe.meta)) + "`"
        : "",
      `env: \`production\``,
      `ts: \`${new Date().toISOString().replace("T", " ").substring(0, 19)}\``,
    ]
      .filter(Boolean)
      .join("\n");

    await sendTelegram(payload);
  } catch (e) {
    console.error("Failed to send Telegram error:", e);
  }
}

function scrub(err: any, ctx: Record<string, any>) {
  const title = err?.name || "UnhandledError";
  const message = typeof err?.message === "string" ? err.message : String(err);
  const stack = typeof err?.stack === "string" ? err.stack : undefined;

  // Remove secrets from context
  const meta = { ...ctx };
  for (const k of Object.keys(meta)) {
    if (/(password|secret|token|authorization|cookie|key)/i.test(k))
      meta[k] = "***";
  }

  return {
    title,
    error: message,
    stack,
    meta,
  };
}
