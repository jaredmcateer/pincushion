(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['pincushion/model/Pin', 'backbone'], factory);
    } else {
        root.PinCollection = factory(namespace.PinModel);
    }
}(this, function (Pin, Backbone) {
    return Backbone.Collection.extend({
        model: Pin,
        /**
         * Comparator
         *
         * Sorts pins by required flag first and then alphabetically
         */
        comparator: function (pin) {
            return (pin.get('required') ? "0" : '1') + pin.get('value');
        }
    });
}));
