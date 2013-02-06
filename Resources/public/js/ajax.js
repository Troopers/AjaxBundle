$(document).ready(function() {
    $('body').prepend("<div id='canvasloader-container'></div>");
    createLoader('#canvasloader-container');
    $("form.ajax").on('submit',function(event) {
        $('#canvasloader-container').fadeIn();
        event.preventDefault();
        var update = $(this).attr("update")?$(this).attr("update"):"";
        var form = $(this);

        ajaxFormSubmit(form,update);
        return false;
    });
    $("a.ajax").on('click',function(event) {
        $('#canvasloader-container').fadeIn();
        event.preventDefault();
        var update = $(this).attr("update")?$(this).attr("update"):"";
        var link = $(this).attr("href");
        ajaxLink(link,update);
        return false;
    });
});
function ajaxFormSubmit(form,update){
    $.ajax({
        url: $(form).attr('action'),
        context: document.body,
        data: $(form).serialize(),
        type: $(form).attr('method'),
        success: function(jsonResponse){
            ajaxify(jsonResponse, update);
        }
    });
}

function ajaxLink(link,update){
    $.ajax({
        url: link,
        context: document.body,
        type: "GET",
        success: function(jsonResponse){
            ajaxify(jsonResponse, update);
        },
        error: function(jsonResponse){
            alert("Il semble s'êre produit une erreur");
            $('#canvasloader-container').fadeOut();
        }
    });
}

function ajaxify(jsonResponse, update){
    if(jsonResponse.substring(0,1)=="{" && jsonResponse.substring(jsonResponse.length-1)=="}"){
        var json = eval("("+jsonResponse+")");
        if(json.update != undefined)
            update = json.update;
        // check if a callback is given in the response
        if(json.hasOwnProperty("callback")){
            $.post(json.callback, 
            {
                params : json.data
                },
            function(data){
                $("#"+update).html(data);
            });
        }else{//if no callback has been given, we put data in the element to update
            $("#"+update).html(json.data);
        }
    }else{
        $("#"+update).html(jsonResponse);
    }
    
    $('#canvasloader-container').fadeOut();

}

function createLoader(id){
    $(id).html("<img src='/bundles/avawesomealertify/images/ajax-loader.gif' title='Chargement en cours' alt='Chargement' width='32' height='32'/>");
}

