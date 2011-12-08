var PINC = {};
var context = this;
(function(ps) {
    'use strict';
    Backbone.sync = function (method, model, success, error) {
        return true;
    };

    ps.Pin = Backbone.Model.extend({
        defaults: {
            pinned: false,
            selected: false,
            required: false,
            value: ''
        }
    });
    ps.PinList = Backbone.Collection.extend({
        model: ps.Pin,
        comparator: function (pin) {
            return (pin.get('required') ? "0" : '1') + pin.get('value');
        }
    });
    ps.PinView = Backbone.View.extend({
        tagName: 'li',
        className: 'pin',
        template: _($('#pin-template').html()).template(),
        events: { 
            'click .remove': 'removePin',
            'click': 'selectPin'
        },
        render: function () {
            $(this.el).html(this.template(this.model.toJSON()));
            if (this.model.get('required')) {
                $(this.el).addClass('required');
            }

            this.setText();
            return this;
        },
        setText: function () {
            var text = this.model.get('text');
            this.$('.pin-label').text(text);
        }, 
        removePin: function () {
            this.set('pinned', false);
            $(this.el).remove();
        },
        selectPin: function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            if (!this.model.get('required')) {
                $(this.el).toggleClass('selected');   

                if (!this.model.get('selected')) {
                    this.model.set('selected', true);
                } else {
                    this.model.set('selected', false);
                }
            }
        }
    });

    ps.CushionView = Backbone.View.extend({
        template: _($('#pin-cushion-template').html()).template(),
        events: {
            'click .pin-cushion': 'focusSearch',
            'keypress .pin-search': 'addPinOnEnter'
        },

        initialize: function () {
            if (!this.options.initialPins) {
              this.options.initialPins = [];
            }
            this.pins = new ps.PinList(this.options.initialPins);

            this.pins.bind('add', this.addPin, this);
            this.pins.bind('change:pinned', this.addPin, this);

            $(this.el).append(this.template({
                id: this.id
            }));
            this.input = this.$('.pin-search input');
            this.render();
        },

        addPin: function (pin) {
            var pinview;

            if (pin.get('pinned') === true) {
                pinview = new ps.PinView({model: pin});
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

            this.pins.add([{label: text, pinned: true}]);

            this.input.val('');
        },

        focusSearch: function (e) {

            this.input.focus();
        }
    });
}).call(context, PINC);