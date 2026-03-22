import {User} from '../users/user.model.js';
import {Job} from '../jobs/job.model.js';
import {Application} from '../applications/application.model.js';

export const getSystemAnalytics = async (req, res, next) => {
  try {
    // 1. User Demographics
    const userStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // 2. Application Funnel (Conversion Rates)
    const applicationStats = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 3. Top 5 Most In-Demand Skills (Unwind arrays and count)
    const topSkills = await Job.aggregate([
      { $unwind: '$skillsRequired' }, // Splits the array into individual documents
      { $group: { _id: '$skillsRequired', demandCount: { $sum: 1 } } },
      { $sort: { demandCount: -1 } }, // Sort descending
      { $limit: 5 }
    ]);

    // 4. Quick Totals
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    res.status(200).json({
      status: 'success',
      data: {
        users: userStats,
        applications: applicationStats,
        topSkills,
        overview: {
          totalJobs,
          totalApplications,
          avgApplicationsPerJob: totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};