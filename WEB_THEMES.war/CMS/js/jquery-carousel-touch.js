(function(window, document, $, undefined) {
    var Touch = function(api) {
        return {
            supported: ("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch,
            eventType: function(action) {
                var eventTypes = {
                    start: (this.supported ? 'touchstart' : 'mousedown'),
                    move: (this.supported ? 'touchmove' : 'mousemove'),
                    end: (this.supported ? 'touchend' : 'mouseup'),
                    cancel: (this.supported ? 'touchcancel' : 'mouseout')
                };
                return eventTypes[action];
            },
            setup: function() {
                if (!this.supported) {
                    document.ondragstart = function() {
                        return false;
                    };
                }
                api.$element.on(this.eventType('start'), $.proxy(this.start, this));
                api.$element.find('a').on(this.eventType('start'), function(e) {
                    this.timeStamp = e.timeStamp;
                }).on('click', function(e) {
                    if (e.timeStamp - this.timeStamp > 400) {
                        e.preventDefault(); // prevent Click
                    }
                });
            },
            getEvent: function(event) {
                var e = event.originalEvent;
                if (this.supported && e.touches.length && e.touches[0]) {
                    e = e.touches[0];
                }
                return e;
            },
            start: function(e) {
                if (!api.isMoving) {

                    if (api.autoplay.enabled) {
                        api.autoplay.stop();
                    }
                    //api.$element.addClass(namespace + '_moving'); // it will cause a click not working issue
                    var event = this.getEvent(e);
                    this.data = {};
                    if (api.direction === "horizontal") {
                        this.data.start = event.pageX;
                    } else if (api.direction === "vertical") {
                        this.data.start = event.pageY;
                    }

                    this.data.position = parseInt(api.$ul.css(api.animateProperty), 10);
                    this.data.current = api.current;
                    this.data.distance = 0;
                    $(document)
                        .on(this.eventType('move'), $.proxy(this.move, this))
                        .on(this.eventType('end'), $.proxy(this.end, this));
                }
            },
            move: function(e) {
                var event = this.getEvent(e);

                if (api.direction === "horizontal") {
                    this.data.distance = (event.pageX || this.data.start) - this.data.start;
                    if (api.options.rtl) {
                        this.data.distance = -this.data.distance;
                    }

                } else if (api.direction === "vertical") {
                    this.data.distance = (event.pageY || this.data.start) - this.data.start;
                }

                api.$element.trigger('touchmove', this.data);

                api.$ul.css(api.animateProperty, this.data.distance + this.data.position);
            },
            end: function() {
                $(document).off(this.eventType('move')).off(this.eventType('end'));

                api.$element.trigger('touchend', this.data);
            }
        };
    };

    $(document).on('carousel::ready', function(event, instance) {
        if (instance.options.touch !== true) {
            return;
        }
        var touch = new Touch(instance);
        touch.setup();
    });
})(window, document, jQuery);
