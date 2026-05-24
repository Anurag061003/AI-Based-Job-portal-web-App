import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
import { deleteJob, getAdminJobs, getAllJobs, getJobById, getRecommendedJobs, postJob, updateJob } from "../controllers/JobController.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get( getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(getJobById);
router.route("/update/:id").put(isAuthenticated,singleUpload, updateJob);
router.delete("/delete/:id", isAuthenticated,deleteJob);
router.get("/recommended", isAuthenticated, getRecommendedJobs);

export default router;

