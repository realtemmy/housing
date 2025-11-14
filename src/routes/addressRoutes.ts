import { Router } from "express";
import {
  getAllAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController";

const router = Router();

router.route("/").get(getAllAddresses).post(createAddress);

// router.route("/property/:propertyId").get(getAddressByProperty);

router
  .route("/:id")
  .get(getAddress)
  .patch(updateAddress)
  .delete(deleteAddress);

export default router;
