$(document).ready(function() {
    $('body').prepend('<div id="canvasloader-container"></div>');
    createLoader('#canvasloader-container');
    $(document).on('submit', 'form[data-toggle="ajax"]', function(event) {
        if($(this).hasClass('confirm') || $(this).hasClass('confirm-waiting')){
            return false;
        }
        $('#canvasloader-container').fadeIn();
        event.preventDefault();
        var update = $(this).data('update')?$(this).data('update') : $(this).attr('data-target') ? $(this).attr('data-target') : '';
        var form = $(this);
        ajaxFormSubmit(form,update);

        return false;
    });

    $(document).on('click', 'a[data-toggle="ajax"]', function(event) {
        if($(this).hasClass('confirm') || $(this).hasClass('confirm-waiting')){
            return false;
        }
        $('#canvasloader-container').fadeIn();
        event.preventDefault();
        var update = $(this).data('update') ? $(this).data('update') : $(this).attr('data-target') ? $(this).attr('data-target') : '';
        var link   = $(this).attr('href');
        ajaxLink(link,update);

        return false;
    });
});

function ajaxFormSubmit(form,update) {
    $.ajax({
        url: $(form).attr('action'),
        context: document.body,
        data: $(form).serialize(),
        type: $(form).attr('method'),
        success: function(jsonResponse) {
            ajaxify(jsonResponse, update);
        }
    });
}

function ajaxLink(link,update) {
    $.ajax({
        url: link,
        context: document.body,
        type: "GET",
        success: function(jsonResponse) {
            ajaxify(jsonResponse, update);
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

function ajaxify(jsonResponse, update) {
    var effect;
    console.log(jsonResponse);

    if (typeof jsonResponse === 'object') {
        handleJson(jsonResponse, update);
    } else {
        $("#"+update).html(jsonResponse);
        effect = guessEffect("#"+update);
    }

    $('#canvasloader-container').fadeOut();

}

function handleJson(json, update) {

    if (json.hasOwnProperty("update")) {
        update = json.update;
    }
    effect = guessEffect("#"+update);
    // check if an ajax callback is given in the response, execute it
    if (json.hasOwnProperty("ajax-callback")) {
        $.post(json.callback,
        {
            params : json.data
        },
        function(data){
            $("#"+update).html(data);
        });
    }
    // a callback is javascript code
    if (json.hasOwnProperty("callback")) {
        eval(json.callback);
    }
    // html is the html part to be inserted in the "update"
    if (json.hasOwnProperty("html")) {
        $("#"+update).html(json.html);
        if(effect != undefined){
            eval('$("#"+update).'+effect+'()');
        }
    }
    // redirect is an url
    if (json.hasOwnProperty("redirect")) {
        window.location = json.redirect;
    }
}

function guessEffect(id) {
    var effect = "show";
    if ($(id).html() != undefined) {
        if ($(id).html() == "") {
            effect = "slideDown";
            if ($(id).attr('data-new-effect') != undefined && $(id).attr('data-new-effect') != "") {
                effect = $(id).attr('data-new-effect');
            }
        } else {
            effect = "fadeIn";
            if ($(id).attr('data-update-effect') != undefined && $(id).attr('data-update-effect') != "") {
                effect = $(id).attr('data-update-effect');
            }
        }
    }

    $(id).hide();

    return effect;
}
function createLoader(id) {
    $(id).html("<img src='/bundles/avajax/images/ajax-loader.gif' title='Chargement en cours' alt='Chargement' width='32' height='32'/>");
}
