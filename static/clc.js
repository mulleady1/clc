
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
                $forwardEl.on('click', function() {
                    $el.show();
                    $previousEl.hide();
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
                        $forwardEl.on('click', function() {
                            $el.show();
                            $previousEl.hide();
                        });
                    });
                });
            });

        });
    });

});

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
