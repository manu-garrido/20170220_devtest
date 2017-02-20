	jQuery(document).ready(function () {

		$("#pools>div").click(function () {
			$("#pools>div.active").removeClass("active");
			$(this).addClass("active");
			loadPool($(this).attr("data-id"));
			$("#pool").addClass("on");
		});

		function loadPool(id) {
			var poolAPI = "http://colossusdevtest.herokuapp.com/api/pools/" + id + ".json";
			$.ajax({
				type: "GET",
				url: poolAPI,
				dataType: "json",
				success: function (data) {
					console.log("OK");
					populatePool("OK", data);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					if (textStatus == "parsererror") {
						// We do a secondary call if JSON"s syntaxis is wrong on the server side
						// Retrieve data as "text" and ignore everything before the first left hand side bracket or curly bracket
						$.ajax({
							type: "GET",
							url: poolAPI,
							dataType: "text",
							success: function (data) {
								console.log("OK (2)");
								var i = data.indexOf("[");
								if (data.indexOf("{") < i) {
									i = data.indexOf("{");
								}
								populatePool("OK", $.parseJSON(data.substring(i)));
								console.log($.parseJSON(data.substring(i)));
							},
							error: function (jqXHR, textStatus, errorThrown) {
								populatePool("KO");
								console.log("KO");
								console.log(jqXHR);
								console.log(textStatus);
								console.log(errorThrown);
							}
						});
					} else {
						populatePool("KO");
						console.log("KO");
						console.log(jqXHR);
						console.log(textStatus);
						console.log(errorThrown);
					}
				}
			});
		}

		function populatePool(status, data) {
			switch (status) {
			case "OK":
				var pool_html = "";
				$.each(data.legs, function (key, val1) {
					pool_html += "<div class='leg' data-leg-id='" + val1.id + "' data-sport-event-id='" + val1.sport_event.id + "'><div class='title'>" + val1.sport_event.name + "</div>";
					$.each(val1.selections, function (key, val2) {
						pool_html += "<div class='selection' data-id='" + val2.id + "'>" + val2.name + "</div>";
					});
					pool_html += "</div>";
				});
				$("#pool").html(pool_html);
				ajaxedNow();
				break;
			case "KO":
				$("#pool").html("Pool data feed unreacheable.");
				break;
			}
		}

		function ajaxedNow() {
			$.getScript("assets/js/ajaxed-functions-lvl2.js");
		}

	});