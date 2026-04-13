const asyncHandler = require("../utils/asyncHandler");

const getHealth = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      service: "study-abroad-platform-api",
      timestamp: new Date().toISOString(),
      status: "ok",
    },
  });
});

module.exports = {
  getHealth,
};
