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

// fetches Shakespeare's works from the Gutendex API using ajax request as its alot easier and simpler to do opposed to using
//normal JS
const fetchShakespeareWorks = () => {
    $.get('https://gutendex.com/books?search=shakespeare') //Sends get request to api
        .done(data => filteredWorks = data.results)
        .fail(error => console.error('Error fetching data:', error));
};

// Function to search for a work based on user input
const searchWork = () => {
    const searchValue = $('#search-bar').val().toLowerCase(); // Retrieves the user's input from the search bar and converts it to lowercase for case-insensitive matching
    const result = filteredWorks.find(work => work.title.toLowerCase().includes(searchValue)); // Searches through the list of works to find a title that includes the user's input
    result ? openModal(result) : alert('No results found for your search.'); // If a match is found it opens the modal with details  otherwise it shows an alert to the user
};

// Function to display details of a selected work in a modal
const openModal = (work) => {
    const modalDetails = $('#modalDetails'); // Selects the modal's content container to dynamically populate it with details
    const image = work.formats['image/jpeg'] // Checks if a JPEG image format is available
        ? `<img src="${work.formats['image/jpeg']}" alt="Cover Image" style="width:300px; height:auto; margin-bottom:20px;">` // If available, creates an image element with styling
        : 'No Image Available'; // Provides a message if no image is found
    const languages = work.languages.join(', ') // joins list of languages spaced with a comma
    const bookshelves = work.bookshelves.join(', '); // Joins bookshelf categories
    // Create a string of clickable links for available formats
const formats = Object.entries(work.formats) // Converts the formats object into an array of [key, value] pairs
.map(([format, url]) => `<a href="${url}" target="_blank">${format}</a>`) // Maps each format and URL into an anchor tag with a clickable link
.join(', '); // Joins all the anchor tags into a single string, separated by commas


    // Populates the modal with the work's details including image, title, author, subjects, and other information
    modalDetails.html(`
        ${image}
        <h3>${work.title}</h3> <!-- Displays the title of the work -->
        <p><strong>Author:</strong> ${work.authors.map(author => author.name).join(', ')}</p> <!-- Lists the authors -->
        <p><strong>Subjects:</strong> ${work.subjects.join(', ')}</p> <!-- Lists the subjects -->
        <p><strong>Language(s):</strong> ${languages}</p> <!-- Lists the languages in uppercase -->
        <p><strong>Bookshelves:</strong> ${bookshelves}</p> <!-- Lists bookshelf categories or shows 'N/A' -->
        <p><strong>Download Count:</strong> ${work.download_count}</p> <!-- Displays the number of downloads -->
        <p><strong>Available Formats:</strong> ${formats}</p> <!-- Lists all available formats as links -->
        <a href="${work.formats['text/html']}" target="_blank" style="display:block; margin-top:10px;">Read Online</a> <!-- Adds a link to read the work online -->
    `);
    $('#modal').show(); // Displays the modal with the populated content
};

// Event listeners for user interactions
$('#query-submit').on('click', searchWork); // Listens for the search button click and triggers the search function
$('#closeModal').on('click', () => $('#modal').hide()); // Listens for the close button click and hides the modal

// Fetch the Shakespeare works when the page loads
fetchShakespeareWorks(); // Initializes the fetching of data from the API on page load





