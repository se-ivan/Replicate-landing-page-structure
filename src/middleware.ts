import { getSession } from "auth-astro/server";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const session = await getSession(context.request);
    if (!session?.user) {
      return context.redirect("/login");
    }
  }

  const response = await next();
  const contentType = response.headers.get("content-type");

  if (contentType?.startsWith("text/html") && !contentType.toLowerCase().includes("charset=")) {
    response.headers.set("content-type", "text/html; charset=utf-8");
  }

  return response;
});
