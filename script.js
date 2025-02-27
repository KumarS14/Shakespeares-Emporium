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
        window.location.href = 'index.html';
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
    // creates an iframe element for youtube playback
    var iframe = $('<iframe>', {
        src: 'https://www.youtube.com/embed/geev441vbMI?autoplay=1', // URL for the video, autoplay starts playback immediately
        class: 'video-iframe', 
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture', // Permissions for video playback
        allowfullscreen: true // allows for full screen mode
    });

    // video container is replaced with the newly created iframe
    $(this).replaceWith(iframe);
});

// empty array to store the filtered list of works
let filteredWorks = [];

// fetches Shakespeare's works from the Gutendex API using ajax request as its alot easier and simpler to do opposed to using
//normal JS
const fetchShakespeareWorks = () => {
    $.get('https://gutendex.com/books?search=shakespeare') // Sends GET request to API
        .done(data => {
            filteredWorks = data.results; // Stores the fetched works in the global array
            generateChart(filteredWorks); // Generates the chart after fetching the data
            populateTable(filteredWorks); // Populates the table
        })
        .fail(error => console.error('Error fetching data:', error)); // Log an error if the API call fails
};
// Function to populate the table with a list of Shakespeare's works
const populateTable = (works) => {
  // selects body element and clears any existing rows
  const tableBody = $('#booksTable tbody');
  tableBody.empty();

  // Iterates over the list of works and create a table row for each work
  works.forEach((work, index) => {
      // Checks if an image is available; if not it displays No Image
      const image = work.formats['image/jpeg'] 
          ? `<img src="${work.formats['image/jpeg']}" alt="Cover Image" style="width:100px; height:auto;">` 
          : 'No Image';

      // Construct a table row with work details
      const row = `
          <tr>
              <td>${image} ${work.title}</td> <!-- Display image and title in the first column -->
              <td>${work.authors.map(author => author.name).join(', ')}</td> <!-- Authors listed in the second column -->
              <td>${work.subjects.join(', ')}</td> <!-- Subjects listed in the third column -->
              <td>${work.download_count}</td> <!-- Download count in the fourth column -->
              <td>
                  <button onclick="openModal(${index})">View</button> <!-- Button to open modal with work details -->
              </td>
          </tr>
      `;
      tableBody.append(row); // Appends row to the table body
  });

  // Initializes the DataTable plugin with search functionality
  $('#booksTable').DataTable({
      destroy: true // Allows for reinitialization of data table
  });
};



// Function to search for a work based on user input
const searchWork = () => {
    // Captures the user’s query and converts it to lowercase for case matching
    const searchValue = $('#search-bar').val().toLowerCase();
    
    // Locates the index of a work whose title contains the user’s query
    const index = filteredWorks.findIndex(work =>
      work.title.toLowerCase().includes(searchValue)
    );
  
    // If no match is found it alerts the user  otherwise it opens the modal at the matching index
    if (index === -1) {
      alert('No results found');
    } else {
      openModal(index);
    }
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
    // locates the canvas element by its ID
    const chartEl = document.getElementById('downloads-chart');
  
    // If the canvas is not found, skip rendering to avoid errors
    if (!chartEl) {
      return;
    }
  
    // 2D drawing context from the canvas
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
        // Makes the chart responsive to various screen sizes
        responsive: true,
        // Allows the chart to expand without retaining a strict aspect ratio
        maintainAspectRatio: false,
        // Sets plugin specific configurations  in this case controlling the legend display
        plugins: {
          legend: { display: true },
        },
      },
    });
  };


  
  //  Fetch the Shakespeare works when the page loads
  fetchShakespeareWorks(); // Initializes the fetching of data from the API on page load



