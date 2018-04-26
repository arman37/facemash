/**
 *
 * @author arman
 * @since 15/2/2016.
 *
 */
'use strict';

module.exports = (req, res, next) => {
  res.renderServerError = () => {
    this
      .status(500)
      .send('Oops! Internal server Error.');
  };
  res.renderClientError = () => {
    this.render('404');
  };
  next();
};