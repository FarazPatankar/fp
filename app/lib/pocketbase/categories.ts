import { getPocketBaseClient } from ".";
import { CategoriesResponse, Collections } from "./db-types";

export const getCategories = async () => {
  const pb = getPocketBaseClient();

  const categories = await pb
    .collection(Collections.Categories)
    .getFullList<CategoriesResponse>();

  return categories;
};
