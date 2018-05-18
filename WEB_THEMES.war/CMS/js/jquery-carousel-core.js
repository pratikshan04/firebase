/*
 * carousel
 * https://github.com/amazingsurge/jquery-carousel
 *
 * Copyright (c) 2014 amazingsurge
 * Licensed under the GPL license.
 */
(function(window, document, $, undefined) {
    'use strict';
    var Util = {
        transition: function() {
            var e,
                end,
                prefix = '',
                supported = false,
                el = document.createElement("fakeelement"),
                transitions = {
                    "WebkitTransition": "webkitTransitionEnd",
                    "MozTransition": "transitionend",
                    "OTransition": "oTransitionend",
                    "transition": "transitionend"
                };
            for (e in transitions) {
                if (el.style[e] !== undefined) {
                    end = transitions[e];
                    supported = true;
                    break;
                }
            }
            if (/(WebKit)/i.test(window.navigator.userAgent)) {
                prefix = '-webkit-';
            }
            return {
                prefix: prefix,
                end: end,
                supported: supported
            };
        }
    };

    // Constructor
    var Carousel = function(element, options) {
        this.element = element;
        this.$element = $(element);

        // options
        this.options = $.extend(true, {}, Carousel.defaults, options, this.$element.data());

        // Namespacing
        var namespace = this.options.namespace;
        this.$element.addClass(namespace);
        this.$ul = this.$element.children('ul');
        this.$wrap = this.$element.wrap('<div class="' + namespace + '-wrap" />').parent();

        this.current = 0;
        this.navNumber = this.options.navNumber;

        if ((this.options.direction === 'right') || (this.options.direction === 'left')) {
            this.direction = "horizontal";
        } else if ((this.options.direction === 'top') || (this.options.direction === 'bottom')) {
            this.direction = "vertical";
        }
        this.transition = Util.transition();
        if (this.options.useCSS) {
            if (!this.transition.supported) {
                this.options.useCSS = false;
            }
        }

        if (this.options.rtl == null) {
            this.options.rtl = (function(element) {
                if (('' + element.attr('dir')).toLowerCase() === 'rtl') {
                    return true;
                }

                var found = false;

                element.parents('[dir]').each(function() {
                    if ((/rtl/i).test($(this).attr('dir'))) {
                        found = true;
                        return false;
                    }
                });

                return found;
            }(this.$element));
        }

        if (this.options.rtl) {
            this.$element.addClass(namespace + '_rtl');
        }

        this.isMoving = false;
        this.type = this.options.type;

        if (typeof Carousel.types[this.type] === 'undefined') {
            return;
        }

        var self = this;
        $.extend(self, {
            trigger: function(eventType) {
                var method_arguments = Array.prototype.slice.call(arguments, 1),
                    data = method_arguments.concat([this]);

                // event
                this.$element.trigger( 'carousel::' + eventType, data);

                // callback
                eventType = eventType.replace(/\b\w+\b/g, function(word) {
                    return word.substring(0, 1).toUpperCase() + word.substring(1);
                });
                var onFunction = 'on' + eventType;
                if (typeof this.options[onFunction] === 'function') {
                    this.options[onFunction].apply(this, method_arguments);
                }
            },
            applyMethod: function(name) {
                var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [];
                if (typeof Carousel.types[this.type][name] === 'function') {
                    return Carousel.types[this.type][name].apply(self, method_arguments);
                }
            },
            prepare: function() {
                // json support
                if (typeof self.options.load === "function") {
                    self.options.load(self.loadCallback);
                } else {
                    self.init.call(self);
                }
            },
            loadCallback: function(data) {
                var items = '';
                $.each(data, function(i, n) {
                    items += self.options.render(n);
                });
                self.$ul.html(items);
                self.init.call(self);
            },
            init: function() {
                this.trigger('init');
                this.applyMethod('init');

                self.$items = self.$ul.children();
                self.total = self.$items.length;

                self.build();

                // Auto start
                if (self.options.autoplay) {
                    self.autoplay.enabled = true;
                    self.autoplay.start();
                }
                if (self.options.mousewheel || self.options.keyboard) {
                    self.$element.attr('tabindex', '0');
                }
                // Bind event
                self.$element.on('go', function(e, data) {
                    if (self.visibleNumber === self.total && typeof self.prevNumber === 'undefined') {
                        data.force = true;
                    }

                    if (typeof data.force === 'undefined' || data.force === false) {
                        if (self.isMoving) {
                            return;
                        }
                    }

                    self.applyMethod('go', data);
                });

                // responsive
                if (self.options.responsive) {
                    $(window).on("resize", this.resize);
                }

                this.trigger('ready');
            },
            build: function() {
                this.$ul.addClass(namespace + '-items');

                this.applyMethod('build');
            },
            resize: function() {
                if (self.isMoving) {
                    self.moveEnd();
                }

                self.trigger('resize');
                self.applyMethod('resize');

                self.$element.trigger('go', {
                    index: self.current,
                    force: true
                });
            },
            autoplay: {
                enabled: false,
                timeout: null,
                start: function() {
                    self.options.infinite = true;

                    if (this.timeout) {
                        clearTimeout(this.timeout);
                    }
                    this.timeout = setTimeout(function() {
                        self.go();
                    }, self.options.delay);
                },
                stop: function() {
                    clearTimeout(this.timeout);
                }
            },
            animate: function($el, properties, duration, easing, callback) {
                if (self.options.useCSS) {
                    window.setTimeout(function() {
                        self.insertRule('.duration_' + duration + ' {' + self.transition.prefix + 'transition-duration:' + duration + 'ms;}');

                        $el.addClass('duration_' + duration + ' easing_' + easing).one(self.transition.end, function() {
                            $el.removeClass('duration_' + duration + ' easing_' + easing);

                            callback.call(this);
                        });
                        $el.css(properties);
                    }, 10);
                } else {
                    $el.animate(properties, duration, easing, callback);
                }
            },
            move: function(distance, force, callback, duration) {
                var style = {};

                this.isMoving = true;

                this.moveEnd = function() {
                    if (typeof callback === 'function') {
                        callback.call(self);
                    }

                    if (self.autoplay.enabled) {
                        self.autoplay.start();
                    }
                    self.isMoving = false;

                    self.$element.trigger('moveEnd');
                };

                style[self.animateProperty] = -distance;

                if (force) {
                    this.$ul.css(style);
                    this.moveEnd();
                } else {
                    if (typeof duration === 'undefined') {
                        duration = self.options.speed;
                    }
                    duration = Math.ceil(duration);
                    this.animate(this.$ul, style, duration, self.options.easing, this.moveEnd);
                }
            },
            insertRule: function(rule) {
                if (self.rules && self.rules[rule]) {
                    return;
                } else if (self.rules === undefined) {
                    self.rules = {};
                } else {
                    self.rules[rule] = true;
                }

                if (document.styleSheets && document.styleSheets.length) {
                    document.styleSheets[0].insertRule(rule, 0);
                } else {
                    var style = document.createElement('style');
                    style.innerHTML = rule;
                    document.head.appendChild(style);
                }
            }
        });

        this.prepare(this);
    };

    // Default options for the plugin as a simple object
    Carousel.defaults = {
        namespace: 'carousel',
        type: 'basic',
        autoplay: true,
        infinite: false,
        lazyload: false,
        delay: 4000,
        speed: 1000,
        rtl: null,
        direction: 'right', //top, right, bottom, left
        pager: true, // Boolean: Show pager, true or false
        nav: true, // Boolean: Show navigation, true or false,
        navNumber: 1,
        prevText: "Previous", // String: Text for the "previous" button
        nextText: "Next", // String: Text for the "next" button

        render: function(item) {
            return '<li><img src="' + item.img + '" alt="" /></li>';
        },
        load: null,
        /* function(callback){},*/
        mousewheel: true,
        touch: true,
        keyboard: true,
        responsive: true,
        afterLazyLoad: false,

        useCSS: false,
        easing: 'linear',
    };

    Carousel.types = {};
    Carousel.registerType = function(name, type) {
        Carousel.types[name] = type;
    };

    var basic = {
        go: function(data) {
            var distance = 0,
                to;

            if (data.step) {
                to = this.current + data.step;

                if (to > this.total - this.visibleNumber) {
                    if (this.options.infinite && this.current === this.total - this.visibleNumber) {
                        to = 0;
                    } else {
                        to = this.total - this.visibleNumber;
                    }
                }
                if (to < 0) {
                    if (this.options.infinite && this.current === 0) {
                        to = this.total - this.visibleNumber;
                    } else {
                        to = 0;
                    }
                }
            } else if (typeof data.index !== 'undefined') {
                to = data.index;
                if (to > this.total - this.visibleNumber) {
                    to = this.total - this.visibleNumber;
                }
            }

            distance = this.itemSize * to;

            if (typeof data.duration === 'undefined') {
                data.duration = this.options.speed;
            }

            this.move(distance, data.force, function() {
                this.current = to;
            }, data.duration);
        },
        init: function() {
            var self = this;
            this.$element.on('touchend', function(e, data) {
                var step = Math.round(data.distance / self.itemSize);
                var to = data.current - step;

                if (to < 0) {
                    to = 0;
                } else if (to > self.total - self.visibleNumber) {
                    to = self.total - self.visibleNumber;
                }

                self.$element.trigger('go', {
                    index: to,
                    duration: self.options.speed / 2
                });
            });
        },
        build: function() {
            this.applyMethod('fillGutter');

            this.$ul.css(this.animateProperty, '0');
        },
        getCssVariables: function() {
            if (this.direction === "horizontal") {
                if (this.options.rtl) {
                    return {
                        'viewport': this.$element.width(),
                        'item': this.$items.outerWidth(),
                        'before': 'margin-left',
                        'after': 'margin-right',
                        'animate': 'right'
                    };
                } else {
                    return {
                        'viewport': this.$element.width(),
                        'item': this.$items.outerWidth(),
                        'before': 'margin-left',
                        'after': 'margin-right',
                        'animate': 'left'
                    };
                }

            } else {
                return {
                    'viewport': this.$element.height(),
                    'item': this.$items.outerHeight(),
                    'before': 'margin-top',
                    'after': 'margin-bottom',
                    'animate': 'top'
                };
            }
        },
        fillGutter: function() {
            var variables = this.applyMethod('getCssVariables');

            this.visibleNumber = Math.floor(variables.viewport / variables.item);
            if (this.visibleNumber === 0) {
                this.visibleNumber = 1;
            }
            if (this.total < this.visibleNumber) {
                this.visibleNumber = this.total;
            }

            if (this.navNumber > this.visibleNumber || this.navNumber === 0) {
                this.navNumber = this.visibleNumber;
            } else if (this.options.navNumber < this.visibleNumber) {
                this.navNumber = this.options.navNumber;
            }

            var gutterSize = Math.round(((variables.viewport / this.visibleNumber - variables.item) / 2)),
                styles = {};

            if (gutterSize < 0) {
                gutterSize = 0;
            }

            styles[variables.before] = gutterSize;
            styles[variables.after] = gutterSize;

            this.$items.css(styles);

            this.itemSize = variables.item + gutterSize * 2;
            this.viewportSize = variables.viewport;
            this.animateProperty = variables.animate;
        },
        resize: function() {
            this.applyMethod('fillGutter');
        }
    };

    Carousel.registerType('basic', basic);

    Carousel.registerType('circular', $.extend(true, {}, basic, {
        go: function(data) {
            var distance = 0,
                to,
                step;

            if (data.step) {
                step = data.step;
                to = this.current + data.step;

                if (to >= this.total) {
                    to -= this.total;
                }
                if (to < 0) {
                    to += this.total;
                }
            } else if (typeof data.index !== 'undefined') {
                to = data.index;
                step = to - this.current;
                if (step < -this.visibleNumber && this.current + this.visibleNumber >= this.total) {
                    step = to + this.total - this.current;
                }
            }

            this.applyMethod('allowance', step);

            distance = (to - this.prevNumber >= this.visibleNumber ? to - this.prevNumber : to + this.total - this.prevNumber) * this.itemSize;

            if (typeof data.duration === 'undefined') {
                data.duration = this.options.speed;
            }

            this.move(distance, data.force, function() {
                this.current = to;
            }, data.duration);
        },
        allowance: function(step) {
            var i,
                item,
                num,
                offsetPrev = this.prevNumber + this.visibleNumber,
                defaultContent = this.$defaultItems.clone(true),
                self = this,
                reset = function(number, step, total) {
                    number += step;
                    if (number >= total) {
                        number -= total;
                    } else if (number < 0) {
                        number += total;
                    }
                    return number;
                };
            if (offsetPrev >= this.total) {
                offsetPrev -= this.total;
            }
            if (step > 0) {
                var next_allowance = function(num) {
                    for (i = 0; i < num; i++) {
                        item = i + self.nextNumber;
                        if (item >= self.total) {
                            item -= self.total;
                        }
                        $(defaultContent[item]).appendTo(self.$ul);
                        self.$ul.children().first().remove();
                    }
                    self.nextNumber = reset(self.nextNumber, num, self.total);
                    self.prevNumber = reset(self.prevNumber, num, self.total);
                    self.$ul.css(self.animateProperty, -(self.current - self.prevNumber) * self.itemSize);
                };
                if (this.current + step >= this.total) {
                    num = (this.total - this.prevNumber > this.visibleNumber ? this.total - this.prevNumber - this.visibleNumber : this.visibleNumber);
                    next_allowance(num);
                } else if (offsetPrev + this.visibleNumber <= this.current + step) {
                    next_allowance(this.visibleNumber);
                }
            } else if (step < 0) {
                var prev_allowance = function(num) {
                    for (i = 0; i < num; i++) {
                        item = self.prevNumber - 1 - i;
                        if (item < 0) {
                            item += self.total;
                        }
                        $(defaultContent[item]).prependTo(self.$ul);
                        self.$ul.children().last().remove();
                    }
                    self.nextNumber = reset(self.nextNumber, -num, self.total);
                    self.prevNumber = reset(self.prevNumber, -num, self.total);
                    self.$ul.css(self.animateProperty, -(self.visibleNumber + num + self.current - offsetPrev) * self.itemSize);
                };
                if (offsetPrev > this.current + step) {
                    num = this.visibleNumber;
                    if (this.current + step < this.visibleNumber && this.current + step >= 0) {
                        num = this.visibleNumber - (this.total - this.prevNumber < this.visibleNumber ? this.total - this.prevNumber : 0);
                    }
                    prev_allowance(num);
                }
            }
        },
        init: function() {
            this.step = 0;
            var self = this;
            this.$element.on('touchmove', function(e, data) {
                var step = Math.round(data.distance / self.itemSize),
                    to = data.current - step,
                    num;

                while (to < 0) {
                    to += self.total;
                }
                while (to >= self.total) {
                    to -= self.total;
                }
                num = to - self.current;
                if (self.current - to === self.total - 1 && step < self.step) {
                    num = 1;
                } else if (to - self.current === self.total - 1 && step > self.step) {
                    num = -1;
                }

                if (num !== 0) {
                    var prevNumber = self.prevNumber,
                        size = self.viewportSize;
                    self.step = step;

                    self.applyMethod('allowance', num);

                    if (prevNumber !== self.prevNumber) {
                        if (num > 0 && to === 0) {
                            size = (self.total - self.visibleNumber - prevNumber) * self.itemSize;
                        }
                        if (num < 0) {
                            size = -size;
                            if (to < self.visibleNumber && to >= 0) {
                                size = -(self.visibleNumber - (self.total - prevNumber < self.visibleNumber ? self.total - prevNumber : 0)) * self.itemSize;
                            }
                        }

                        data.position += size;
                    } else if (self.total === self.visibleNumber) {
                        if (num > 0 && to % self.visibleNumber === 0) {
                            data.position += size;
                        }
                        if (to === self.visibleNumber - 1 && num < 0) {
                            data.position -= size;
                        }
                    }
                }
                self.current = to;
            }).on('touchend', function(e, data) {
                if (data.distance === 0) {
                    return;
                }
                var step = Math.round(data.distance / self.itemSize);
                var to = data.current - step;

                while (to < 0) {
                    to += self.total;
                }
                while (to >= self.total) {
                    to -= self.total;
                }
                self.step = 0;
                self.$element.trigger('go', {
                    index: to,
                    duration: self.options.speed / 2
                });
            });
        },
        build: function() {
            this.applyMethod('fillGutter');

            var i,
                $item;
            this.prevNumber = this.total - this.visibleNumber;
            this.nextNumber = this.visibleNumber + (this.total % this.visibleNumber === 0 ? 0 : this.visibleNumber - this.total % this.visibleNumber);
            for (i = 0; i < this.visibleNumber; i++) {
                $item = $(this.$items[this.total - i - 1]).clone(true);
                $item.prependTo(this.$ul);
            }
            for (i = 0; i < this.nextNumber; i++) {
                if (i >= this.total) {
                    this.nextNumber -= this.total;
                    i -= this.total;
                }
                $item = $(this.$items[i]).clone(true);
                $item.appendTo(this.$ul);
            }

            this.$defaultItems = this.$items;
            this.$items = this.$ul.children();
            this.$ul.css(this.animateProperty, -this.viewportSize);
        },
        resize: function() {
            var visibleNumber = this.visibleNumber;

            this.applyMethod('fillGutter');

            if (visibleNumber !== this.visibleNumber) {
                this.$ul.html(this.$defaultItems);
                this.$items = this.$defaultItems;
                this.applyMethod('build');
            }
        }
    }));

    Carousel.prototype = {
        constructor: Carousel,
        next: function(number) {
            if (typeof number === 'undefined' || (number === 0 || number > this.navNumber)) {
                number = this.navNumber;
            }
            this.$element.trigger('go', {
                step: number
            });
        },
        prev: function(number) {
            if (typeof number === 'undefined' || (number === 0 || number > this.navNumber)) {
                number = this.navNumber;
            }
            this.$element.trigger('go', {
                step: -number
            });
        },
        go: function() {
            if ((this.options.direction === 'right') || (this.options.direction === 'bottom')) {
                this.next();
            }
            if ((this.options.direction === 'left') || (this.options.direction === 'top')) {
                this.prev();
            }
        },
        goTo: function(index) {
            this.$element.trigger('go', {
                index: index
            });
        },
        play: function() {
            this.autoplay.enabled = true;
            this.autoplay.start();
        },
        pause: function() {
            this.autoplay.stop();
        },
        stop: function() {
            this.autoplay.enabled = false;
            this.autoplay.stop();
        },
        destroy: function() {
            this.$trigger.remove();
            this.$element.data('carousel', null);
        }
    };

    // Collection method.
    $.fn.carousel = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = Array.prototype.slice.call(arguments, 1);

            return this.each(function() {
                var api = $.data(this, 'carousel');

                if (api && typeof api[method] === 'function') {
                    api[method].apply(api, method_arguments);
                }
            });
        } else {
            return this.each(function() {
                if (!$.data(this, 'carousel')) {
                    $.data(this, 'carousel', new Carousel(this, options));
                }
            });
        }
    };
}(window, document, jQuery));
