require.config({
    paths: {
        'jquery'     : 'vendor/jquery/jquery-1.7.1',
        'underscore' : 'vendor/underscore/underscore-1.2.2',
        'backbone'   : 'vendor/backbone/backbone-optamd-0.5.3'
    }
});
require([
        'jquery',
        'pincushion/jquery.pincushion'
], function () {
    $(function() {
        $('#test').pinCushion();

        $.pinCushion({data: [
             {label: 'label 1', value: 1, required: false, pinned: false},
             {label: 'label 2', value: 'test', required: true, pinned: true},
             {label: 'label 3', value: false, required: false, pinned: true}
        ]});
    });
});

