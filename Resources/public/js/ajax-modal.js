$(document).ready(function() {

    // Support for AJAX loaded modal window.
    // Focuses on first input textbox after it loads the window.
    // To use it  : <a href="/url/to/load/modal_window.htm" data-toggle="modal">link</a>
    $('[data-toggle="modal"]').click(function(e) {
        e.preventDefault();
        var url = $(this).attr('href');
        if (url.indexOf('#') == 0) {
            $(url).modal('open');
        } else {
            $.get(url, function(data) {
                $('<div class="modal hide fade">' + data + '</div>').modal();
            }).success(function() { $('input:text:visible:first').focus(); });
        }
    });

});
