
//For this section the export module was used over the module.exports so that so the functions can be called independently
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
   // var techCompany = $("#techCompany").val();



  linkedin.companies_search.name('facebook', 1, function(err, company) {
    console.log("It's Gucci!");
  console.log(company);
  
      
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
      console.log('I see you function!');
      // res.render('api/linkedin');
  });

};

