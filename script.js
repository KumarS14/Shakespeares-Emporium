$(document).ready(function() {
    $('#about-card').on('click', function() {
        window.location.href = 'about-page.html'; 
    });

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
    $('#video-container').on('click', function(){
        var iframe = $('<iframe>', {
            src: 'https://www.youtube.com/embed/geev441vbMI?autoplay=1',
            class: 'video-iframe',
            allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
            allowfullscreen: true
        });
        $(this).replaceWith(iframe);
    });
});
