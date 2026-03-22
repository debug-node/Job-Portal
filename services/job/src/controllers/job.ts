import axios from "axios";
import { AuthenticatedRequest } from "../middleware/auth.js";
import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";
import { applicationStatusUpdateTemplate } from "../template.js";
import { publishToTopic } from "../producer.js";

export const createCompany = TryCatch(async (req: AuthenticatedRequest, res) => {
	const user = req.user;

	if (!user) {
		throw new ErrorHandler(401, "Authentication required");
	}

	if (user.role !== "recruiter") {
		throw new ErrorHandler(403, "Forbidden: Only recruiters can create companies");
	}

	const { name, description, website } = req.body;

	if (!name || !description || !website) {
		throw new ErrorHandler(
			400,
			"All the fields (name, description, website) required",
		);
	}

	const existingCompanies =
		await sql`SELECT company_id FROM companies WHERE name = ${name}`;

	if (existingCompanies.length > 0) {
		throw new ErrorHandler(409, `Company with this name ${name} already exists`);
	}

	const file = req.file;

	if (!file) {
		throw new ErrorHandler(400, "Company logo is required");
	}

	const fileBuffer = getBuffer(file);

	if (!fileBuffer || !fileBuffer.content) {
		throw new ErrorHandler(500, "Failed to process the uploaded file");
	}

	const { data } = await axios.post(`${process.env.UPLOAD_SERVICE}/api/utils/upload`, {
		buffer: fileBuffer.content,
	});

	const [newCompany] = await sql`
        INSERT INTO companies (name, description, website, logo, logo_public_id, recruiter_id)
        VALUES (${name}, ${description}, ${website}, ${data.url}, ${data.public_id}, ${req.user?.user_id}) RETURNING *
    `;

	res.json({
		message: "Company created successfully",
		company: newCompany,
	});
});

export const deleteCompany = TryCatch(async (req: AuthenticatedRequest, res) => {
	const user = req.user;

	const { companyId } = req.params;

	const [company] = await sql`
        SELECT logo_public_id FROM companies WHERE company_id = ${companyId} AND recruiter_id = ${user?.user_id}
    `;

	if (!company) {
		throw new ErrorHandler(
			404,
			"Company not found or you don't have authorized to delete this company",
		);
	}

	await sql`
        DELETE FROM companies WHERE company_id = ${companyId}
    `;

	res.json({
		message: "Company and all associated data deleted successfully",
	});
});

export const createJob = TryCatch(async (req: AuthenticatedRequest, res) => {
	const user = req.user;

	if (!user) {
		throw new ErrorHandler(401, "Authentication required");
	}

	if (user.role !== "recruiter") {
		throw new ErrorHandler(403, "Forbidden: Only recruiters can create jobs");
	}

	const {
		title,
		description,
		salary,
		location,
		job_type,
		openings,
		role,
		work_location,
		company_id,
	} = req.body;

	if (!title || !description || !openings || !role || !salary || !location || !job_type || !work_location || !company_id) {
		throw new ErrorHandler(400, "All fields are required");
	}

	if (title.trim().length === 0) {
		throw new ErrorHandler(400, "Title cannot be empty");
	}

	if (description.trim().length === 0) {
		throw new ErrorHandler(400, "Description cannot be empty");
	}

	const validJobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
	if (!validJobTypes.includes(job_type)) {
		throw new ErrorHandler(400, `Job type must be one of: ${validJobTypes.join(', ')}`);
	}

	const validWorkLocations = ['On-site', 'Remote', 'Hybrid'];
	if (!validWorkLocations.includes(work_location)) {
		throw new ErrorHandler(400, `Work location must be one of: ${validWorkLocations.join(', ')}`);
	}

	const parsedCompanyId = parseInt(company_id, 10);
	if (isNaN(parsedCompanyId) || parsedCompanyId <= 0) {
		throw new ErrorHandler(400, "Company ID must be a valid positive number");
	}

	const parsedSalary = parseFloat(salary);
	const parsedOpenings = parseInt(openings.toString(), 10);

	if (isNaN(parsedSalary)) {
		throw new ErrorHandler(400, "Salary must be a valid number");
	}

	if (isNaN(parsedOpenings)) {
		throw new ErrorHandler(400, "Openings must be a valid whole number (integer)");
	}

	if (parseFloat(openings) !== parsedOpenings) {
		throw new ErrorHandler(400, "Openings must be a whole number, not a decimal");
	}

	if (parsedOpenings <= 0) {
		throw new ErrorHandler(400, "Openings must be greater than 0");
	}

	if (parsedOpenings > 9999) {
		throw new ErrorHandler(400, "Openings cannot exceed 9999");
	}

	if (parsedSalary <= 0) {
		throw new ErrorHandler(400, "Salary must be greater than 0");
	}

	if (parsedSalary > 99999999.99) {
		throw new ErrorHandler(400, "Salary cannot exceed 99,999,999.99");
	}

	const [company] = await sql`
        SELECT company_id FROM companies WHERE company_id = ${parsedCompanyId} AND recruiter_id = ${user.user_id}
    `;

	if (!company) {
		throw new ErrorHandler(
			404,
			"Company not found or you don't have authorized to post job for this company",
		);
	}

	const [newJob] = await sql`
        INSERT INTO jobs (title, description, salary, location, job_type, openings, role, work_location, company_id, posted_by_recruiter_id)
        VALUES (${title}, ${description}, ${parsedSalary}, ${location}, ${job_type}, ${parsedOpenings}, ${role}, ${work_location}, ${parsedCompanyId}, ${user.user_id}) RETURNING *
    `;

	res.json({
		message: "Job created successfully",
		job: newJob,
	});
});

