jQuery(document).ready(function () {

	// Load Pools

	var poolsAPI = "http://colossusdevtest.herokuapp.com/api/pools.json";

	$.ajax({
		type: "GET",
		url: poolsAPI,
		dataType: "json",
		success: function (data) {
			//			console.log("OK");
			populatePools("OK", data);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			if (textStatus == "parsererror") {
				// We do a secondary call if JSON"s syntaxis is wrong on the server side
				// Retrieve data as "text" and ignore everything before the first left hand side bracket or curly bracket
				$.ajax({
					type: "GET",
					url: poolsAPI,
					dataType: "text",
					success: function (data) {
						console.log("OK (2)");
						var i = data.indexOf("[");
						if (data.indexOf("{") < i) {
							i = data.indexOf("{");
						}
						populatePools("OK", $.parseJSON(data.substring(i)));
						//						console.log($.parseJSON(data.substring(i)));
					},
					error: function (jqXHR, textStatus, errorThrown) {
						populatePools("KO");
						//						console.log("KO");
						//						console.log(jqXHR);
						//						console.log(textStatus);
						//						console.log(errorThrown);
					}
				});
			} else {
				populatePools("KO");
				//				console.log("KO");
				//				console.log(jqXHR);
				//				console.log(textStatus);
				//				console.log(errorThrown);
			}
		}
	});

	function populatePools(status, data) {
		switch (status) {
		case "OK":
			var pools_html = "";
			$.each(data, function (key, val1) {
				$.each(val1.pools, function (key, val2) {
					pools_html += "<div data-id='" + val2.id + "'>" + val2.name + "</div>";
				});
			});
			$("#pools").html(pools_html);
			$("#pools").addClass("on");
			ajaxedNow();
			$("#pools>div:first-child").trigger("click");
			break;
		case "KO":
			$("#pools").html("Pools data feed unreacheable.");
			break;
		}
	}

	function ajaxedNow() {
		$.getScript("assets/js/ajaxed-functions.js");
	}

});