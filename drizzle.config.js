import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials: {
    url: 'postgresql://neondb_owner:QSu5eTXa3rqg@ep-lively-band-a1fx4e17.ap-southeast-1.aws.neon.tech/AI-Study-Material-Gen?sslmode=require'
  },
});
