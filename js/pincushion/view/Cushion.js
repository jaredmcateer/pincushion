(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
               'pincushion/collection/Pin', 
               'pincushion/view/Pin', 
               'pincushion/view/PinCompleter', 
               'text!pincushion/templates/cushion.html',
               'jquery', 
               'underscore', 
               'backbone'
        ], factory);
    } else {
        var cushionTemplate,
            pc = root.PINCUSHION;

        $.ajax({
            url: root.PINCUSHION.BaseUrl + 'pincushion/templates/cushion.html',
            asynx: false,
            success: function (response) {
                cushionTemplate = response;
            }
        });

        root.PinView = factory(pc.collection.Pin, pc.view.Pin, pc.view.PinCompleter, cushionTemplate, $, _, Backbone);
    }
    
}(this, function (PinCollection, PinView, PinCompleterView, cushionTemplate, $, _, Backbone) {
    'use strict';
    return Backbone.View.extend({
        template: _(cushionTemplate).template(),
        className: 'pin-cushion',
        events: {
            'click': 'focusSearch'
        },

        initialize: function () {
            if (!this.options.data) {
              this.options.data = [];
            }
            this.pins = new PinCollection(this.options.data);

            this.pins.bind('add', this.refresh, this);
            this.pins.bind('change:pinned', this.refresh, this);

            this.parent = this.options.parentEl || $(document.body);

            this.render();
        },

        render: function() {
            var template = this.template({id: this.id}),
                completerView = new PinCompleterView({
                    pins: this.pins, 
                    fetchPins: this.options.fetchPins, 
                    addPin: this.options.addPin
                });

            $(this.el).html(this.template({ id: this.id }));
            
            if ($('#' + this.id).length <= 0) {
                this.parent.append(this.el);
            }

            this.$('ul').append(completerView.el);

            _(this.pins.models).each(_(function(pin) {
                this.addPin(pin);
            }).bind(this));
        },

        addPin: function (pin) {
            var pinview,
                pinEl;

            if (pin.get('pinned') === true) {
                pinview = new PinView({model: pin});
                this.$('.pin-list .pin-completer').before(pinview.render().el);
            }
        },

        refresh: function () {
            this.render();
            this.focusSearch();
        },

        focusSearch: function (e) {
            this.$('.pin-search').focus();
        }
    });
}));
