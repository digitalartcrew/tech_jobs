var secrets = require('../config/secrets');
var querystring = require('querystring');
var validator = require('validator');
var async = require('async');

var request = require('request');

var Github = require('github-api');

var Linkedin = require('node-linkedin')(secrets.linkedin.clientID, secrets.linkedin.clientSecret, secrets.linkedin.callbackURL);

var _ = require('lodash');



exports.getGithub = function(req, res, next) {
  var token = _.find(req.user.tokens, { kind: 'github' });

};


exports.getLinkedin = function(req, res, next) {
  var token = _.find(req.user.tokens, { kind: 'linkedin' });
  var linkedin = Linkedin.init(token.accessToken);

  linkedin.companies_search.name('facebook', 1, function(err, company) {
      console.log("WE MESSED UP!", err);
      
      var companyData = {};
      companyData.name = company.companies.values[0].name;
      companyData.desc = company.companies.values[0].description;
      companyData.industry = company.companies.values[0].industries.values[0].name;
      companyData.city = company.companies.values[0].locations.values[0].address.city;
      companyData.websiteUrl = company.companies.values[0].websiteUrl;

      // if you want to send some data back you can attach it to res.locals
      res.locals.company = companyData;
      console.log("HERE'S WHAT WERE SENDING BACK!", companyData);
      next();
      res.render('api/linkedin');
  });

};

