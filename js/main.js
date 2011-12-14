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
    });
});

