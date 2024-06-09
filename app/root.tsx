import "@fontsource-variable/inter/wght.css";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { Toaster } from "sonner";

import { Nav } from "./components/Nav";

import appStylesHref from "./globals.css?url";
import proseMirrorStylesHref from "./prosemirror.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
  { rel: "stylesheet", href: proseMirrorStylesHref },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="max-w-2xl mx-auto my-6">
          <Nav />
          <section className="my-12">{children}</section>
        </div>
        <Toaster />

        {/* Remix */}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
