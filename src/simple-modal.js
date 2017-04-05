/*
  ---
  description: SIMPLE MODAL for jQuery is a small plugin based on original SimpleModal for Mootools. It can be used to generate alert or confirm messages with few lines of code. Confirm configuration involves the use of callbacks to be applied to affirmative action;i t can work in asynchronous mode and retrieve content from external pages or getting the inline content. SIMPLE MODAL is not a lightbox although the possibility to hide parts of its layout may partially make it similar.

  license: MIT-style

  authors:
  - Michał Buczko
  - Marco Dell'Anna

  requires:
  - jQuery 1.6+

  provides:
  - SimpleModal
  ...

  * Simple Modal for jQuery
  * Version 1.0
  *
  * Copyright (c) 2011 Michał Buczko
  * Original Simple Modal copyrighted 2011 Marco Dell'Anna - http://www.plasm.it
  *
  * Requires:
  * jQuery http://jquery.com
  *
  * Permission is hereby granted, free of charge, to any person
  * obtaining a copy of this software and associated documentation
  * files (the "Software"), to deal in the Software without
  * restriction, including without limitation the rights to use,
  * copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the
  * Software is furnished to do so, subject to the following
  * conditions:
  *
  * The above copyright notice and this permission notice shall be
  * included in all copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  * OTHER DEALINGS IN THE SOFTWARE.
  *
  * Log:
  * - Added option 'animate' to enable/disable animation.
  * - Fixed bug where 'keyEsc' option was ignored.
  *
  * 1.0 - Initial version [Tested on: ie8/ie9/Chrome/Firefox7/Safari]
  */

