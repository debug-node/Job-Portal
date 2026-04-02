import express from "express";
import {
	getAllJobs,
	getJobStats,
	getAllApplications,
	updateApplicationStatus,
	deleteJob,
	getCompanies,
	deleteCompany,
} from "../controllers/admin.js";
import { verifyAdmin } from "../middleware/admin.js";

const router = express.Router();

// All admin routes require admin key
router.use(verifyAdmin);

// Job management
router.get("/jobs/all", getAllJobs);
router.get("/jobs/stats", getJobStats);
router.delete("/jobs/delete/:jobId", deleteJob);

// Application management
router.get("/applications/all", getAllApplications);
router.put("/applications/update/:applicationId", updateApplicationStatus);

// Company management
router.get("/companies/all", getCompanies);
router.delete("/companies/delete/:companyId", deleteCompany);

export default router;
