import { Router } from "express";
import {
  addNewProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
  updateStockByProductId,
} from "../controller/productController.js";

const productRouter = Router();

productRouter.route("/products").get(getAllProducts);
productRouter
  .route("/products/:id")
  .get(getProductById)
  .put(updateProductById)
  .delete(deleteProductById);
productRouter.route("/products/stock/:id").put(updateStockByProductId);
productRouter.route("/products/add").post(addNewProduct);

export default productRouter;
