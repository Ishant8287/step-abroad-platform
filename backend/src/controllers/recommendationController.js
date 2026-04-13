const asyncHandler = require("../utils/asyncHandler");
const {
  buildProgramRecommendations,
} = require("../services/recommendationService");
const cacheService = require("../services/cacheService");

const getRecommendations = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const cacheKey = `recommendations-${studentId}`;
  const cached = cacheService.get(cacheKey);

  if (cached) {
    return res.json({
      success: true,
      ...cached,
      meta: { ...cached.meta, cache: "hit" },
    });
  }

  const payload = await buildProgramRecommendations(studentId);
  cacheService.set(cacheKey, payload);

  res.json({
    success: true,
    ...payload,
    meta: { ...payload.meta, cache: "miss" },
  });
});

module.exports = { getRecommendations };
