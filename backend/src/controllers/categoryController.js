import { getAllCategories } from "../models/categoryModel.js";

export async function listCategories(_request, response, next) {
  try {
    response.json(await getAllCategories());
  } catch (error) {
    next(error);
  }
}
