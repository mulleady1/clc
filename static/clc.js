
$(document).ready(function() {
    $('#form button').on('click', function(event) {
        var data = $('#form').serialize(),
            url  = '/search?' + data,
            $el  = $('#results');
        event.preventDefault();
        $el.html('Loading...');
        $.get(url).then(function(results) {
            $el.html(results);
        });
    });
});

