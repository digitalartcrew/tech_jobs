var secrets = require('../config/secrets');
var querystring = require('querystring');
var validator = require('validator');
var async = require('async');

var request = require('request');

var Github = require('github-api');

var Linkedin = require('node-linkedin')(secrets.linkedin.clientID, secrets.linkedin.clientSecret, secrets.linkedin.callbackURL);
// var Linkedin = require('node-linkedin')('api', 'secret', 'callback');

var _ = require('lodash');


exports.getApi = function(req, res) {
  res.render('api/index', {
    title: 'API Examples'
  });
};




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



exports.getLinkedin = function(req, res, next) {

  var linkedin = Linkedin.init('my_access_token');
  console.log(linkedin);

  linkedin.companies_search.name('facebook', 1, function(err, company) {
    console.log('err', err);
    console.log('company', company);
    name = company.companies.values[0].name;
    desc = company.companies.values[0].description;
    industry = company.companies.values[0].industries.values[0].name;
    city = company.companies.values[0].locations.values[0].address.city;
    websiteUrl = company.companies.values[0].websiteUrl;
      if (err) return next(err);
    res.render('api/linkedin');
    console.log(company);
      

    });


};