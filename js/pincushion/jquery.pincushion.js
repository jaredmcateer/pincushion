(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD, Register as an anonymous module
        define(['jquery', 'underscore', 'pincushion/widget'], factory);
    } else {
        // Browser Globals
        factory(jQuery, _, root.PINCUSHION);
    }
}(this, function ($, _, pincushion) {
    'use strict';

    /**
     * Element plugin
     *
     * e.g., $('select').pinCushion();
     */
    $.fn.pinCushion = function () {
        this.each(function () {
            $.pinCushion({element: $(this)});
        });
    };

    /**
     * $ Function extension
     *
     * e.g., $.pinCushion({element: $('#someSelectEl').get(0)});
     */
    $.pinCushion = function (options) {
        var data = [],
            itemList,
            el = options.element,
            state;
                
        if (!options.id && !el) {
            options.id = _.uniqueId('cushion-');
        }

        if (!options.parent) {
            options.parent = $('body');
        }

        if (!options.data && el instanceof $) {
            options.id = 'cushion-' + el.attr('id');
            options.parent = el.parent();
            _(el.find('option')).each(function(item) {
                item = $(item);
                state = item.attr('data-state');
                data.push({
                    value: item.val(),
                    label: item.text(),
                    required: (state === 'required'),
                    pinned: (state  === 'required' || state === 'pinned')
                });
            });
        }

        pincushion.view.Cushion({id: options.id, el: options.parent, initialPins: data});

        // Replace select element with pin cushion
        if (el instanceof $) {
            el.replaceWith($('#' + options.id));
        }
    };
}));
