import { Inngest } from "inngest";

// Event key is required to send events. Set INNGEST_EVENT_KEY in .env.local.
// Create one at https://app.inngest.com → Manage → Create Event Key
export const inngest = new Inngest({
  id: "ai-study-material-gen",
  eventKey: process.env.INNGEST_EVENT_KEY,
});
