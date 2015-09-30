/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
};

exports.developers = function(req, res) {
  res.render('developers', {
    title: 'Developer'
  });
};

exports.employers = function(req, res) {
  res.render('employers', {
    title: 'Employer'
  });
};