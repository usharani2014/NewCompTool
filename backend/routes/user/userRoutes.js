import express from "express";
import {
  getFormData,
  uploadFormData,
  deleteFormData,
  powerBiAccessToken,
  getMaturityData,
  uploadMaturityData,
  getMaturitySummary,
  getAlertNotiData,
  uploadReturnsData,
  getReturnsData,
  getCheckerFormData,
  checkerCheckedData,
  getMakerFormData,
  makerUploadFormData,
  uploadExistingFormData,
  getDepartmentUser,
} from "../../controllers/userController.js";
import { isUser } from "../../middleware/validateTokenHandler.js";
const router = express.Router();

router.get("/getformData", isUser, getFormData);
router.post("/SendFormData", isUser, uploadFormData);
router.post("/SendExistingFormData", isUser, uploadExistingFormData);
router.delete("/deleteFormData", isUser, deleteFormData);
router.post("/powerBiAccessToken", isUser, powerBiAccessToken);
router.post("/uploadMaturityData", uploadMaturityData);
router.get("/getMaturityData", isUser, getMaturityData);
router.get("/getMaturitySummary", isUser, getMaturitySummary);
router.get("/getAlertNoti", isUser, getAlertNotiData);
router.post("/uploadReturns", isUser, uploadReturnsData);
router.get("/getReturns", isUser, getReturnsData);
router.get("/getCheckerFormData", isUser, getCheckerFormData);
router.get("/getMakerFormData", isUser, getMakerFormData);
router.put("/checkerUpdateFormData", isUser, checkerCheckedData);
router.put("/makerUploadFormData", isUser, makerUploadFormData);
router.get("/getDepartmentUser", isUser, getDepartmentUser);

export default router;
