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
// Fetches Shakespeare's works from the Gutendex API using an AJAX request
const fetchShakespeareWorks = () => {
    $.get('https://gutendex.com/books?search=shakespeare') // Sends GET request to API
        .done(data => {
            filteredWorks = data.results; // Store the fetched works in the global array
            generateChart(filteredWorks); // Generate the chart after fetching the data
            populateTable(filteredWorks); // Populate the table
        })
        .fail(error => console.error('Error fetching data:', error)); // Log an error if the API call fails
};
const populateTable = (works) => {
    const tableBody = $('#booksTable tbody');
    tableBody.empty();
  
    works.forEach((work, index) => {
      const image = work.formats['image/jpeg'] 
        ? `<img src="${work.formats['image/jpeg']}" alt="Cover Image" style="width:100px; height:auto;">` 
        : 'No Image';
  
      const row = `
        <tr>
          <td>${image} ${work.title}</td>
          <td>${work.authors.map(author => author.name).join(', ')}</td>
          <td>${work.subjects.join(', ')}</td>
          <td>${work.download_count}</td>
          <td>
            <button onclick="openModal(${index})">View</button>
          </td>
        </tr>
      `;
      tableBody.append(row);
    });
  
    // Initialize DataTable with Search Feature
    $('#booksTable').DataTable({
      destroy: true // Allow reinitialization
    });
  };


// Function to search for a work based on user input
const searchWork = () => {
    const searchValue = $('#search-bar').val().toLowerCase(); // Retrieves the user's input from the search bar and converts it to lowercase for case-insensitive matching
    const result = filteredWorks.find(work => work.title.toLowerCase().includes(searchValue)); // Searches through the list of works to find a title that includes the user's input
    result ? openModal(result) : alert('No results found for your search.'); // If a match is found it opens the modal with details  otherwise it shows an alert to the user
};

// Function to display details of a selected work in a modal
const openModal = (index) => {
    const work = filteredWorks[index];
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



const generateChart = (works) => {
    // Attempt to locate the canvas element by its ID
    const chartEl = document.getElementById('downloads-chart');
  
    // If the canvas is not found, skip rendering to avoid errors
    if (!chartEl) {
      return;
    }
  
    // Acquire the 2D drawing context from the canvas
    const ctx = chartEl.getContext('2d');
  
    // Prepare data for the chart, using titles as labels and download counts as dataset values
    const chartData = {
      labels: works.map(work => work.title),
      datasets: [
        {
          label: 'Downloads',
          data: works.map(work => work.download_count),
        },
      ],
    };
  
    // Instantiate a new bar chart with the data and configurations
    new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        // Make the chart responsive to various screen sizes
        responsive: true,
        // Allow the chart to expand without retaining a strict aspect ratio
        maintainAspectRatio: false,
        // Set plugin-specific configurations, in this case controlling the legend display
        plugins: {
          legend: { display: true },
        },
      },
    });
  };


  
  //  Fetch the Shakespeare works when the page loads
  fetchShakespeareWorks(); // Initializes the fetching of data from the API on page load



