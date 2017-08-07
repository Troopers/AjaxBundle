$(document).ready(function() {
    //Initialize a loader
    if (window.loader == undefined) {
        window.loader = '<div id="canvasloader-container" ><img src="/bundles/troopersajax/img/three-dots.svg" style="width: 80%; padding-top: 15px;"/></div>';
    }
    if (window.loaderOverlay == undefined) {
        window.loaderOverlay = '<div id="canvasloader-container--overlay"></div>';
    }

    $wrapper = $('<div style="display: none;"></div>');
    $loader = $(window.loader);
    $loaderOverlay = $(window.loaderOverlay);
    $wrapper.prepend($loader).prepend(loaderOverlay);
    $('body').prepend($wrapper);

    /**
     * The clicked link or button is tagged with data-trigger=true. When a form is submitted,
     * we find the tagged element in case it has some data to submit.
     */
    $(document).on('click', 'form[data-toggle="ajax"] *[type="submit"]', function (event) {
        $(this).parents('form[data-toggle="ajax"]').first().children('*[type="submit"]').each(function () {
            $(this).attr('data-trigger', false);
        });
        $(this).attr('data-trigger', true);
    });

    $(document).trigger('ajax_button_listener_initialized');
    $('*[data-toggle="ajax"]').each(function() {
        $(this).css({
            'pointer-events' : 'auto',
            'cursor' : 'auto'
        });
    });
});

/**
 * Keep scroll position after replacing content
 */
$(document).ajaxStart(function() {
    scrollTop = $(document).scrollTop();
});

$(document).ajaxSuccess(function() {
    if (typeof scrollTop != 'undefined') {
        $(document).scrollTop(scrollTop);
    }
});

$(document).ajaxComplete(function() {
    $('*[data-toggle="ajax"]').each(function() {
        $(this).css({
            'pointer-events' : 'auto',
            'cursor' : 'auto'
        });
    });
});
$(document).on('submit', 'form[data-toggle="ajax"]', function(event) {
    if($(this).hasClass('confirm') || $(this).hasClass('confirm-waiting')){
        return false;
    }
    $wrapper.fadeIn();
    event.preventDefault();
    $(this).trigger('ajax.form.initialize');
    //Guess what is the target to update
    if ($(this).attr('data-target')) {
        var update = $(this).attr('data-target');
    } else if ($(this).data('update')) {
        console.info('The use of data-update will be deprecated in next version, please use data-target instead.');
        var update = $(this).data('update');
    }
    var updateStrategy = $(this).data('update-strategy') ? $(this).data('update-strategy') : 'html';
    var form = $(this);
    var effect = guessEffect(this, "#" + update);
    ajaxFormSubmit(form, $(form).attr('action'), update, updateStrategy, effect);

    return false;
}).on('click', 'a[data-toggle="ajax"]', function(event) {
    if($(this).hasClass('confirm') || $(this).hasClass('confirm-waiting')){
        return false;
    }
    $wrapper.fadeIn();
    event.preventDefault();

    //is the link linked ot a form
    var formSelector = $(this).data('form');

    $(this).trigger('ajax.link.initialize');
    //Guess what is the target to update
    if ($(this).attr('data-target')) {
        var update = $(this).attr('data-target');
    } else if ($(this).data('update')) {
        console.info('The use of data-update will be deprecated in next version, please use data-target instead.');
        var update = $(this).data('update');
    }
    var updateStrategy = $(this).data('update-strategy') ? $(this).data('update-strategy') : 'html';
    var link = $(this).attr('href');
    var effect = guessEffect(this, "#" + update);

    //if there is a form we submit this one with the href of the link
    if (formSelector === undefined) {
        ajaxLink(link, update, updateStrategy);
    } else {
        var form = $(formSelector);
        ajaxFormSubmit(form, link, update, updateStrategy, effect);
    }

    return false;
});

