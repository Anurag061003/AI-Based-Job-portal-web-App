import { Job } from "../models/Job.js";
import { User } from "../models/User.js";
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Somethin is missing.",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: 'company',
            createdAt: -1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, experienceLevel, location, jobType, position } = req.body;

        // Convert requirements string to array if coming as comma separated
        let requirementsArray = requirements;
        if (typeof requirements === "string") {
            requirementsArray = requirements.split(",").map((item) => item.trim());
        }

        const updateData = {
            title,
            description,
            requirements: requirementsArray,
            salary,
            experienceLevel,
            location,
            jobType,
            position
        };

        const job = await Job.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Job updated successfully.",
            success: true,
            job
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server Error",
            success: false
        });
    }
};
export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        await Job.findByIdAndDelete(jobId);

        return res.status(200).json({
            message: "Job deleted successfully",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};
export const getRecommendedJobs = async (req, res) => {
    try {
        const userId = req.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        const user = await User.findById(userId);
        const userSkills = user.profile.skills;
        const recommendedJobs = await Job.find({
            requirements: { $in: userSkills }
        }).populate("company");
        return res.status(200).json({
            success: true,
            jobs: recommendedJobs
        })

    } catch (error) {
        console.log(error)
    }
}


