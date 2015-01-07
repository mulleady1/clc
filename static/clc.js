
$(document).ready(function() {
    $('#form button').on('click', function(event) {
        event.preventDefault();
        $('#results').html('Loading...');
        var data = $('#form').serialize();
        $.get('/search?' + data)
        .then(function(results) {
            $('#results').html(results);
        });
        return false;
    });
});

