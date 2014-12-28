$(document).ready(function() {
    //Initialize a loader
    if (loader == undefined) {
        var loader = '<div id="canvasloader-container"><img src="/bundles/avajax/img/three-dots.svg" style="width: 80%;
padding-top: 15px;"/></div>';
    }
    $('body').prepend(loader);

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
});

$(document).on('ajax_button_listener_initialized', function() {
    $(document).on('submit', 'form[data-toggle="ajax"]', function(event) {
        if($(this).hasClass('confirm') || $(this).hasClass('confirm-waiting')){
            return false;
        }
        $('#canvasloader-container').fadeIn();
        event.preventDefault();
        var update = $(this).data('update')?$(this).data('update') : $(this).attr('data-target') ? $(this).attr('data-target') : '';
        var updateStrategy = $(this).data('updateStrategy') ? $(this).data('updateStrategy') : 'html';
        var form = $(this);
        var effect = guessEffect(this, "#" + update);
        ajaxFormSubmit(form, $(form).attr('action'), update, updateStrategy, effect);

        return false;
    }).on('click', 'a[data-toggle="ajax"]', function(event) {
        if($(this).hasClass('confirm') || $(this).hasClass('confirm-waiting')){
            return false;
        }
        $('#canvasloader-container').fadeIn();
        event.preventDefault();

        //is the link linked ot a form
        var formSelector = $(this).data('form');

        var update = $(this).data('update') ? $(this).data('update') : $(this).attr('data-target') ? $(this).attr('data-target') : '';
        var updateStrategy = $(this).data('updateStrategy') ? $(this).data('updateStrategy') : 'html';
        var link   = $(this).attr('href');
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
});

function ajaxFormSubmit(form, action, update, updateStrategy, effect) {
    var button = $('[type="submit"][data-trigger=true]');
    //grab all form data
    var formData = $(form).serializeArray();
    formData.push({ name: button.attr('name'), value: button.attr('value') });
    formData = $.param(formData);
    var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
    if ($(form).attr('enctype') == 'multipart/form-data') {
        var formData = new FormData($(form)[0]);
        formData.append(button.name, button.value);
        var contentType = false;
    }

    $.ajax({
        url         : action,
        context     : document.body,
        data        : formData,
        type        : $(form).attr('method'),
        contentType : contentType,
        processData : false,
        async       : false,
        cache       : false,
        success     : function(jsonResponse) {
            ajaxify(jsonResponse, update, updateStrategy, effect);
        }
    });


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
                alert("Il semble s'êre produit une erreur");
            } else {
                toastr.options = {
                  "positionClass": "toast-bottom-left",
                }
                toastr.error("Il semble s'êre produit une erreur");
            }
            $('#canvasloader-container').fadeOut();
        }
    });
}

function ajaxify(jsonResponse, update, updateStrategy, effect) {

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

    $('#canvasloader-container').fadeOut();

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
        window.location = json.redirect;
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
