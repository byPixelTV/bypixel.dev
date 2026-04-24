import { APIError, betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "./mongo";

export const auth = betterAuth({
  database: mongodbAdapter(db),
  experimental: { joins: true },
  emailAndPassword: {
    enabled: false
  },
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || ""
    }
  },
  user: {
    additionalFields: {
      admin: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      }
    }
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!user.email) {
            throw new APIError("BAD_REQUEST", {
              message: "no_email"
            });
          }

          const isFirstUser = (await db.collection("user").countDocuments()) === 0;

          if (!isFirstUser) {
            throw new APIError("FORBIDDEN", {
              message: "disabled"
            });
          }

          return {
            data: {
              ...user,
              admin: true
            }
          };
        }
      }
    }
  }
})