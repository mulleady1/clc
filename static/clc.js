var clc = clc || {};

clc = (function() {

    var $containerEl1 = $('#city-search-form'),
        $containerEl2 = $('#city-search-results'),
        $containerEl3 = $('#job-search-results'),
        $buttonEl     = $('button#jobsearch'),
        $backEl1      = $('.container > .nav-back-1'),
        $backEl2      = $('.container > .nav-back-2'),
        $forwardEl1   = $('.container > .nav-forward-1'),
        $forwardEl2   = $('.container > .nav-forward-2'),
        isMobile      = false;

    function citySearch(event) {
        var data = $('form.citysearch').serialize(),
            url  = '/citysearch?' + data;
        event.preventDefault();
        localStorage.setItem('defaultcity', $('[name="defaultcity"]').val());
        location.hash = '#cities';
        loadCities(url);
    }

    function jobSearch(event) {
        var data = $('form.jobsearch').serialize();
        event.preventDefault();
        location.hash = '#jobs';
        $containerEl3.children(':not(.nav)').remove();

        $('input[type=checkbox][name=city]:checked').each(function() {
            var city = $(this).val(),
                url  = '/jobsearch?' + data + '&city=' + city,
                html = $('#template-loading').html().replace(/{city}/g, city);
            $containerEl3.append(html);
            loadJobsByCity(url);
        });
    }

    function loadCities(url) {
        $containerEl2.children(':not(.nav)').remove();
        $containerEl2.append('<div>Loading...</div>');
        $.get(url).then(function(results) {
            $containerEl2.children(':not(.nav)').remove();
            $containerEl2.append(results);

            $('input[type=checkbox][name=city]').each(function() {
                $(this).on('change', clc.storeCheckedPreference);
                var city = $(this).val();
                if (localStorage.getItem(city) != undefined) {
                    $(this).prop('checked', true);
                }
            });
            $('#checkall').on('change', clc.checkAll);
            $('button#jobsearch').on('click', clc.jobSearch);
            $('input[name="jobcode"]').autocomplete({
                source: clc.jobcodes 
            });
            $('.clear-x').off('click', clc.clearField);
            $('.clear-x').on('click', clc.clearField);
        }, function() {
            var city = $('input[name="defaultcity"]').val();
            $containerEl2.children(':not(.nav)').remove();
            $containerEl2.append('<div>No results for "' + city + '".</div>');
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

    function hashChange() {
        switch (location.hash) {
            case '#cities':
                if (clc.previousHash == '#jobs') {
                    animate($containerEl3, $containerEl2, false);
                } else {
                    animate($containerEl1, $containerEl2, true);
                }
                $backEl1.show();
                $backEl2.hide();
                $forwardEl1.hide();
                if (clc.showForwardEl2) {
                    $forwardEl2.show();
                }
                clc.showForwardEl1 = true;
                break;
            case '#jobs':
                animate($containerEl2, $containerEl3, true);
                $backEl1.hide();
                $backEl2.show();
                $forwardEl1.hide();
                $forwardEl2.hide();
                clc.showForwardEl2 = true;
                break;
            default:
                animate($containerEl2, $containerEl1, false);
                $backEl1.hide();
                $backEl2.hide();
                if (clc.showForwardEl1) {
                    $forwardEl1.show();
                }
                $forwardEl2.hide();
                break;
        }
        clc.previousHash = location.hash;
        document.body.scrollTop = 0;
    }

    function clearField(event) {
        var input = $(this).closest('div').find('input[type="text"]');
        input.val('');   
        input.focus();
    }

    function animate($el1, $el2, left) {
        $el1.hide();
        $el2.show();
        if (!isMobile) {
            return;
        }
        if (left) {
            $el1.css({ left: -screen.width });
            $el2.css({ left: screen.width });
            $el2.animate({ left: 0 });
        } else {
            $el1.css({ left: screen.width });
            $el2.css({ left: -screen.width });
            $el2.animate({ left: 0 });
        }
    }

    $.get('/autocomplete').then(function(results) {
        clc.cities = results.cities;
        clc.jobcodes = results.jobcodes;
        $('input[name="defaultcity"]').autocomplete({
            source: clc.cities
        });
    });

    if ($(window).width() < 1025) {
        isMobile    = true;
        $backEl1    = $('.header > .nav-back-1');
        $backEl2    = $('.header > .nav-back-2');
        $forwardEl1 = $('.header > .nav-forward-1');
        $forwardEl2 = $('.header > .nav-forward-2');
    }

    return {
        citySearch: citySearch,
        jobSearch: jobSearch,
        loadCities: loadCities,
        loadJobsByCity: loadJobsByCity,
        storeCheckedPreference: storeCheckedPreference,
        checkAll: checkAll,
        hashChange: hashChange,
        clearField: clearField
    };

}());

$(document).ready(function() {
    $('button#citysearch').on('click', clc.citySearch);
    $('.clear-x').on('click', clc.clearField);
    clc.previousHash = location.hash = '#';
    $(window).on('hashchange', clc.hashChange);
    var defaultcity = localStorage.getItem('defaultcity');
    if (defaultcity) {
        $('[name="defaultcity"]').val(defaultcity);
    }
});

