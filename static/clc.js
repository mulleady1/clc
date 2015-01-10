
$(document).ready(function() {
    $('button#citysearch').on('click', function(event) {
        var data = $('#form').serialize(),
            url  = '/citysearch?' + data,
            $el  = $('#city-search-results'),
            $containerEl = $('#form-container');
        event.preventDefault();
        $.get(url).then(function(results) {
            $el.html(results);
            $('form.jobsearch input[type=checkbox]').each(function() {
                $(this).on('change', storeCheckedPreference);
                var city = $(this).val();
                if (localStorage.getItem(city) != undefined) {
                    $(this).prop('checked', true);
                }
            });
            $el.show();
            $containerEl.hide();
            $('a.back-1').on('click', function() {
                $el.hide();
                $containerEl.show();
            });
            $('#checkall').on('change', function() {
                checkAll($(this).is(':checked'));
            });

            $('button#jobsearch').on('click', function(event) {
                var data = $('form.jobsearch').serialize(),
                    url  = '/jobsearch?' + data,
                    $el  = $('#job-search-results'),
                    $previousEl = $('#city-search-results');
                event.preventDefault();
                $.get(url).then(function(results) {
                    $el.html(results);
                    $el.show();
                    $previousEl.hide();
                    $('a.back-2').on('click', function() {
                        $el.hide();
                        $previousEl.show();
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
