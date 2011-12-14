(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'pincushion/model/Pin',
            'pincushion/collection/Pin',
            'pincushion/view/Pin',
            'pincushion/view/Cushion'
        ], factory); 

    } else {
        root.PINCUSHION = factory(root.PinModel, root.PinCollection, root.PinView, root.CushionView);
    }

}(this, function (PinModel, PinCollection, PinView, CushionView) {
    return {
        model: {
            Pin: function (options) {
                return PinModel.create(options);
            }
        },
        collection: {
            Pin: function (options) { 
                return new PinCollection(options);
            }
        },
        view: {
            Pin: function(options) {
                return new PinView(options);
            },
            Cushion: function (options) {
                return new CushionView(options);
            }
        }
    };
}));

