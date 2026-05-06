import Credentials from "@auth/core/providers/credentials";
import type { AuthConfig } from "@auth/core";

export default {
  providers: [
    Credentials({
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const adminUser = import.meta.env.ADMIN_USER || "admin";
        const adminPassword = import.meta.env.ADMIN_PASSWORD || "plenitud2026";

        if (
          credentials?.username === adminUser &&
          credentials?.password === adminPassword
        ) {
          return {
            id: "1",
            name: "Administrador",
            email: "admin@plenitudemocional.com",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
} satisfies AuthConfig;
