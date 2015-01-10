
$(document).ready(function() {
    $('button#citysearch').on('click', function(event) {
        var data = $('#form').serialize(),
            url  = '/citysearch?' + data,
            $el  = $('#city-search-results');
        event.preventDefault();
        $el.html('Loading...');
        $.get(url).then(function(results) {
            $el.html(results);
            $el.find('input[type=checkbox]').each(function() {
                $(this).on('change', f);
                var city = $(this).val();
                if (localStorage.getItem(city) != undefined) {
                    $(this).prop('checked', false);
                }
            });
            $el.show();
        });
    });

    $('button#jobsearch').on('click', function(event) {
        var data = $('#form').serialize(),
            url  = '/search?' + data,
            $el  = $('#job-search-results');
        event.preventDefault();
        $el.html('Loading...');
        $.get(url).then(function(results) {
            $el.html(results);
            $el.show();
        });
    });

});

function f() {
    var city = $(this).val();
    if ($(this).is(':checked')) {
        localStorage.removeItem(city);
    } else {
        localStorage.setItem(city, true);
    }
}

