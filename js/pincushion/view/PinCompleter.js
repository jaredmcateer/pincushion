(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'pincushion/collection/Pin',
            'pincushion/view/Suggestion',
            'text!pincushion/templates/pinCompleter.html',
            'jquery',
            'underscore',
            'backbone'
        ], factory);
    } else {
        var acTemplate,
            pc = root.PINCUSHION;

        $.ajax({
            url: root.PINCUSHION.BaseUrl + 'pincushion/templates/autocompleter.html',
            async: false,
            success: function (response) {
                acTemplate = response;
            }
        });

        root.PinCompleterView = factory(pc.collection.Pin, pc.view.Suggestion, acTemplate, $, _, Backbone);
    }
}(this, function (PinCollection, SuggestionView, acTemplate, $, _ , Backbone) {
    'use strict';
    return Backbone.View.extend({
        KEY_UP: 38,
        KEY_DOWN: 40,
        template: _(acTemplate).template(),
        tagName: 'li',
        className: 'pin-completer',
        events: {
            'keyup .pin-search': 'handleKeys',
            'blur .pin-search': 'hideCompleter',
            'focus .pin-search': 'suggest'
        },

        initialize: function () {
            this.pins = this.options.pins;
            this.pins.bind('change:pinned', this.hideCompleter, this);
            this.render();
        },

        render: function () {
            $(this.el).append(this.template());
            this.input = this.$('.pin-search');
        },

        handleKeys: function (e) {
            if (e.keyCode === 13) { 
                this.handleEnter();
            } else if (e.keyCode === this.KEY_UP || e.keyCode === this.KEY_DOWN) {
                this.handleArrows(e.keyCode);
            } else {
                this.suggest();
            }
        },

        handleEnter: function () {
            var text = this.input.val(),
                foundPin = false,
                removeClass;

            if (text !== '') { 
                _(this.pins.models).each(function (pin) {
                    if (pin.get('label').toLowerCase() === text.toLowerCase()) {
                        pin.set({'pinned': true}); 
                        foundPin = true;
                    }
                });
            }

            if (!foundPin) {
                removeClass = function () {
                    $(this).removeClass('inputError');
                };

                this.input.addClass('inputError')
                          .delay(1000)
                          .queue(removeClass);
            }

            this.input.val('');
        },

        handleArrows: function (direction) {
            var delta = direction - 39,
                suggestions = this.$('.pin-suggestion'),
                currentSelection = this.$('.currentSelection'),
                index = suggestions.index(currentSelection),
                newSelection;

            if (index + delta <= 0) {
                newSelection =  $(suggestions.get(0));
            } else if (index + delta >= suggestions.length) {
                newSelection = $(suggestions.get(suggestions.length - 1));
            } else {
                newSelection = $(suggestions.get(index + delta));
            }

            currentSelection.removeClass('currentSelection');
            newSelection.addClass('currentSelection');
        }, 

        suggest: function () {
            var text = this.input.val(),
                completerList = this.$('.pin-completer-list'),
                addSuggestion = function (suggestion) {
                    var suggestView = new SuggestionView({model:suggestion});
                    completerList.append(suggestView.render(text).el);
                },
                suggestions;

            if (!text || text.length < 3) { 
                this.hideCompleter();
                return;
            }

            completerList.html('');
            
            suggestions = this.filterModels(text);
            if (suggestions.length > 0) {
                _(suggestions).each(addSuggestion);
            } else {
                completerList.append('No suggestions found');
            }

            this.showCompleter();
        },

        filterModels: function (text) {
            return this.pins.filter(function (pin) {
                return (pin.get('pinned') === false && pin.get('label').indexOf(text) >= 0);
            });
        },

        hideCompleter: function () {
            this.$('.pin-completer-list').hide();
        },

        showCompleter: function () {
            this.$('.pin-completer-list').fadeIn(200);
        }
    });
}));
