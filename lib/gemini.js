/**
 * Call a Gemini chat's sendMessage with retry on 429 (rate limit).
 * Parses "Please retry in X.XXs" or uses defaultDelay, then retries up to maxRetries times.
 */

const DEFAULT_RETRY_DELAY_MS = 12_000; // 12s
const MAX_RETRIES = 2;

function parseRetryDelayMs(error) {
  if (!error?.message) return DEFAULT_RETRY_DELAY_MS;
  const match = error.message.match(/[Rr]etry in (\d+(?:\.\d+)?)\s*s/);
  if (match) return Math.ceil(parseFloat(match[1]) * 1000);
  if (/429|Too Many Requests|quota|rate limit/i.test(error.message)) return DEFAULT_RETRY_DELAY_MS;
  return DEFAULT_RETRY_DELAY_MS;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {{ sendMessage: (prompt: string) => Promise<{ response: { text: () => string } }> }} chat - Gemini chat (e.g. courseOutline, generateNotes)
 * @param {string} prompt
 * @returns {Promise<{ response: { text: () => string } }>}
 */
export async function sendMessageWithRetry(chat, prompt) {
  let lastError;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await chat.sendMessage(prompt);
    } catch (err) {
      lastError = err;
      const isRateLimit = err?.message && (/429|Too Many Requests|quota exceeded|rate limit/i.test(err.message));
      if (!isRateLimit || attempt === MAX_RETRIES) throw err;
      const delayMs = parseRetryDelayMs(err);
      await sleep(delayMs);
    }
  }
  throw lastError;
}
