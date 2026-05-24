import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { extractResumeText } from "../utils/resumeParser.js";
import { getResumeScore } from "../ai/resumeScore.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        const user = await User.findById(userId);
      
 // create a new application
const newApplication = await Application.create({
    job: jobId,
    applicant: userId,
    resumeScore:0
});

        job.applications.push(newApplication._id);
        await job.save();

         res.status(201).json({
            message: "Job applied successfully.",
            success: true
        });

        // ⚡ Run AI scoring in background
        if (user?.profile?.resume) {
            try {
                const resumeText = await extractResumeText(user.profile.resume);
                console.log("Resume Text Length:", resumeText.length);

                const score = await getResumeScore(
                    resumeText,
                    job.requirements
                );

                newApplication.resumeScore = score;
                await newApplication.save();

                console.log("Score updated:", score);
            } catch (err) {
                console.log("AI scoring error:", err);
            }
        }

       const message = `Hi ${user.fullname},

🎯 Success! You have successfully applied for the job: "${job.title}".

What’s next?
✔ The recruiter will review your application.
✔ Keep an eye on your email for updates.
✔ Prepare your documents or portfolio if required.

We wish you the best of luck! 🍀

Regards,
Team ApplyNow
`;

        sendEmail(user.email, "Job Application Confirmation", message);
    } catch (error) {
        console.log(error);
    }
};
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company',
                options: { sort: { createdAt: -1 } },
            }
        });
        if (!application) {
            return res.status(404).json({
                message: "No Applications",
                success: false
            })
        };
        return res.status(200).json({
            application,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
//Admin side
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { resumeScore: -1 } },
            populate: {
                path: 'applicant'
            }
        });
        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            })
        };
        return res.status(200).json({
            job,
            succees: true
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if (!status) {
            return res.status(400).json({
                message: 'status is required',
                success: false
            })
        };

        // find the application by applicantion id
        const application = await Application.findById(applicationId).populate("applicant").populate("job");
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        if (status.toLowerCase() === "accepted") {
           const message = `Hi ${application.applicant.fullname}, 

🎉 Congratulations!

Your application for the job "${application.job.title}" has been ACCEPTED.

What's next?
✔ The recruiter will contact you soon.
✔ Keep your phone and email handy for updates.
✔ Prepare for interviews if applicable.

We’re excited for you and wish you all the best in this opportunity! 🚀

Best Regards,
Team ApplyNow
`;
            await sendEmail(
                application.applicant.email,
                "Job Application Accepted",
                message
            );
        }

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });

    } catch (error) {
        console.log(error);
    }
}