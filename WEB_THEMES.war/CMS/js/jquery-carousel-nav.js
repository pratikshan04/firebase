(function(window, document, $, undefined) {
    var Nav = function(api) {
        return {
            setup: function() {
                var namespace = api.options.namespace;

                this.$nav = $('<div class="' + namespace + '-nav">' + '<a href="#" class="' + namespace + '-nav-prev">' + api.options.prevText +
                    '</a>' + '<a href="#" class="' + namespace + '-nav-next">' + api.options.nextText + '</a>' + '</div>');

                this.$nav.appendTo(api.$wrap);

                this.$nav.on("click", 'a', function() {
                    if ($(this).is('.' + namespace + '-nav-prev')) {
                        api.prev();
                    } else {
                        api.next();
                    }
                    return false;
                });
            }
        };
    };
    $(document).on('carousel::ready', function(event, instance) {
        if (instance.options.nav === true) {
            var nav = Nav(instance);

            nav.setup();
        }
    });
})(window, document, jQuery);
