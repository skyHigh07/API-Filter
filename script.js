function productData(url) {
    const app = document.getElementById('root');
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
        history.pushState({ state: 1, rand: Math.random() }, '', `?${url.split('?')[1]}`);
        // Begin accessing JSON data here
        app.innerHTML = '';
        var data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {

            data.forEach(movie => {
                var html = `<div class="card">${movie.links.mission_patch ? `<img src="${movie.links.mission_patch}">` : ''}<h4><a href="${movie.links.article_link}">${movie.mission_name}<span>${movie.flight_number}</span></a></h4> <div class="content item"> <h6>Mission Ids:</h6> <ul> <li>${movie.mission_id}</li> </ul> </div> <div class="content item"> <h6>Launch Year: <span>${movie.launch_year}</span></h6> </div> <div class="content item"> <h6>Successfull Launch: <span>${movie.launch_success}</span></h6> </div> <div class="content item"> <h6>Successfull Landing: <span>${movie.launch_landing}</span></h6> </div> </div>`;
                $(app).append(html);
            });
        } else {
            $(app).append('Not Found');
        }
    }

    request.send();
}

$(window).load(function() {
    var url = 'https://api.spacexdata.com/v3/launches?limit=100';
    if (location.search) {
        var queries = parseQueryString(location.search.split('?')[1]);
        if (queries.launch_year) {
            url = `${url}&launch_year=${queries.launch_year}`
        } else if (queries.launch_success) {
            url = `${url}&launch_success=${queries.launch_success}`
        } else if (queries.land_success) {
            url = `${url}&land_success=${queries.land_success}`
        }
        var value1 = location.search.split('?limit=100&')[1];
        $('.filter').each(function() {
            var value2 = $(this).attr('href');
            var lastSegment = value2;
            if (lastSegment == value1) {
                $(this).addClass('active');
            }
        });
    }
    productData(url);
});

$('.filter').on('click', function(e) {
    e.preventDefault();
    $(this).toggleClass('active').closest('.left-column').find('a').not($(this)).removeClass('active');
    var s1 = 'https://api.spacexdata.com/v3/launches?limit=100';
    var url = ''
    if ($(this).hasClass('active')) {
        var s1 = $(this).attr('href');
        url = `https://api.spacexdata.com/v3/launches?limit=100&${s1}`;
    } else {
        url = s1;
    }
    productData(url);
});

var parseQueryString = function(queryString) {
    var params = {},
        queries, temp, i, l;
    // Split into key/value pairs
    queries = queryString.split("&");
    // Convert the array of strings into an object
    for (i = 0, l = queries.length; i < l; i++) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
    return params;
};