function ajaxFormSubmit(form, action, update, updateStrategy, effect) {
    $(form).trigger('ajax.ajaxFormSubmit.before');
    var button = $('[type="submit"][data-trigger=true]');
    //grab all form data
    var formData = $(form).serializeArray();
    var formCache = $(form).attr('data-cache') != 'undefined' ? true : false;
    if (button.length) {
        formData.push({ name: button.attr('name'), value: button.attr('value') });
    }
    formData = $.param(formData);
    var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
    if ($(form).attr('enctype') == 'multipart/form-data') {
        var formData = new FormData($(form)[0]);
        formData.append(button.attr('name'), button.val());
        var contentType = false;
    }


    $.ajax({
        url         : action,
        context     : document.body,
        data        : formData,
        type        : $(form).attr('method'),
        contentType : contentType,
        processData : false,
        async       : true,
        cache       : formCache,
        success     : function(jsonResponse) {
            ajaxify(jsonResponse, update, updateStrategy, effect);
        }
    });

    $(form).trigger('ajax.ajaxFormSubmit.after');
}

function ajaxLink(link,update, updateStrategy, effect) {
    $.ajax({
        url     : link,
        context : document.body,
        type    : "GET",
        success : function(jsonResponse) {
            ajaxify(jsonResponse, update, updateStrategy, effect);
        },
        error: function(jsonResponse) {
            if (typeof toastr === 'undefined') {
                alert("Il semble s'être produit une erreur");
            } else {
                toastr.options = {
                    "positionClass": "toast-bottom-left",
                }
                toastr.error("Il semble s'être produit une erreur");
            }
            $wrapper.fadeOut();
        }
    });
}

function ajaxify(jsonResponse, update, updateStrategy, effect) {
    $(document).trigger('ajax.success.before', jsonResponse);

    if (typeof jsonResponse === 'object') {
        handleJson(jsonResponse, update, updateStrategy);
    } else {
        if (effect != undefined && effect != null){
            $("#" + update).hide();
        }
        //By default, the updateStrategy is html (a simple replace) but you can set your own function
        //for example, append, after etc or even a custom one.
        eval('$("#" + update).' + updateStrategy + '(jsonResponse)');

        if (effect != undefined && effect != null){
            eval('$("#" + update).' + effect + '()');
        }
    }

    $wrapper.fadeOut();
    $('*[data-toggle="ajax"]').each(function() {
        $(this).css({
            'pointer-events' : 'auto',
            'cursor' : 'auto'
        });
    });

    $(document).trigger('ajax.success.after', jsonResponse);
}

function handleJson(json, update, updateStrategy, effect) {

    if (json.hasOwnProperty("update")) {
        update = json.update;
    }

    if (effect != undefined && effect != null){
        $("#" + update).hide();
    }

    // check if an ajax callback is given in the response, execute it
    if (json.hasOwnProperty("ajax-callback")) {
        $.post(json.callback,
            {
                params : json.data
            },
            function(data){
                eval('$("#" + update).' + updateStrategy + '(data)');
            });
    }
    // a callback is javascript code
    if (json.hasOwnProperty("callback")) {
        eval(json.callback);
    }
    // html is the html part to be inserted in the "update"
    if (json.hasOwnProperty("html")) {
        eval('$("#" + update).' + updateStrategy + '(json.html)');

        if (effect != undefined && effect != null){
            eval('$("#" + update).'+effect+'()');
        }
    }
    // redirect is an url
    if (json.hasOwnProperty("redirect")) {
        // On firefox location.reload and window.location do not stop the execution of the script. We need to run only 1 command to avoid a double redirection
        if (window.location == json.redirect) {
            location.reload(true);
        } else {
            window.location = json.redirect;
        }
    }
}

function guessEffect(link, targetId) {
    var effect = "show";
    if ($(targetId).html() != undefined) {
        if ($(targetId).html() == "") {
            effect = "slideDown";
            if ($(link).attr('data-new-effect') != undefined && $(link).attr('data-new-effect') != "") {
                effect = $(link).attr('data-new-effect');
            } else if ($(targetId).attr('data-new-effect') != undefined && $(targetId).attr('data-new-effect') != "") {
                effect = $(targetId).attr('data-new-effect');
            }
        } else {
            effect = "fadeIn";
            if ($(link).attr('data-update-effect') != undefined && $(link).attr('data-update-effect') != "") {
                effect = $(link).attr('data-update-effect');
            } else if ($(targetId).attr('data-update-effect') != undefined && $(targetId).attr('data-update-effect') != "") {
                effect = $(targetId).attr('data-update-effect');
            }
        }
    } else if ($(link).data('no-effect')) {
        effect = null;
    }

    return effect;
}
