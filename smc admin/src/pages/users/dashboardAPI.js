const Channel = require("../Model/channel_model");
const PreCourse = require("../Model/pre_genCourses_model");
const Quiz = require("../Model/quizz_model");
const Referral = require("../Model/referralSchema");
const SubscriptionPlan = require("../Model/subscriptionplan_model");
const User = require("../Model/user_model");


exports.aggregateData = async (req, res) => {
  try {
    // Total Users
    const totalUsers = await User.countDocuments();

    // Active Users
    const activeUsers = await User.countDocuments({ verified: true });

    // Courses Completed
    const courseCompleted = await PreCourse.countDocuments({ completed: true });

    // Quizzes Attempted
    const quizzesAttempted = await Quiz.countDocuments();

    // New Registrations (current month)
    const newRegistrations = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    // Total Courses
    const totalCourses = await PreCourse.countDocuments();

    // Total Study Groups
    const totalStudyGroups = await Channel.countDocuments();

    // Recurring Revenue
    const recurringRevenue = await Referral.aggregate([
      { $unwind: "$paidUsers" },
      { $group: { _id: null, totalCommission: { $sum: "$commission" } } }
    ]);

    // Referral Sign-Ups
    const referralSignUps = await Referral.countDocuments();

    // Commissions Paid (static for now)
    const commissionsPaid = 2000;

    // Subscription Data
    const subscriptions = await SubscriptionPlan.aggregate([
      {
        $group: {
          _id: "$packagename",
          userCount: { $sum: 1 },
          totalRevenue: { $sum: "$price" }
        }
      }
    ]);

    // Prepare the response
    const response = {
      kPIs: {
        totalUsers,
        activeUsers,
        courseCompleted,
        quizessAttempted: quizzesAttempted,
        newRegistrations,
        courseGenerated: totalCourses,
        totalStudyGroups,
        recurringRevenue: recurringRevenue[0] ? recurringRevenue[0].totalCommission : 0,
        referaalSignUps: referralSignUps,
        commisionsPaid: commissionsPaid,
      },
      subscriptions: subscriptions.reduce((acc, curr) => {
        acc[curr._id] = curr.userCount;
        return acc;
      }, {}),
      subscriptionRevenue: subscriptions.reduce((acc, curr) => {
        acc[curr._id] = curr.totalRevenue;
        return acc;
      }, {}),
      preGenratedCourses: {
        totalCourses: totalCourses,
      },
      Quiz: {
        totalQuizzes: await Quiz.countDocuments(),
      }
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


