
function findNearbyCities() {
    var data = $('#form').serialize();
    $.get('/search?' + data)
    .then(function(results) {
        $('#results').html(results);
    });
    return false;
}

