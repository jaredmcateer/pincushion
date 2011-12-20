(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['pincushion/model/Pin', 'backbone', 'underscore'], factory);
    } else {
        root.PinCollection = factory(namespace.PinModel);
    }
}(this, function (Pin, Backbone, _) {
    return Backbone.Collection.extend({
        model: Pin,
        /**
         * Comparator
         *
         * Sorts pins by required flag first and then alphabetically
         */
        comparator: function (pin) {
            return (pin.get('required') ? "0" : '1') + pin.get('value');
        },

        append: function (models, options) {
            var duplicates,
                findDuplicates,
                i,
                l;
            
            // array-ify model if it's by itself
            if (! _.isArray(models)) { models = [models]; }

            // function to find models with the same label
            findDuplicates = function (_model) {
                return model.get('label') === _model.get('label');
            };

            // loop through new models and add if not a duplicate
            for (i = 0, l = models.length; i < l; i++) {
                model = this._prepareModel(models[i]);

                if (model && _.isEmpty(this.filter(findDuplicates))) {
                    this.add(model, options);
                }
            }
        }
    });
}));
