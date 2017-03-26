$(document).ready(function() {

    /* Alert */
    $('#alert').click(function() {
        $.fn.SimpleModal({btn_ok: 'Alert button', title: 'Alert Modal Title', contents: 'Lorem ipsum dolor sit amet...'}).showModal();
    });

    /* Confirm */
    $('#confirm').click(function() {
        $.fn.SimpleModal({
            btn_ok: 'Confirm button',
            model: 'confirm',
            callback: function(){
                alert('Action confirm!');
            },
            title: 'Confirm Modal Title',
            contents: 'Lorem ipsum dolor sit amet...'
        }).showModal();
    });

    /* Modal */
    $('#modal').click(function() {
        $.fn.SimpleModal({
            btn_ok: 'Confirm button',
            model: 'modal',
            title: 'Modal Window Title',
            contents: '<p ><img style="text-align:center" src="assets/images/simpleModalSmallWhite.png" />Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>'
        }).addButton('Confirm', 'btn primary', function() {
            alert('Action confirm modal');
            this.hideModal();
        }).addButton('Cancel', 'btn').showModal();
    });

    /* Modal Ajax */
    $('#modal-ajax').click(function() {
        $.fn.SimpleModal({
            btn_ok: 'Confirm button',
            width: 600,
            model: 'modal-ajax',
            title: 'Are you sure you want to delete this?',
            param: {
                url: 'ajax-content.html',
                onRequestComplete: function() { },
                onRequestFailure: function() { }
            }
        }).addButton('Confirm', 'btn primary', function() {
		    // Check
		    if( $('confirm-text').get('value') != "DELETE" ) {
			    $('confirm-delete-error').setStyle('display', 'block');
		    } else {
			    // Your code ...
			    this.hideModal();
		    }
        }).addButton('Cancel', 'btn').showModal();
    });

    /* Modal Image */
    $('#modal-image').click(function(e) {
        $.fn.SimpleModal({
            model: 'modal-ajax',
		    title: 'Modal Lightbox',
            param: {
                url: 'assets/images/lightbox.jpg'
            }
        }).showModal();
    });

    /* NO Header */
    $('#alert-noheader').click(function(e) {
        $.fn.SimpleModal({
            hideHeader: true,
            closeButton: false,
            btn_ok: 'Close window',
            width: 600,
            model: 'alert',
            contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        }).showModal();
    });

    /* NO Footer */
    $('#modal-nofooter').click(function(e) {
        $.fn.SimpleModal({
            hideFooter: true,
            width: 710,
            title: 'Vimeo video',
            model: 'modal',
            contents: '<iframe src="http://player.vimeo.com/video/26198635?title=0&amp;byline=0&amp;portrait=0&amp;color=824571" width="680" height="382" frameborder="0" webkitAllowFullScreen allowFullScreen></iframe>'
        }).showModal();
    });

    $("#example-eheh").click(function(e) {
        $.fn.SimpleModal({
            btn_ok: 'Confirm button',
            overlayClick: false,
            width: 300,
            model: 'modal',
            title: 'Eh eh eh',
            contents: '<p>Try clicking on the button \"Click ME please!\"</p>',

            onAppend: function() {
                var item = $("#simple-modal .simple-modal-footer a");
                item.removeClass("primary").css({"background":"#824571","color": "#FFF" }).parent().addClass("align-left");
	            item.bind("mouseenter", function() {
	                var parent = $(this).parent();
	                if (parent.hasClass("align-left")) {
	                    parent.removeClass("align-left").addClass("align-right");
	                } else {
	                    parent.removeClass("align-right").addClass("align-left");
	                }
	            });
            }
        }).addButton("Click ME please!", "btn primary", function(){}).showModal();
    });
});