export const updateJob = TryCatch(async (req: AuthenticatedRequest, res) => {
	const user = req.user;

	if (!user) {
		throw new ErrorHandler(401, "Authentication required");
	}

	if (user.role !== "recruiter") {
		throw new ErrorHandler(403, "Forbidden: Only recruiters can update jobs");
	}

	const {
		title,
		description,
		salary,
		location,
		job_type,
		openings,
		role,
		work_location,
		company_id,
		is_active,
	} = req.body;

	const [existingJob] = await sql`
        SELECT posted_by_recruiter_id FROM jobs WHERE job_id = ${req.params.jobId}
    `;

	if (!existingJob) {
		throw new ErrorHandler(404, "Job not found");
	}

	if (existingJob.posted_by_recruiter_id !== user.user_id) {
		throw new ErrorHandler(
			403,
			"Forbidden: You don't have authorized to update this job",
		);
	}

	const parsedUpdateSalary = salary !== undefined && salary !== null ? parseFloat(salary) : undefined;
	const parsedUpdateOpenings = openings !== undefined && openings !== null ? parseInt(openings.toString(), 10) : undefined;

	if (title !== undefined && title.trim().length === 0) {
		throw new ErrorHandler(400, "Title cannot be empty");
	}

	if (description !== undefined && description.trim().length === 0) {
		throw new ErrorHandler(400, "Description cannot be empty");
	}

	const validJobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
	if (job_type !== undefined && !validJobTypes.includes(job_type)) {
		throw new ErrorHandler(400, `Job type must be one of: ${validJobTypes.join(', ')}`);
	}

	const validWorkLocations = ['On-site', 'Remote', 'Hybrid'];
	if (work_location !== undefined && !validWorkLocations.includes(work_location)) {
		throw new ErrorHandler(400, `Work location must be one of: ${validWorkLocations.join(', ')}`);
	}

	if (parsedUpdateSalary !== undefined && isNaN(parsedUpdateSalary)) {
		throw new ErrorHandler(400, "Salary must be a valid number");
	}

	if (parsedUpdateOpenings !== undefined && isNaN(parsedUpdateOpenings)) {
		throw new ErrorHandler(400, "Openings must be a valid whole number (integer)");
	}

	if (openings !== undefined && parseFloat(openings) !== parsedUpdateOpenings) {
		throw new ErrorHandler(400, "Openings must be a whole number, not a decimal");
	}

	if (parsedUpdateOpenings !== undefined && parsedUpdateOpenings < 0) {
		throw new ErrorHandler(400, "Openings cannot be negative");
	}

	if (parsedUpdateOpenings !== undefined && parsedUpdateOpenings > 9999) {
		throw new ErrorHandler(400, "Openings cannot exceed 9999");
	}

	if (parsedUpdateSalary !== undefined && parsedUpdateSalary <= 0) {
		throw new ErrorHandler(400, "Salary must be greater than 0");
	}

	if (parsedUpdateSalary !== undefined && parsedUpdateSalary > 99999999.99) {
		throw new ErrorHandler(400, "Salary cannot exceed 99,999,999.99");
	}

	const [updatedJob] = await sql`
        UPDATE jobs SET
            title = ${title ?? undefined},
            description = ${description ?? undefined},
            salary = ${parsedUpdateSalary ?? undefined},
            location = ${location ?? undefined},
            job_type = ${job_type ?? undefined},
            openings = ${parsedUpdateOpenings ?? undefined},
            role = ${role ?? undefined},
            work_location = ${work_location ?? undefined},
            is_active = ${is_active ?? undefined}
        WHERE job_id = ${req.params.jobId} RETURNING *;
    `;

	res.json({
		message: "Job updated successfully",
		job: updatedJob,
	});
});