(function($) {

    var self = null;

    $.fn.extend({
        buttons: null,
        options: null,

        defaults: {
            onAppend:      null,
            offsetTop:     null,
            overlayOpacity:.3,
            overlayColor:  '#000000',
            width:         400,
            draggable:     true,
            keyEsc:        true,
            closeButton:   true,
            hideHeader:    false,
            hideFooter:    false,
			animate:       true,
            btnOk:         'OK',
            btnCancel:     'Cancel',
            template: '<div class=\"simple-modal-header\"> \
                <h1>{_TITLE_}</h1> \
            </div> \
                <div class=\"simple-modal-body\"> \
                <div class=\"contents\">{_CONTENTS_}</div> \
            </div> \
                <div class=\"simple-modal-footer\"></div>'
        },

        SimpleModal: function(options) {
            self = this;

            this.buttons = [];
            this.options = $.extend({}, self.defaults, options);

            return this;
        },

        showModal: function() {
            var loadable = null;

            this._overlay('show');

            switch(this.options.model) {
            case 'modal':
                break;
            case 'modal-ajax':
                loadable = {
                    url: self.options.param.url || '',
                    onRequestComplete: this.options.param.onRequestComplete
                };
                break;
            case 'confirm':
                this.addButton(this.options.btnOk, 'btn primary btn-margin', function() {
                    self.hideModal();
                    self.options.callback();
                });
                this.addButton(this.options.btnCancel, 'btn secondary');
                break;
            default:
                this.addButton(this.options.btnOk, 'btn primary');
            }

            var $node = this._drawWindow(this.options, loadable);

            if (this.options.closeButton) { this._addCloseButton($node);   }
            if (this.options.hideHeader)  { $node.addClass('hide-header'); }
            if (this.options.hideFooter)  { $node.addClass('hide-footer'); }
            if (this.options.draggable)   {
                var dx = 0,
                    dy = 0,
                    updatePos = function(e) {
                        $node.css({left: e.pageX - dx, top: e.pageY - dy});
                    };

                $node
                    .find('.simple-modal-header')
                    .bind({
                        mousedown: function(e) {
                            var pos = $node.position();

                            dx = e.pageX - pos.left + document.body.scrollLeft;
                            dy = e.pageY - pos.top +  document.body.scrollTop;

                            e.stopPropagation();
                            e.preventDefault();

                            $(document).mousemove(updatePos);
                        },
                        mouseup: function(e) {
                            $(document).unbind('mousemove', updatePos);
                        }
                    })
                    .css('cursor', 'move')
                    .addClass('draggable');
            }
            this._display();
        },

        hideModal: function() {
		    self._overlay('hide');
        },

        addButton: function(label, clazz, handler) {
            this.buttons
                .push($('<a>', {title : label, class : clazz})
                      .click(handler ? function(e) { handler.call(self, e); } : self.hideModal)
                      .text(label));
            return this;
        },

        _drawWindow: function(options, loadable) {
            var $node = $('<div>', {id: 'simple-modal'})
                .addClass('simple-modal')
		        .html(this._template(self.options.template, {
                    '_TITLE_':    options.title || 'Untitled',
                    '_CONTENTS_': options.contents || ''
                })),
                $footer = $node.find('.simple-modal-footer');

            // append all added buttons
            $.each(self.buttons, function(i, e) { $footer.append(e); });

            // dom element as content? inject it into dialog.
            if (this.options.element) {
                $node.find('.contents').replace(this.options.element);
            }

            $('body').append($node.css('width', this.options.width));

            if (this.options.onAppend) {
		        this.options.onAppend.call(this);
            }
            if (loadable) {
                this._loadContents(loadable, $node);
            }
			return $node;
		},

        _addCloseButton: function($node) {
            $node.append($('<a>', {href: '#', class: 'close'})
                         .text('x')
                         .click(function(e) {
                             self.hideModal();
                             return false;
                         }));
        },

        _overlay: function(action) {
            switch(action) {
            case 'show':
                var $overlay = $('<div>', {id: 'simple-modal-overlay'});

                $('body').append($overlay
                                 .css({'background-color': this.options.overlayColor, 'opacity': 0})
                                 .animate({opacity: this.options.overlayOpacity}, self.options.animate ? 400 : 0)
                                 .click(self.hideModal));

                $(window).resize(self._display);
                $(document).keyup(self._escape);
                break;

            case 'hide':
                $('#simple-modal').remove();
                $('#simple-modal-overlay').remove();

                $(window).unbind('resize', self._display);
                $(document).unbind('keyup', self._escape);
            }
        },

        _escape: function(e) {
        	if (self.options.keyEsc && e.keyCode === 27) {
                self.hideModal();
            }
        },

        _loadContents: function(param, $node) {
			var re = new RegExp( /([^\/\\]+)\.(jpg|png|gif)$/i ),
                $container = $node.addClass('loading'),
                $overlay = $('#simple-modal-overlay');

			if (param.url.match(re)) {
				$overlay.unbind();
	            $container.addClass('hide-footer');

                var $image = $('<img>', {'src': param.url}).load(function() {
					var $this = $(this),
                        $window = $(window),
                        $content = $container.removeClass('loading').find('.contents').empty().append($this.css('opacity', 0)),
                        dw = $container.width() - $content.width(),
                        dh = $container.height() - $content.height(),
						width = $this.width() + dw, height = $this.height() + dh;

                    $container.animate({
                        width: width,
                        height: height,
                        left: ($window.width() - width)/2,
                        top: ($window.height() - height)/2
                    }, self.options.animate ? 200 : 0, function () {
                        $image.animate({opacity: 1}, self.options.animate ? 400 : 0);
                    });
                });

			} else $container
                    .find('.contents')
                    .load(param.url, function(responseText, textStatus, XMLHttpRequest) {
                        $container.removeClass('loading');

                        if (textStatus !== 'success') {
	                        $container.find('.contents').html('loading failed');

                            if (param.onRequestFailure) {
                                param.onRequestFailure();
                            }
                        } else {
                            if (param.onRequestComplete) {
                                param.onRequestComplete();
                            }
	                        self._display();
                        }
                    });
        },

        _display: function() {
            var $window  = $(window),
                $modal   = $('#simple-modal'),
                $overlay = $('#simple-modal-overlay');

            $overlay.css({width: $window.width(), height: $window.height()});
            $modal.css({
                top: self.options.offsetTop || ($window.height() - $modal.height()) / 2,
                left: ($window.width() - $modal.width()) / 2
            });
        },

        _template: function(s,d) {
            for (var p in d) {
                s = s.replace(new RegExp('{' + p + '}','g'), d[p]);
            }
            return s;
        }
    });

})(jQuery);
