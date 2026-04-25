import { Router } from "express";
import {
  addNewProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
  updateStockByProductId,
} from "../controller/productController.js";
import authMiddleware from "../middleware/auth.js";
import isManager from "../middleware/isManager.js";

const productRouter = Router();

productRouter.route("/").get(getAllProducts);
productRouter
  .route("/:id")
  .get(getProductById)
  .put(authMiddleware, isManager, updateProductById)
  .delete(authMiddleware, isManager, deleteProductById);
productRouter
  .route("/stock/:id")
  .put(authMiddleware, isManager, updateStockByProductId);
productRouter.route("/add").post(authMiddleware, isManager, addNewProduct);

export default productRouter;
