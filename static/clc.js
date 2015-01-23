
$(document).ready(function() {
    var $containerEl1 = $('#city-search-form'),
        $containerEl2 = $('#city-search-results'),
        $containerEl3 = $('#job-search-results'),
        $forwardEl = $('a.forward-1');
    $('button#citysearch').on('click', function(event) {
        var data      = $('form.citysearch').serialize(),
            url       = '/citysearch?' + data,
            $buttonEl = $(this);
        event.preventDefault();
        $buttonEl.html('Loading...');
        $buttonEl.prop('disabled', true);
        //history.pushState({ state: 'citysearch' }, '', url);
        $.get(url).then(function(results) {
            $containerEl2.html(results);
            $containerEl2.show();
            $containerEl1.hide();
            $buttonEl.html('Search for cities');
            $buttonEl.prop('disabled', false);

            $('input[type=checkbox][name=city]').each(function() {
                $(this).on('change', storeCheckedPreference);
                var city = $(this).val();
                if (localStorage.getItem(city) != undefined) {
                    $(this).prop('checked', true);
                }
            });
            $('a.back-1').on('click', function() {
                $containerEl2.hide();
                $containerEl1.show();
                $forwardEl.show();
                //history.back();
                $forwardEl.on('click', function() {
                    $containerEl2.show();
                    $containerEl1.hide();
                    //history.forward();
                });
            });
            $('#checkall').on('change', function() {
                checkAll($(this).is(':checked'));
            });
            $('button#jobsearch').on('click', function(event) {
                var data      = $('form.jobsearch').serialize(),
                    $buttonEl = $(this);

                event.preventDefault();
                //history.pushState({ state: 'jobsearch' }, '', url);
                $containerEl2.hide();
                $containerEl3.show();
                $containerEl3.children(':not(.nav)').remove();

                $('input[type=checkbox][name=city]:checked').each(function() {
                    var city = $(this).val(),
                        url  = '/jobsearch?' + data + '&city=' + city,
                        html = $('#template-loading').html().replace(/{city}/g, city);
                    $containerEl3.append(html);
                    $.get(url).then(function(results) {
                        var html = results.html,
                            city = results.city;
                        $('#' + city + '-container ul').html(html);
                    }, function() {
                        var city = this.url.substring(this.url.indexOf('city=') + 5);
                        $('#' + city + '-container ul').html($('#template-loading-failed').html().replace(/{city}/g, city));
                        $('#try-again-' + city).on('click', function() {
                            $('#' + city + '-container ul').html('<li class="placeholder">Loading...</li>');
                            reload(url);
                        });
                    });
                });
                $('a.back-2').on('click', function() {
                    var $forwardEl = $('a.forward-2');
                    $containerEl3.hide();
                    $containerEl2.show();
                    $forwardEl.show();
                    //history.back();
                    $forwardEl.on('click', function() {
                        $containerEl3.show();
                        $containerEl2.hide();
                        //history.forward();
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
    $('input.city[type=checkbox]').each(function() {
        var currChecked = $(this).is(':checked');
        if (checked != currChecked) {
            $(this).click();
        }
    });
}

function reload(url) {
    $.get(url).then(function(results) {
        var city = results.city;
        var html = results.html;
        $('#' + city + '-container ul').html(html);
    }, function() {
        var city = this.url.substring(this.url.indexOf('city=') + 5);
        $('#' + city + '-container ul').html($('#template-loading-failed').html().replace(/{city}/g, city));
        $('#try-again-' + city).on('click', function() {
            reload(url);
        });
    });
}
