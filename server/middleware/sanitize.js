const xss = require("xss");
const mongoSanitize = require("mongo-sanitize");

module.exports = (req, res, next) => {
 
  req.body = mongoSanitize(req.body);
  req.query = mongoSanitize(req.query);
  req.params = mongoSanitize(req.params);

 
  const sanitizeObject = (obj) => {
    Object.keys(obj || {}).forEach((key) => {
      if (typeof obj[key] === "string") {
        obj[key] = xss(obj[key].trim());
      }
    });
  };

  sanitizeObject(req.body);
  sanitizeObject(req.query);
  sanitizeObject(req.params);

  next();
};
