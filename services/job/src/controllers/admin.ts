import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";

// Get all jobs with pagination
export const getAllJobs = TryCatch(async (req, res, next) => {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let jobs;
    if (search) {
        const searchTerm = `%${search}%`;
        jobs = await sql`
            SELECT 
                j.job_id, j.title, j.description, j.salary, j.openings,
                j.job_type, j.work_location, c.name as company_name,
                c.company_id, j.created_at
            FROM jobs j
            LEFT JOIN companies c ON j.company_id = c.company_id
            WHERE j.title ILIKE ${searchTerm} OR c.name ILIKE ${searchTerm}
            ORDER BY j.created_at DESC
            LIMIT ${Number(limit)} OFFSET ${offset}
        `;
    } else {
        jobs = await sql`
            SELECT 
                j.job_id, j.title, j.description, j.salary, j.openings,
                j.job_type, j.work_location, c.name as company_name,
                c.company_id, j.created_at
            FROM jobs j
            LEFT JOIN companies c ON j.company_id = c.company_id
            ORDER BY j.created_at DESC
            LIMIT ${Number(limit)} OFFSET ${offset}
        `;
    }

    // Get total count
    const countResult = search
        ? await sql`SELECT COUNT(*) as total FROM jobs WHERE title ILIKE ${"%" + search + "%"} OR company_id IN (SELECT company_id FROM companies WHERE name ILIKE ${"%" + search + "%"})`
        : await sql`SELECT COUNT(*) as total FROM jobs`;

    const total = countResult[0].total;

    res.json({
        jobs,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
        },
    });
});

// Get job stats
export const getJobStats = TryCatch(async (req, res, next) => {
    const totalJobs = await sql`SELECT COUNT(*) as count FROM jobs`;
    const totalApplications =
        await sql`SELECT COUNT(*) as count FROM applications`;
    const companyCount = await sql`SELECT COUNT(*) as count FROM companies`;
    const hiredCount =
        await sql`SELECT COUNT(*) as count FROM applications WHERE status = 'Hired'`;

    res.json({
        totalJobs: totalJobs[0].count,
        totalApplications: totalApplications[0].count,
        companies: companyCount[0].count,
        hiredCandidates: hiredCount[0].count,
    });
});

// Get applications with pagination
export const getAllApplications = TryCatch(async (req, res, next) => {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let applications;
    if (status) {
        applications = await sql`
            SELECT 
                a.application_id, a.job_id, a.status, a.applied_at,
                j.title as job_title
            FROM applications a
            LEFT JOIN jobs j ON a.job_id = j.job_id
            WHERE a.status = ${status}
            ORDER BY a.applied_at DESC
            LIMIT ${Number(limit)} OFFSET ${offset}
        `;
    } else {
        applications = await sql`
            SELECT 
                a.application_id, a.job_id, a.status, a.applied_at,
                j.title as job_title
            FROM applications a
            LEFT JOIN jobs j ON a.job_id = j.job_id
            ORDER BY a.applied_at DESC
            LIMIT ${Number(limit)} OFFSET ${offset}
        `;
    }

    // Get total count
    const countResult = status
        ? await sql`SELECT COUNT(*) as total FROM applications WHERE status = ${status}`
        : await sql`SELECT COUNT(*) as total FROM applications`;

    const total = countResult[0].total;

    res.json({
        applications,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
        },
    });
});

// Update application status
export const updateApplicationStatus = TryCatch(async (req, res, next) => {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!["Submitted", "Rejected", "Hired"].includes(status)) {
        throw new ErrorHandler(400, "Invalid status");
    }

    const app =
        await sql`SELECT application_id FROM applications WHERE application_id = ${applicationId}`;

    if (app.length === 0) {
        throw new ErrorHandler(404, "Application not found");
    }

    const updated = await sql`
        UPDATE applications 
        SET status = ${status}
        WHERE application_id = ${applicationId}
        RETURNING *
    `;

    res.json({
        message: "Application updated successfully",
        application: updated[0],
    });
});

// Delete job
export const deleteJob = TryCatch(async (req, res, next) => {
    const { jobId } = req.params;

    const job = await sql`SELECT job_id FROM jobs WHERE job_id = ${jobId}`;

    if (job.length === 0) {
        throw new ErrorHandler(404, "Job not found");
    }

    // Delete applications first
    await sql`DELETE FROM applications WHERE job_id = ${jobId}`;

    // Delete job
    await sql`DELETE FROM jobs WHERE job_id = ${jobId}`;

    res.json({
        message: "Job deleted successfully",
        jobId,
    });
});

// Get company details
export const getCompanies = TryCatch(async (req, res, next) => {
    const companies = await sql`
        SELECT 
            c.company_id,
            c.name,
            c.description,
            c.website,
            c.logo,
            c.recruiter_id,
            c.created_at,
            COUNT(j.job_id) as job_count
        FROM companies c
        LEFT JOIN jobs j ON c.company_id = j.company_id
        GROUP BY c.company_id
        ORDER BY c.created_at DESC
    `;

    res.json(companies);
});

// Delete company
export const deleteCompany = TryCatch(async (req, res, next) => {
    const { companyId } = req.params;

    const company =
        await sql`SELECT company_id FROM companies WHERE company_id = ${companyId}`;

    if (company.length === 0) {
        throw new ErrorHandler(404, "Company not found");
    }

    // Delete jobs related to company first
    const jobs =
        await sql`SELECT job_id FROM jobs WHERE company_id = ${companyId}`;
    for (const job of jobs) {
        await sql`DELETE FROM applications WHERE job_id = ${job.job_id}`;
    }

    await sql`DELETE FROM jobs WHERE company_id = ${companyId}`;
    await sql`DELETE FROM companies WHERE company_id = ${companyId}`;

    res.json({
        message: "Company deleted successfully",
        companyId,
    });
});
