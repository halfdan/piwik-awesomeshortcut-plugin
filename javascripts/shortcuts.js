$(document).ready(function() {
    var overlay = jQuery('<div/>', {id: 'awesomeBox'});
    var awesomeBox = jQuery('<input/>', {type: 'text', id: 'awesomeInput'});
    var resultList = jQuery('<ul/>', {id: 'resultList'});
    var websites = {};
    var selectedIndex = 1;

    var Key = {
        ENTER: 13,
        ESCAPE: 27,
        UP: 38,
        DOWN: 40
    };

    var ActionType = {
        SITE: 0, // Website switch
        METRIC: 1, // Shows numbers
        MENU: 2, // Switched to menu item
        SEARCH: 3, // Searches piwik.org Documentation
        DATE: 4 // Switch to a date or range
    };

    function buildOverlay() {
        overlay = $('<div/>', {id: 'awesomeBox'}).append(
            awesomeBox, resultList
        );
        // Add overlay to body
        overlay.appendTo(document.body);

        // Hide overlay
        overlay.hide();

        // Setup keys
        overlay.keydown(function(event) {
            if(event.which == Key.DOWN || event.which == Key.UP) {
                event.stopPropagation();
                event.preventDefault();
            }
        });

        overlay.keyup(function(event) {
            switch(event.which) {
                case Key.UP:
                    selectItem(--selectedIndex);
                    break;
                case Key.DOWN:
                    selectItem(++selectedIndex);
                    break;
                case Key.ENTER:
                    handleItemAction();
                    break;
                default:
                    clearResults();
                    if(awesomeBox.val().length >= 1) {
                        computeResults(awesomeBox.val());
                    }
                    selectItem(1);
                    break;
            }
        })
    }

    function handleItemAction() {
        var itemList = resultList.find('li:nth-child('+selectedIndex+')');
        var item = $(itemList[0]);

        var action = item.attr('data-action');
        if(action == 'site') {
            // Redirect to idsite
            switchSite(2);
        } else if(action == 'menu') {
            // Open menu
        } else if(action == 'search') {
            // Redirect to piwik.org search
            var search = awesomeBox.val();
            window.location = "http://piwik.org/?s=" + encodeURIComponent(search);
        }
    }

    function init() {
        buildOverlay();
        loadWebsites();
        //loadMetrics();
    }


    $(document).keyup(function(event) {
        if(event.which == Key.ENTER && !overlay.is(':visible')) {
            clearResults();
            overlay.show();
            awesomeBox.val('');
            awesomeBox.focus();
        } else if(event.which == Key.ESCAPE) {
            overlay.hide();
        }
    });

    function selectItem(index) {
        resultList.find('li').removeClass('active');
        resultList.find('li:nth-child('+index+')').addClass('active');
    }

    function clearResults() {
        resultList.empty();
    }

    function addResult(type, content, description) {
        var actionType;
        switch(type) {
            case ActionType.METRIC:
                actionType = 'metric';
                break;
            case ActionType.SITE:
                actionType = 'site';
                break;
            case ActionType.MENU:
                actionType = 'menu';
                break;
            case ActionType.SEARCH:
                actionType = 'search';
                break;
            case ActionType.DATE:
                actionType = 'date';
            default:
                break;
        }

        var item = $('<li/>', {'data-action': actionType}).append(
            $('<img/>', {src: 'plugins/AwesomeShortcuts/images/'+actionType+'-48.png'}),
            $('<span/>', {'class': 'text'}).text(content),
            $('<span/>', {'class': 'description'}).text(description)
        );
        resultList.append(item);
    }

    function computeResults(string) {

        var matches;
        matches = string.match(/^\d{4}$/);
        // Check for valid dates
        if(matches) {
            addResult(ActionType.DATE, "Year: " + string, 'Show yearly report with given year');
        }

        matches = string.match(/^(\d{4})-(\d{1,2})$/);
        if(matches) {
            var monthNames = [ "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December" ];
            var month = parseInt(matches[2]);
            addResult(ActionType.DATE, "Month: " + monthNames[month-1] + " " + matches[1], 'Show monthly report');
        }

        // Compute website list
        var siteList = $.grep(websites, function(v) {
            return v.name.toLowerCase().indexOf(string.toLowerCase()) >= 0;
        });
        $.each(siteList, function(id, site) {
            addResult(ActionType.SITE, site.name, 'Website · ' + site.main_url);
        });

        // Add link to documentation
        addResult(ActionType.SEARCH, "Search piwik.org", 'Use the input to search the Piwik Documentation');
    }

    function loadWebsites() {
        var ajaxRequest = new ajaxHelper();
        ajaxRequest.addParams({
            module: 'API',
            method: 'SitesManager.getSitesWithAtLeastViewAccess',
            format: 'json'
        }, 'get');
        ajaxRequest.setFormat('json');
        ajaxRequest.setCallback(function (siteList) {
            websites = siteList;
        });
        ajaxRequest.send(false);
    }

    init();
});

