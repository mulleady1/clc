var clc = (function() {

    var $containerEl1 = $('#city-search-form'),
        $containerEl2 = $('#city-search-results'),
        $containerEl3 = $('#job-search-results'),
        $forwardEl    = $('a.forward-1'),
        $buttonEl     = $('button#jobsearch');

    function citySearch(event) {
        var data      = $('form.citysearch').serialize(),
            url       = '/citysearch?' + data;
        event.preventDefault();
        $buttonEl.html('Loading...');
        $buttonEl.prop('disabled', true);
        history.pushState({ state: 'citysearch' }, '', '#cities');
        loadCities(url);
    }

    function jobSearch(event) {
        var data = $('form.jobsearch').serialize();
        event.preventDefault();
        history.pushState({ state: 'jobsearch' }, '', '#jobs');
        $containerEl2.hide();
        $containerEl3.show();
        $containerEl3.children(':not(.nav)').remove();

        $('input[type=checkbox][name=city]:checked').each(function() {
            var city = $(this).val(),
                url  = '/jobsearch?' + data + '&city=' + city,
                html = $('#template-loading').html().replace(/{city}/g, city);
            $containerEl3.append(html);
            loadJobsByCity(url);
        });
        $('a.back-2').on('click', function() {
            var $forwardEl = $('a.forward-2');
            $containerEl3.hide();
            $containerEl2.show();
            $forwardEl.show();
            history.back();
            $forwardEl.on('click', function() {
                $containerEl3.show();
                $containerEl2.hide();
                history.forward();
            });
        });
    }

    function loadCities(url) {
        $.get(url).then(function(results) {
            $containerEl2.html(results);
            $containerEl2.show();
            $containerEl1.hide();
            $buttonEl.html('Search for cities');
            $buttonEl.prop('disabled', false);

            $('input[type=checkbox][name=city]').each(function() {
                $(this).on('change', clc.storeCheckedPreference);
                var city = $(this).val();
                if (localStorage.getItem(city) != undefined) {
                    $(this).prop('checked', true);
                }
            });
            $('a.back-1').on('click', function() {
                $containerEl2.hide();
                $containerEl1.show();
                $forwardEl.show();
                history.back();
                $forwardEl.on('click', function() {
                    $containerEl2.show();
                    $containerEl1.hide();
                    history.forward();
                });
            });
            $('#checkall').on('change', clc.checkAll);
            $('button#jobsearch').on('click', clc.jobSearch);
        });
    }

    function loadJobsByCity(url) {
        $.get(url).then(function(results) {
            var city = results.city;
            var html = results.html;
            $('#' + city + '-container ul').html(html);
        }, function() {
            var city = this.url.substring(this.url.indexOf('city=') + 5);
            $('#' + city + '-container ul').html($('#template-loading-failed').html().replace(/{city}/g, city));
            $('#try-again-' + city).on('click', function() {
                loadJobsByCity(url);
            });
        });
    }

    function storeCheckedPreference() {
        var city = $(this).val();
        if ($(this).is(':checked')) {
            localStorage.setItem(city, true);
        } else {
            localStorage.removeItem(city);
        }
    }

    function checkAll() {
        var checked = $(this).is(':checked');
        $('input.city[type=checkbox]').each(function() {
            var currChecked = $(this).is(':checked');
            if (checked != currChecked) {
                $(this).click();
            }
        });
    }

    return {
        citySearch: citySearch,
        jobSearch: jobSearch,
        storeCheckedPreference: storeCheckedPreference,
        checkAll: checkAll,
        loadJobsByCity: loadJobsByCity
    };

}());

$(document).ready(function() {
    $('button#citysearch').on('click', clc.citySearch);
});

