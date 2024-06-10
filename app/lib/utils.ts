import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sourced from: https://github.com/epicweb-dev/epic-stack/blob/main/app/utils/misc.tsx#L65
 *
 * I might replace it with a constant if it feels too smart in the future.
 */
export const getDomainUrl = (request: Request) => {
  const host =
    request.headers.get("X-Forwarded-Host") ??
    request.headers.get("host") ??
    new URL(request.url).host;
  const protocol = request.headers.get("X-Forwarded-Proto") ?? "http";
  return `${protocol}://${host}`;
};
