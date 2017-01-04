// For every change on inputs and select with attr data-refreshOnChange
$(document).on(
    'change',
    'select[data-refreshOnChange="true"], ' +
    'input:checkbox[data-refreshOnChange="true"], ' +
    'input:radio[data-refreshOnChange="true"]',
    function(event) {
        var form = $(this).parents('form');
        var formdata = (window.FormData) ? new FormData(form[0]) : null;
        var data = (formdata !== null) ? formdata : form.serialize();
        var ignoredChanges = {};
        var updateStrategy = "html";
        if ($(this).data('update-strategy')) {
            updateStrategy = $(this).data('update-strategy');
        }
        $(form).find('[data-ignoreonchange]').each(function (idx, elem) {
            var $elem = $(elem);
            ignoredChanges[$elem.attr('data-ignoreonchange')] = $elem;
        });
        $.ajax({
            url         : form.attr('action') + (form.attr('action').split('?')[1] ? '&' : '?') + 'novalidate',
            data        : data,
            type        : $(form).attr('method'),
            contentType : false,
            processData : false
        }).done(function(response){
            if (typeof response === 'object' && response.hasOwnProperty("html")) {
                newForm = response.html;
            } else {
                newForm = response;
            }
            eval('form.' + updateStrategy + '(newForm)');
            $.each(ignoredChanges, function(index, elem){
                $('[data-ignoreonchange="' + index + '"]').replaceWith(elem);
            });
        }).fail(function(response) {
            console.error('Request has failed');
        });
    }
);
