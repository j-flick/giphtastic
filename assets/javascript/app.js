// PSEUDO-CODE TO DO:
// ====================================================================================
// Add form that gets user input and adds a new button dynamically to the topics array.
// Create function that takes each topic in the array (including user input) and reloads the buttons on the page.

// Create array of tv shows.
var topics = ["the office", "silicon valley", "vice principals", "workaholics", "mr. robot", "the newsroom", "halt and catch fire", "people of earth"];

var offset = 0; // Initialize image results returned to 0. This will be changed later to return different sets of images.

// Initialize showName to null.
var showName = null;

// Create a button for each tv show in the topics array.
function createButtons() {
	// Empty the buttons display view so there are no duplicates as new ones are added via user input.
	$("#buttons-display").empty();
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

// Function to call Giphy API displaying 10 non-animated gifs.
function callAPI(show) {

		// Setup URL to query the API with the tv show name and limit records returned to 10.
		var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + show + "&api_key=dc6zaTOxFJmzC&limit=10&offset=" + offset;
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
				var giphDiv = $("<div class='giphy col-sm-6 col-md-4'>");
				// Store the rating of the image in a variable.
				var rating = giphyDataArray[i].rating;
				// Create an element to display the rating on the page.
				var p = $("<p class='p-rating'>").html("Rating: <span class='rating'>" + rating.toUpperCase() + "</span>");
				// Dynamically create IMG element to display the giphy image.
				var tvGiph = $("<img>");
				// Add a src attribute to the img with a value of the fixed width still from the returned giphy array.
				tvGiph.attr("src", giphyDataArray[i].images.fixed_width_still.url);
				// Add an attribute to hold a still data-state for the gif.
				tvGiph.attr("still", giphyDataArray[i].images.fixed_width_still.url);
				// Add an attribute to hold an animated data-state for the gif.
				tvGiph.attr("animated", giphyDataArray[i].images.fixed_width.url);
				tvGiph.addClass("giphImage");
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
		// Show Previous and Next buttons below display of 10 gifs to continue displaying new (or previous) results returned from the API.
		$("#prevNext-buttons").show();
}

// When the Next button is clicked...
$(".next").on("click", function() {
	// If showName is true add 10 to the offset value to use in the query to get the next 10 results from the API.
	if (showName) {
		offset += 10;
		callAPI(showName);
	}
});

// When the Previous button is clicked...
$(".prev").on("click", function() {
	// If showName is true...
	if (showName) {
		// Set the offset value to 0 if we are already at the beginning of the returned results.
		if (offset - 10 < 0) {
			offset = 0;
		}
		// Otherwise, subtract 10 from the offset value used in the queryURL to go back and display the previous 10 gifs returned from the API.
		else {
			offset -= 10
		}

		callAPI(showName);
	}
});

$(".tvShow").on("click", function() {
	// Store the show-name attribute in a variable to use in the API query.
	showName = $(this).attr("show-name");
	callAPI(showName);
});

// When Search button is clicked, perform this function...
$("#add-giphy").on("click", function(event) {
	// Prevent form from submitting on click.
	event.preventDefault();
	// Store user input in a variable.
	var giph = $("#giphy-input").val().trim();
	// Add user input to topics array to be displayed as a new button.
	topics.push(giph);
	// Display the new set of buttons.
	createButtons();
});

// Document on click function to listen for dynamically added user input.
$(document).on("click", ".tvShow", function() {
	// Store the show-name attribute in a variable to use in the API query.
	showName = $(this).attr("show-name");
	callAPI(showName);
});