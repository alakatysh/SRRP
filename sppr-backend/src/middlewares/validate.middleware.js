export const validateBody = (validateFn) => {
  return (req, res, next) => {
    const isValid = validateFn(req.body);
    if (!isValid) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validateFn.errors,
      });
    }
    next();
  };
};
