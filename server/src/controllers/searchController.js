const searchService = require("../services/searchService");

async function getSearchSuggestions(req, res, next) {
  try {
    const { q } = req.query;
    const suggestions = await searchService.getSearchSuggestions(q || "");
    res.json(suggestions);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSearchSuggestions,
};
