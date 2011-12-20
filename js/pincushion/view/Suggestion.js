(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'pincushion/model/Pin',
            'jquery',
            'underscore',
            'backbone'
        ], factory);
    } else {
        var pc = root.PINCUSHION;

        root.SuggestionView = factory(pc.model.Pin, $, _, Backbone);
    }
}(this, function (PinModel, $, _ , Backbone) {
    'use strict';
    return Backbone.View.extend({
        tagName: 'li',
        className: 'pin-suggestion',
        events: {
            'click': 'selectSuggestion',
            'mouseover': 'handleMouse',
            'mouseout': 'handleMouse'
        },

        initialize: function () {
            this.selected = false;
        },

        selectSuggestion: function () {
            this.model.set({'pinned': true});
        },

        handleMouse: function (e) {
            if (e.type === 'mouseover') {
                this.toggleSelected(true);              
            } else {
                this.toggleSelected(false);
            }
        },

        toggleSelected: function (selected) {
            if (selected) {
                $(this.el).addClass('currentSelection')
                          .siblings().removeClass('currentSelection');
            } else {
                $(this.el).removeClass('currentSelection');
            }
        },

        render: function (matchedText, selected) {
            var label = this.model.get('label'),
                listItem = $(this.el),
                re = new RegExp('(' + matchedText + ')', 'gi');

            label = label.replace(re, '<span class="matchedText">$1</span>');
            
            listItem.html(label);

            if (selected) {
                listItem.addClass('current');
            }

            return this;
        }
    });
}));
