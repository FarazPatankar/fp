import PocketBase from "pocketbase";
import { envs } from "../env";
import { Collections, EntriesRecord, EntriesResponse } from "./db-types";

let pb: PocketBase | null = null;

export const getPocketBaseClient = () => {
  if (pb == null) {
    pb = new PocketBase(envs.PB_TYPEGEN_URL);
  }

  return pb;
};

export const getEntries = async (category: string | null) => {
  const pb = getPocketBaseClient();
  const entries = await pb
    .collection(Collections.Entries)
    .getFullList<EntriesResponse>(
      undefined,
      category == null
        ? {}
        : {
            filter: `category="${category}"`,
          },
    );

  return entries;
};

export const getEntry = async (slug: string) => {
  const pb = getPocketBaseClient();
  const entry = await pb
    .collection(Collections.Entries)
    .getFirstListItem<EntriesResponse>(`slug="${slug}"`);

  return entry;
};

export const updateEntry = async ({
  id,
  args,
}: {
  id: string;
  args: Partial<EntriesRecord>;
}) => {
  const pb = getPocketBaseClient();
  await pb.admins.authWithPassword(
    envs.PB_TYPEGEN_EMAIL,
    envs.PB_TYPEGEN_PASSWORD,
  );

  const entry = await pb.collection(Collections.Entries).update(id, args);

  return entry;
};
