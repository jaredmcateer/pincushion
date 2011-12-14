(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
               'pincushion/collection/Pin', 
               'pincushion/view/Pin', 
               'text!pincushion/templates/cushion.html',
               'jquery', 
               'underscore', 
               'backbone'
        ], factory);
    } else {
        var cushionTemplate,
            pc = root.PINCUSHION;

        $.ajax({
            url: 'pincushion/templates/cushion.html',
            asynx: false,
            success: function (response) {
                cushionTemplate = response;
            }
        });

        root.PinView = factory(pc.collection.Pin, pc.view.Pin, cushionTemplate, $, _, Backbone);
    }
    
}(this, function (PinCollection, PinView, cushionTemplate, $, _, Backbone) {
    return Backbone.View.extend({
        template: _(cushionTemplate).template(),
        events: {
            'click .pin-cushion': 'focusSearch',
            'keypress .pin-search': 'addPinOnEnter'
        },

        initialize: function () {
            if (!this.options.initialPins) {
              this.options.initialPins = [];
            }
            this.pins = new PinCollection(this.options.initialPins);

            this.pins.bind('add', this.refresh, this);
            this.pins.bind('change:pinned', this.refresh, this);

            this.refresh();
        },

        refresh: function() {
            var template = this.template({id: this.id}),
                cushion = $('#' + this.id);

            if (cushion.length > 0) {
                cushion.replaceWith(template);
            } else {
                $(this.el).append(this.template({
                    id: this.id
                }));
            }
            this.input = this.$('.pin-search input');
            this.render();
        },

        addPin: function (pin) {
            var pinview,
                pinEl;

            if (pin.get('pinned') === true) {
                pinview = new PinView({model: pin});
                this.$('.pin-list .pin-search').before(pinview.render().el);
            }
        },

        render: function () {
            _(this.pins.models).each(_(function(pin) {
                this.addPin(pin);
            }).bind(this));
        },

        addPinOnEnter: function (e) {
            var text = this.input.val();

            if (!text || e.keyCode !== 13) { 
                return;
            }

            _(this.pins.models).each(function (pin) {
                if (pin.get('label').toLowerCase() === text.toLowerCase()) {
                    pin.set({'pinned': true}); 
                }
            });

            this.input.val('');
        },

        focusSearch: function (e) {

            this.input.focus();
        }
    });
}));
