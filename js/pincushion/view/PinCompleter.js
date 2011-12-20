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
            this.cachedSearch = {};

            this.pins = this.options.pins;
            this.pins.bind('change:pinned', this.hideCompleter, this);

            if (this.options.fetchPins) { 
                this.fetchPinsHandler = this.options.fetchPins;
            }

            if (this.options.addPin) {
                this.addPin = this.options.addPin;
            }

            this.render();
        },

        fetchPinsHandler: function () {
            this.suggest();
        },

        render: function () {
            this.suggestions = [];
            $(this.el).append(this.template());
            this.input = this.$('.pin-search');
        },

        handleKeys: function (e) {
            if (e.keyCode === 13) { 
                this.handleEnter();
            } else if (e.keyCode === this.KEY_UP || e.keyCode === this.KEY_DOWN) {
                this.handleArrows(e.keyCode);
            } else {
                this.handleTextInput(_.bind(this.fetchPinsHandler, this));
            }
        },

        handleTextInput: _.debounce(function (callback) {
            callback();
        }, 250),

        handleEnter: function () {
            var text = this.input.val(),
                currentSelection = this.$('.currentSelection').text(),
                foundPin = false,
                removeClass;
            
            foundPin = this.addPin(text, currentSelection);

            if (!foundPin) {
                removeClass = _(function () {
                    this.input.removeClass('inputError');
                }).bind(this);

                this.input.addClass('inputError');

                _(removeClass).delay(1000);
            }

            this.input.val('');
        },

        addPin: function (label, currentSelection) {
            var foundPin = false;

            if (currentSelection !== '') {
                label = currentSelection; 
            }

            _(this.pins.models).each(function (pin) {
                if (pin.get('label').toLowerCase() === label.toLowerCase()) {
                    pin.set({'pinned': true}); 
                    foundPin = true;
                }
            });

            return foundPin;
        },

        handleArrows: function (direction) {
            var delta = direction - 39,
                suggestions = this.$('.pin-suggestion'),
                currentSelection = this.$('.currentSelection'),
                index = suggestions.index(currentSelection),
                newSuggestion;

            if (index + delta <= 0) {
                this.suggestions[0].toggleSelected(true);
            } else if (index + delta >= this.suggestions.length) {
                this.suggestions[suggestions.length - 1].toggleSelected(true);
            } else {
                this.suggestions[index + delta].toggleSelected(true);
            }
        }, 

        suggest: function () {
            var text = this.input.val(),
                completerList = this.$('.pin-completer-list'),
                addSuggestion = _(function (suggestion) {
                    var suggestView = new SuggestionView({model:suggestion});
                    completerList.find('ul').append(suggestView.render(text).el);
                    this.suggestions.push(suggestView);
                }).bind(this),
                suggestions;

            this.suggestions = [];

            if (!text || text.length < 3) { 
                this.hideCompleter();
                return;
            }

            completerList.html('<ul></ul>');
            
            suggestions = this.filterModels(text);
            if (suggestions.length > 0) {
                _(suggestions).each(addSuggestion);
            } else {
                completerList.append('No suggestions found');
            }

            this.showCompleter();
        },

        filterModels: function (text) {
            text = text.toLowerCase();
            return this.pins.filter(function (pin) {
                return (pin.get('pinned') === false && pin.get('label').toLowerCase().indexOf(text) >= 0);
            });
        },

        hideCompleter: _(function () {
            if (this.$('.pin-completer-list').is(':visible')) {
                this.$('.pin-completer-list').removeClass('show');
            }
        }).debounce(250),

        showCompleter: function () {
            this.$('.pin-completer-list').addClass('show');
        }
    });
}));
