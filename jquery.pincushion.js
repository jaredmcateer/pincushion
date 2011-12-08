(function ($, _) {
    'use strict';
    $.fn.pinCushion = function () {
        this.each(function () {
            $.pinCushion({element: $(this)});
        });
    };

    $.pinCushion = function (options) {
        var data = [],
            itemList,
            el = options.element;
                
        if (!options.id && !el) {
            options.id = _.uniqueId('cushion-');
        }

        if (!options.parent) {
            options.parent = $('body');
        }

        if (!options.data && el instanceof jQuery) {
            options.id = 'cushion-' + el.attr('id');
            options.parent = el.parent();
            _(el.find('option')).each(function(item) {
                item = $(item);
                data.push({
                    value: item.val(),
                    label: item.text(),
                    required: item.hasClass('required'),
                    pinned: item.hasClass('required') || item.hasClass('pinned')
                });
            });
        }

        var obj = new PINC.CushionView({id: options.id, el: options.parent, initialPins: data});

        if (el instanceof jQuery) {
            el.replaceWith($('#' + options.id));
        }
    };
}(jQuery, _));
