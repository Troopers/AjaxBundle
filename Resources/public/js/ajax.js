$(document).ready(function() {
    $('body').prepend('<div id="canvasloader-container"></div>');
    createLoader('#canvasloader-container');
    $(document).on('submit', 'form.ajax', function(event) {
        $('#canvasloader-container').fadeIn();
        event.preventDefault();
        var update = $(this).attr('update')?$(this).attr('update') : '';
        var form = $(this);
        ajaxFormSubmit(form,update);

        return false;
    });

    $(document).on('click', 'a.ajax', function(event) {
        $('#canvasloader-container').fadeIn();
        event.preventDefault();
        var update = $(this).attr('update') ? $(this).attr('update') : '';
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
            alert("Il semble s'êre produit une erreur");
            $('#canvasloader-container').fadeOut();
        }
    });
}

function ajaxify(jsonResponse, update) {
    var effect;
    if (jsonResponse.substring(0,1)=="{" && jsonResponse.substring(jsonResponse.length-1)=="}") {
        var json = eval("("+jsonResponse+")");
        if (json.update != undefined) {
            update = json.update;
        }
        effect = initEffect("#"+update);
        // check if a callback is given in the response
        if (json.hasOwnProperty("callback")) {
            $.post(json.callback,
            {
                params : json.data
                },
            function(data){
                $("#"+update).html(data);
            });
        } else {//if no callback has been given, we put data in the element to update
            $("#"+update).html(json.data);
        }
    } else {
        effect = initEffect("#"+update);
        $("#"+update).html(jsonResponse);
    }
    if(effect != undefined){
        eval('$("#"+update).'+effect+'()');
    }

    $('#canvasloader-container').fadeOut();

}

function initEffect(id) {
    var effect = "show";
    if($(id).html() != undefined){
        if($(id).html() == ""){
            effect = "slideDown";
            if($(id).attr('data-new-effect') != undefined && $(id).attr('data-new-effect') != ""){
                effect = $(id).attr('data-new-effect');
            }
        }else{
            effect = "fadeIn";
            if($(id).attr('data-update-effect') != undefined && $(id).attr('data-update-effect') != ""){
                effect = $(id).attr('data-update-effect');
            }
        }
    }
    $(id).hide();
    console.log(effect);

    return effect;
}
function createLoader(id) {
    $(id).html("<img src='/bundles/avajax/images/ajax-loader.gif' title='Chargement en cours' alt='Chargement' width='32' height='32'/>");
}
