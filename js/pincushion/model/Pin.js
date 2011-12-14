(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['backbone'], factory);
    } else {
        root.PinModel = factory();
    }
}(this, function (Backbone) {
    'use strict';
    return Backbone.Model.extend({
        defaults: {
            pinned: false,
            selected: false,
            required: false,
            value: ''
        }
    });
}));