export const getAllCompany = TryCatch(async (req: AuthenticatedRequest, res) => {
	const companies = await sql`
        SELECT * FROM companies WHERE recruiter_id = ${req.user?.user_id}
    `;

	res.json(companies);
});

export const getCompanyDetails = TryCatch(async (req: AuthenticatedRequest, res) => {
	const { id } = req.params;

	if (!id) {
		throw new ErrorHandler(400, "Company ID is required");
	}

	const [companyData] = await sql`
        SELECT c.*, COALESCE(
            (
                SELECT json_agg(j.*) FROM jobs j WHERE j.company_id = c.company_id
            ),
            '[]'::json
        ) AS jobs
        FROM companies c WHERE c.company_id = ${id} GROUP BY c.company_id;
    `;

	if (!companyData) {
		throw new ErrorHandler(404, "Company not found");
	}

	res.json(companyData);
});

export const getAllActiveJobs = TryCatch(async (req, res) => {
	const { title, location } = req.query as {
		title?: string;
		location?: string;
	};

	let queryString = `
        SELECT j.job_id, j.title, j.description, j.salary, j.location, j.job_type, j.role, j.work_location, j.created_at,
        c.name AS company_name, c.logo AS company_logo, c.company_id AS company_id
        FROM jobs j
        JOIN companies c ON j.company_id = c.company_id
        WHERE j.is_active = true
        `;

	const values = [];

	let paramIndex = 1;

	if (title) {
		queryString += ` AND j.title ILIKE $${paramIndex}`;
		values.push(`%${title}%`);
		paramIndex++;
	}

	if (location) {
		queryString += ` AND j.location ILIKE $${paramIndex}`;
		values.push(`%${location}%`);
		paramIndex++;
	}

	queryString += ` ORDER BY j.created_at DESC`;

	const jobs = (await sql.query(queryString, values)) as any[];

	res.json(jobs);
});

export const getSingleJob = TryCatch(async (req, res) => {
	const [job] = await sql`
    SELECT * FROM jobs WHERE job_id = ${req.params.jobId}
  `;

	res.json(job);
});

export const getAllApplicationForJob = TryCatch(
	async (req: AuthenticatedRequest, res) => {
		const user = req.user;
		if (!user) {
			throw new ErrorHandler(401, "Authentication required");
		}

		if (user.role !== "recruiter") {
			throw new ErrorHandler(
				403,
				"Forbidden: Only recruiters can view applications",
			);
		}

		const { jobId } = req.params;

		const [job] = await sql`
		SELECT posted_by_recruiter_id FROM jobs WHERE job_id = ${jobId}
	`;

		if (!job) {
			throw new ErrorHandler(404, "Job not found");
		}

		if (job.posted_by_recruiter_id !== user.user_id) {
			throw new ErrorHandler(
				403,
				"Forbidden: You don't have authorized to view applications for this job",
			);
		}

		const applications =
			await sql`SELECT * FROM applications WHERE job_id = ${jobId} ORDER BY subscribed DESC, applied_at ASC`;

		res.json(applications);
	},
);

export const updateApplication = TryCatch(async (req: AuthenticatedRequest, res) => {
	const user = req.user;
	if (!user) {
		throw new ErrorHandler(401, "Authentication required");
	}

	if (user.role !== "recruiter") {
		throw new ErrorHandler(
			403,
			"Forbidden: Only recruiters can update application status",
		);
	}

	const { id } = req.params;

	const [application] =
		await sql`SELECT * FROM applications WHERE application_id = ${id}`;

	if (!application) {
		throw new ErrorHandler(404, "Application not found");
	}

	const [job] =
		await sql`SELECT posted_by_recruiter_id, title FROM jobs WHERE job_id = ${application.job_id}`;

	if (!job) {
		throw new ErrorHandler(404, "Associated job not found");
	}

	if (job.posted_by_recruiter_id !== user.user_id) {
		throw new ErrorHandler(
			403,
			"Forbidden: You don't have authorized to update status for this application",
		);
	}

	const [updatedApplication] = await sql`
			UPDATE applications SET status = ${req.body.status} WHERE application_id = ${id} RETURNING *;
		`;

	const message = {
		to: application.applicant_email,
		subject: "Application Update - Hireheaven",
		html: applicationStatusUpdateTemplate(job.title, updatedApplication.status),
	};

	publishToTopic(message).catch((error) => {
		console.error("Failed to queue email to Bull Queue:", error);
	});

	res.json({
		message: "Application status updated successfully",
		job,
		updatedApplication,
	});
});
