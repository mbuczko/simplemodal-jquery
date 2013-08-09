Modal - A simple modal window
===========================================
SIMPLE MODAL is a small plugin for jQuery to create modal windows. It's heavily based on SIMPLE MODAL for Mootools (http://simplemodal.plasm.it/)
It can be used to generate alert or confirm messages with few lines of code. Confirm configuration involves the use of callbacks to be applied to affirmative action; it can work in asynchronous mode and retrieve content from external pages or getting the inline content.
SIMPLE MODAL is not a lightbox although the possibility to hide parts of its layout may partially make it similar.

Working example: 

http://buczko.pl/simplemodal-jquery/Demo/

How to Use
----------

Minimal configuration


ALERT INTEGRATION 
-----------------
Snippet code Javascript:

```javascript	
	$("#myElement").click(function() {
	      $.fn.SimpleModal({
                btn_ok:   "Alert button"
                title:    "Title",
	            contents: "Your message..."
	      }).showModal();
	});
```

Snippet code HTML:

```html	
	<a id="myElement" href="javascript;">Alert</a>
```

MODAL-AJAX INTEGRATION
----------------------
Snippet code Javascript:

```javascript
	$("#myElement").click(function() {
        $.fn.SimpleModal({
            model: "modal-ajax",
            title: "Title",
            param: {
                url: "file-content.php",
                onRequestComplete: function() { /* Action on request complete */ }
            }
        }.addButton("Action button", "btn primary", function() {
            this.hide();
        }).addButton("Cancel", "btn").showModal();
	});
```
Snippet code HTML:

```html
	<a id="myElement" href="javascript;">Open Modal</a>
```
