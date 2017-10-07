// PSEUDO-CODE TO DO:
// ====================================================================================
// Add form that gets user input and adds a new button dynamically to the topics array.
// Create function that takes each topic in the array (including user input) and reloads the buttons on the page.

// Create array of tv shows.
var topics = ["the office", "silicon valley", "vice principals", "workaholics", "mr. robot", "the newsroom", "halt and catch fire", "people of earth"];

// Variables to hold animated and still states of gifs.
// var animated;
// var still;
var stillArray = [];

// Create a button for each tv show in the topics array.
function createButtons() {
	// Loop thru the array of tv shows.
	for (var i = 0; i < topics.length; i++) {
		// Dynamically generate a button.
		var button = $("<button>");
		// Add class tvShow to the button.
		button.addClass("tvShow btn btn-primary");
		// Add a data attribute to access the name of the tv show from the array.
		button.attr("show-name", topics[i]);
		// Display the show name on the button.
		button.html(topics[i]);
		// Add the button to the buttons display div.
		$("#buttons-display").append(button);

	}
}

createButtons();

// When button is clicked, display 10 non-animated gifs from Giphy API.
$("button").on("click", function() {
	// Store the show-name attribute in a variable to use in the API query.
	var showName = $(this).attr("show-name");
	// Setup URL to query the API with the tv show name and limit records returned to 10.
	var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + showName + "&api_key=dc6zaTOxFJmzC&limit=10";
	// Empty the giph-display div to fill with new content when a button is clicked.
	$("#giph-display").empty();

	$.ajax({ url: queryURL, method: "GET" })
		.done(function(response) {
			// Store the returned array in a variable for easier access in the for loop.
			var giphyDataArray = response.data;
			// Loop thru the returned array and display on the page.
			for (var i =0; i < giphyDataArray.length; i++) {
				// console.log(giphyDataArray[i]);
				// Create a div to hold the returned giphy image.
				var giphDiv = $("<div class='giphy'>");
				// Store the rating of the image in a variable.
				var rating = giphyDataArray[i].rating;
				// Create an element to display the rating on the page.
				var p = $("<p>").html("Rating: " + rating.toUpperCase());
				// Dynamically create IMG element to display the giphy image.
				var tvGiph = $("<img>");
				// Add a src attribute to the img with a value of the fixed width still from the returned giphy array.
				tvGiph.attr("src", giphyDataArray[i].images.fixed_width_still.url);
				// Add an attribute to hold a still data-state for the gif.
				tvGiph.attr("still", giphyDataArray[i].images.fixed_width_still.url);
				// Add an attribute to hold an animated data-state for the gif.
				tvGiph.attr("animated", giphyDataArray[i].images.fixed_width.url);
				// Append the img and paragraph with the image rating to the giphDiv.
				giphDiv.append(tvGiph, p);
				// Add the newly created giphDiv to display within the giph-display div on the page.
				$("#giph-display").append(giphDiv);

				tvGiph.on("click", function() {
					// If the src attribute is equal to the still attribute, change it to animated.
					if ($(this).attr("src") === $(this).attr("still")) {
						$(this).attr("src", $(this).attr("animated"));
					}
					else {
						$(this).attr("src", $(this).attr("still"));
					}
				});
			}
		});
});

