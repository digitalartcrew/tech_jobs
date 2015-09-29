var secrets = require('../config/secrets');
var querystring = require('querystring');
var validator = require('validator');
var async = require('async');

var request = require('request');

var Github = require('github-api');

var Linkedin = require('node-linkedin')(secrets.linkedin.clientID, secrets.linkedin.clientSecret, secrets.linkedin.callbackURL);

var _ = require('lodash');

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = function(req, res) {
  res.render('api/index', {
    title: 'API Examples'
  });
};



/**
 * GET /api/github
 * GitHub API Example.
 */
exports.getGithub = function(req, res, next) {
  var token = _.find(req.user.tokens, { kind: 'github' });
  var github = new Github({ token: token.accessToken });
  var repo = github.getRepo('sahat', 'requirejs-library');
  repo.show(function(err, repo) {
    if (err) return next(err);
    res.render('api/github', {
      title: 'GitHub API',
      repo: repo
    });
  });

};



/**
 * GET /api/linkedin
 * LinkedIn API example.
 */
exports.getLinkedin = function(req, res, next) {
  var token = _.find(req.user.tokens, { kind: 'linkedin' });
  var linkedin = Linkedin.init(token.accessToken);
  linkedin.people.me(function(err, $in) {
    if (err) return next(err);
    res.render('api/linkedin', {
      title: 'LinkedIn API',
      profile: $in
    });
  });


/**
 * GET /api/instagram
 * Instagram API example.
 */

};