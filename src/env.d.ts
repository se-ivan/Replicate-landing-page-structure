/// <reference types="astro/client" />

declare module "*.css";

declare module "figma:asset/*" {
  const src: string;
  export default src;
}
