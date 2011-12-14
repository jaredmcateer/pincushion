(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'text!pincushion/templates/pin.html',
            'backbone',
            'underscore',
            'jquery'
        ], factory);
    } else {
        var template;

        $.ajax({
            url: 'pincushion/templates/pin.html',
            asynx: false,
            success: function (response) {
                templateText = response;
            }
        });
        
        root.PinView = factory($, _, templateText);
    }
    
}(this, function (pinTemplate, Backbone, _, $) {
    return Backbone.View.extend({
        tagName: 'li',
        className: 'pin',
        template: _(pinTemplate).template(),
        events: { 
            'click .remove': 'removePin',
            'click': 'selectPin'
        },
        render: function () {
            $(this.el).html(this.template(this.model.toJSON()));
            if (this.model.get('required')) {
                $(this.el).addClass('required');
            }

            if (this.model.get('selected')) {
                $(this.el).addClass('selected');
            }

            this.setText();
            return this;
        },
        setText: function () {
            var text = this.model.get('text');
            this.$('.pin-label').text(text);
        }, 
        removePin: function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            this.model.set({'pinned': false});
            $(this.el).remove();
            return false;
        },
        selectPin: function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            if (!this.model.get('required')) {
                $(this.el).toggleClass('selected');   

                if (!this.model.get('selected')) {
                    this.model.set({'selected': true});
                } else {
                    this.model.set({'selected': false});
                }
            }
        }
    });
}));
