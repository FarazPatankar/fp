import type { LoaderFunctionArgs } from "@remix-run/node";
import { generateSitemap } from "@nasa-gcn/remix-seo";

// @ts-expect-error Virtual modules are not recognized by TypeScript
// eslint-disable-next-line import/no-unresolved
import { routes } from "virtual:remix/server-build";

import { getDomainUrl } from "~/lib/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const siteUrl = getDomainUrl(request);

  return generateSitemap(request, routes, {
    siteUrl,
  });
};
