const Program = require("../models/Program");
const Student = require("../models/Student");
const HttpError = require("../utils/httpError");

async function buildProgramRecommendations(studentId) {
  const student = await Student.findById(studentId).lean();

  if (!student) {
    throw new HttpError(404, "Student not found.");
  }

  const recommendations = await Program.aggregate([
    //only consider programs from student's target countries
    {
      $match: {
        country: { $in: student.targetCountries },
      },
    },

    //calculate match score
    {
      $addFields: {
        matchScore: {
          $add: [
            // +35 if country matches
            {
              $cond: [{ $in: ["$country", student.targetCountries] }, 35, 0],
            },
            // +30 if field matches any interested field
            {
              $cond: [
                {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: student.interestedFields,
                          as: "f",
                          cond: {
                            $regexMatch: {
                              input: "$field",
                              regex: { $toLower: "$$f" },
                              options: "i",
                            },
                          },
                        },
                      },
                    },
                    0,
                  ],
                },
                30,
                0,
              ],
            },
            // +20 if within budget
            {
              $cond: [
                { $lte: ["$tuitionFeeUsd", student.maxBudgetUsd] },
                20,
                0,
              ],
            },
            // +10 if preferred intake available
            {
              $cond: [{ $in: [student.preferredIntake, "$intakes"] }, 10, 0],
            },
            // +5 if IELTS score meets minimum
            {
              $cond: [
                {
                  $gte: [student.englishTest?.score || 0, "$minimumIelts"],
                },
                5,
                0,
              ],
            },
          ],
        },

        //build reasons array
        reasons: {
          $concatArrays: [
            {
              $cond: [
                { $in: ["$country", student.targetCountries] },
                [{ $concat: ["Preferred country match: ", "$country"] }],
                [],
              ],
            },
            {
              $cond: [
                { $lte: ["$tuitionFeeUsd", student.maxBudgetUsd] },
                ["Within budget range"],
                [],
              ],
            },
            {
              $cond: [
                { $in: [student.preferredIntake, "$intakes"] },
                [
                  {
                    $concat: [
                      "Preferred intake available: ",
                      student.preferredIntake,
                    ],
                  },
                ],
                [],
              ],
            },
            {
              $cond: [
                { $gte: [student.englishTest?.score || 0, "$minimumIelts"] },
                ["English test score meets requirement"],
                [],
              ],
            },
          ],
        },
      },
    },

    //sort by score
    { $sort: { matchScore: -1 } },

    //top 5 only
    { $limit: 5 },

    // Step 6: clean up output
    {
      $project: {
        title: 1,
        field: 1,
        country: 1,
        city: 1,
        universityName: 1,
        degreeLevel: 1,
        tuitionFeeUsd: 1,
        intakes: 1,
        minimumIelts: 1,
        scholarshipAvailable: 1,
        matchScore: 1,
        reasons: 1,
      },
    },
  ]);

  return {
    data: {
      student: {
        id: student._id,
        fullName: student.fullName,
        targetCountries: student.targetCountries,
        interestedFields: student.interestedFields,
      },
      recommendations,
    },
    meta: {
      total: recommendations.length,
    },
  };
}

module.exports = { buildProgramRecommendations };
