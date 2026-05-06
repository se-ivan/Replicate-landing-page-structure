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

  return next();
});
