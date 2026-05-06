export const prerender = false;
import { Auth } from "@auth/core";
import authConfig from "../../../auth.config";
import type { APIRoute } from "astro";

export const ALL: APIRoute = async ({ request }) => {
  return Auth(request, {
    ...authConfig,
    secret: import.meta.env.AUTH_SECRET,
    trustHost: true,
  });
};
