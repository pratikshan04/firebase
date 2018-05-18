(function(window, document, $, undefined) {
    var Lazyload = function(api) {
        return {
            setup: function() {
                var self = this;
                api.$items.each(function() {
                    var $item = $(this),
                        $img = $item.find('img[data-lazyload="true"]');

                    if ($img.length) {
                        $item.addClass(api.options.namespace + '_loading');
                        self.preload($item, $img, $img.length);
                    }
                });
            },
            preload: function($item, $imgs, length) {
                var count = 0;
                var self = this;
                $imgs.each(function() {
                    var $img = $(this);

                    var loaded = function() {
                        count++;
                        if (count === length) {
                            $item.removeClass(api.options.namespace + '_loading');
                        }
                        $img.data('lazyload', 'loaded');

                        $img.removeAttr("data-src");

                        if (typeof api.options.afterLazyLoad === "function") {
                            api.options.afterLazyLoad.apply(this, [api.$element]);
                        }
                    };

                    if (typeof $img.data('src') !== 'string') {
                        loaded();
                    } else if (self.isCompleted(this)) {
                        loaded();
                    } else {
                        $img.on('load error', function(e) {
                            loaded();

                            $img.unbind('load error');
                        });
                        this.src = $(this).data("src");
                    }

                });
            },
            isCompleted: function(img) {
                if (!img.complete) {
                    return false;
                }
                if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
                    return false;
                }
                return true;
            }
        };
    };
    $(document).on('carousel::ready', function(event, instance) {
        if (instance.options.lazyload === true) {
            var lazyload = new Lazyload(instance);

            lazyload.setup();
        }
    });
})(window, document, jQuery);
