require.config({
    paths: {
        'jquery'     : 'vendor/jquery/jquery-1.7.1',
        'underscore' : 'vendor/underscore/underscore-1.2.2',
        'backbone'   : 'vendor/backbone/backbone-optamd-0.5.3'
    }
});
require([
        'underscore',
        'jquery',
        'pincushion/jquery.pincushion'
], function (_) {
    $(function() {
        var fetchPins = function () {
            var matchTerm = this.input.val().substring(0,3).toLowerCase();

            if (matchTerm.length === 3 && !this.cachedSearch[matchTerm]) {
                $.ajax({ 
                    url: 'fetchPinsDemo.php',
                    dataType: 'json',
                    type: 'GET',
                    data: {matchTerm: this.input.val()},
                    success: _.bind(function(data) {
                        this.cachedSearch[matchTerm] = true;
                        this.pins.append(data, {silent: true});
                        this.suggest();
                    }, this)
                });
            } else {
                this.suggest();
            }
        };

        $('#test').pinCushion();

        $.pinCushion({fetchPins: fetchPins});

    });
});

