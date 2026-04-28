const { isCelebrateError } = require('celebrate');

const errorHandler = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    const errorBody = err.details.get('body')
      || err.details.get('params')
      || err.details.get('query');
    return res.status(400).json({ message: errorBody.message });
  }

  const { statusCode = 500, message } = err;
  return res.status(statusCode).json({
    message: statusCode === 500 ? 'An error has occurred on the server' : message,
  });
};

module.exports = errorHandler;
