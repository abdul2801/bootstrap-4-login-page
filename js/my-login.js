$(function() {
	
	'use strict';


	$(".my-login-validation").submit(function(E) {
		var form = $(this);
		E.preventDefault();

		
		// get form data as json
		var data = form.serializeArray().reduce(function(obj, item) {
			obj[item.name] = item.value;
			return obj;
		}, {});

		fetch(apiAdminUrl + "/api/admin/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		}).then(response => {
			if (response.ok) {
				return response.json();
			} else {
				alert("Invalid username or password");
				return Promise.reject(response);
			}
		  })
		  .then(data => {
			console.log(data);
			localStorage.setItem("token", data.accessToken);
			window.location.href = "announcements.html";
		  })

		  .catch(err => {
			alert("Something went wrong. Please try again.");
		  });


		});
		
		





	});


