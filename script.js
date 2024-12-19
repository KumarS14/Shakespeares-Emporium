$(document).ready(function() { // Functionality for the homepage where depending on what card they clicked a new widow is show
    $('#about-card').on('click', function() {
        window.location.href = 'about-page.html'; 
    });// redirects the user to a new page by updating the browsers current location.

    $('#search-card').on('click', function() {
        window.location.href = 'search-page.html';
    });

    $('#view-all-card').on('click', function() {
        window.location.href = 'view-all-page.html';
    });
    $('#Home-Button').on('click', function() {
        window.location.href = 'home-page.html';
    });
    $('#Search-Button').on('click', function() {
        window.location.href = 'search-page.html';
    });
    $('#View-All-Button').on('click', function() {
        window.location.href = 'view-all-page.html';
    });
});
    // When the video container is clicked the video container is replaced with an embedded YouTube iframe to watch the video
$('#video-container').on('click', function() {
    // Create an iframe element with the necessary attributes for YouTube playback
    var iframe = $('<iframe>', {
        src: 'https://www.youtube.com/embed/geev441vbMI?autoplay=1', // URL for the video, autoplay starts playback immediately
        class: 'video-iframe', // Apply a class for styling purposes
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture', // Permissions for video playback
        allowfullscreen: true // Allow full-screen mode
    });

    // video container is replaced with the newly created iframe
    $(this).replaceWith(iframe);
});

// empty array to store the filtered list of works
let filteredWorks = [];

// function serves tofFetch Shakespeare's works from the Gutendex API
const fetchShakespeareWorks = () => {
    // I used jQuery's AJAX method to make a GET request to the API as its alot easier and simpler than traditional JS
    $.ajax({
        url: 'https://gutendex.com/books?search=shakespeare', // API endpoint to search for works by Shakespeare
        method: 'GET', // HTTP method to fetch data
        success: function(data) { // Callback function for a successful API response
            filteredWorks = data.results; // Store the list of works in the `filteredWorks` array
        },
        error: function(error) { // Callback function to handle errors during the API request
            console.error('Error fetching data:', error); // Log the error to the console for debugging
        }
    });
};



