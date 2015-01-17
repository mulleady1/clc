var app = Sammy('body', function() {

    var $container1El = $('#form-container'),
        $container2El = $('#city-search-results'),
        $container3El = $('#job-search-results'),
        $buttonCitySearch = $('button#citysearch'),
        $buttonJobSearch = $('button#jobsearch'),

    this.get('#/', function() {
        $('.container').hide();
        $('#form-container').show();
        return false;
    });

    this.get('#/citysearch', function() {
        var data = $('form.citysearch').serialize(),
            url  = '/citysearch?' + data;
        $('button#citysearch').html('Loading...');
        $('button#citysearch').prop('disabled', true);
        $.get(url).then(function(results) {
            $('#city-search-results').html(results);
            $('.container').hide();
            $('#city-search-results').show();
            $('.forward-1').show();
            $('button#citysearch').html('Search for cities');
            $('button#citysearch').prop('disabled', false);

            $('form.jobsearch input[type=checkbox]').each(function() {
                $(this).on('change', storeCheckedPreference);
                var city = $(this).val();
                if (localStorage.getItem(city) != undefined) {
                    $(this).prop('checked', true);
                }
            });
        });
        return false;
    });

    this.get('#/jobsearch', function() {
        var data = $('form.jobsearch').serialize(),
            url  = '/jobsearch?' + data;
        $('button#jobsearch').prop('disabled', true);
        $('button#jobsearch').html('Loading...');
        $.get(url).then(function(results) {
            $('#job-search-results').html(results);
            $('.container').hide();
            $('#job-search-results').show();
            $('.forward-2').show();
            $('button#jobsearch').prop('disabled', false);
            $('button#jobsearch').html('Search for jobs');
        });
        return false;
    });
});
$(document).ready(function() {
    app.run('#/');
});

/*
$(document).ready(function() {
    $('button#citysearch').on('click', function(event) {
        var data = $('form.citysearch').serialize(),
            url  = '/citysearch?' + data,
            $el  = $('#city-search-results'),
            $previousEl = $('#form-container'),
            $buttonEl   = $(this);
        event.preventDefault();
        $buttonEl.html('Loading...');
        $buttonEl.prop('disabled', true);
        //history.pushState({ state: 'citysearch' }, '', url);
        $.get(url).then(function(results) {
            $el.html(results);
            $el.show();
            $previousEl.hide();
            $buttonEl.html('Search for cities');
            $buttonEl.prop('disabled', false);

            $('form.jobsearch input[type=checkbox]').each(function() {
                $(this).on('change', storeCheckedPreference);
                var city = $(this).val();
                if (localStorage.getItem(city) != undefined) {
                    $(this).prop('checked', true);
                }
            });
            $('a.back-1').on('click', function() {
                $el.hide();
                $previousEl.show();
                $forwardEl = $('a.forward-1');
                $forwardEl.show();
                //history.back();
                $forwardEl.on('click', function() {
                    $el.show();
                    $previousEl.hide();
                    //history.forward();
                });
            });
            $('#checkall').on('change', function() {
                checkAll($(this).is(':checked'));
            });
            $('button#jobsearch').on('click', function(event) {
                var data = $('form.jobsearch').serialize(),
                    url  = '/jobsearch?' + data,
                    $el  = $('#job-search-results'),
                    $previousEl = $('#city-search-results'),
                    $buttonEl   = $(this);
                event.preventDefault();
                $buttonEl.html('Loading...');
                $buttonEl.prop('disabled', true);
                //history.pushState({ state: 'jobsearch' }, '', url);
                $.get(url).then(function(results) {
                    $el.html(results);
                    $el.show();
                    $previousEl.hide();
                    $buttonEl.html('Search for jobs');
                    $buttonEl.prop('disabled', false);

                    $('a.back-2').on('click', function() {
                        $el.hide();
                        $previousEl.show();
                        $forwardEl = $('a.forward-2');
                        $forwardEl.show();
                        //history.back();
                        $forwardEl.on('click', function() {
                            $el.show();
                            $previousEl.hide();
                            //history.forward();
                        });
                    });
                });
            });
        });
    });
});
*/
function storeCheckedPreference() {
    var city = $(this).val();
    if ($(this).is(':checked')) {
        localStorage.setItem(city, true);
    } else {
        localStorage.removeItem(city);
    }
}

function checkAll(checked) {
    $('form.jobsearch input[type=checkbox]').each(function() {
        var currChecked = $(this).is(':checked');
        if (checked != currChecked) {
            $(this).click();
        }
    });
}

