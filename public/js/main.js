$(document).ready(function() {

	     function getSalaryData(){
        $.ajax({
        method: "GET",
        url: "https://developer.adzuna.com/docs/search",
        data: {
        app_id: "94046c1c",
        appkey: "d413eb920b77eac46456634889d9a4f5",
        },
        dataType: "jsonp",
        }).done(function(response){
        	data = response; 
        	console.log(response);
         	
      //Do This here
  });
}

});