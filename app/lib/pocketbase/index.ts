import PocketBase from "pocketbase";
import { envs } from "../env";
import { Collections, EntriesResponse } from "./db-types";

let pb: PocketBase | null = null;

export const getPocketBaseClient = () => {
  if (pb == null) {
    pb = new PocketBase(envs.PB_TYPEGEN_URL);
  }

  return pb;
};

export const getEntries = async () => {
  const pb = getPocketBaseClient();
  const entries = await pb
    .collection(Collections.Entries)
    .getFullList<EntriesResponse>();

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
  content,
}: {
  id: string;
  content: string;
}) => {
  const pb = getPocketBaseClient();
  await pb.admins.authWithPassword(
    envs.PB_TYPEGEN_EMAIL,
    envs.PB_TYPEGEN_PASSWORD,
  );

  const entry = await pb
    .collection(Collections.Entries)
    .update(id, { content });

  return entry;
};
