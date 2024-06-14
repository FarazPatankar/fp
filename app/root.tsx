import "@fontsource-variable/inter/wght.css";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Toaster } from "sonner";

import { Nav } from "./components/Nav";

import appStylesHref from "./globals.css?url";
import proseMirrorStylesHref from "./prosemirror.css?url";
import { authenticator } from "./lib/auth/auth.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
  { rel: "stylesheet", href: proseMirrorStylesHref },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const isAuthenticated = await authenticator.isAuthenticated(request);

  return { isAuthenticated: isAuthenticated != null };
};

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");

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
          <Nav isAuthenticated={data?.isAuthenticated ?? false} />
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
