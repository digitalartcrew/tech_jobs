//This example of demonstrates how you can send a function which takes a request and response argument to 
//render employers.jade which is passed res.render which looks inside of the views directory
//for the file and passed and object which includes the title of page to be rendered.
//exports is node module object
exports.employers = function(req, res) {
  res.render('api/linkedin', {
    title: 'Employer'
  });
};