'use strict';
$(document).ready(function() {
    module('Pins.convert');
    test('Test Invalid Parameter', function () {
        var div = document.createElement('div'),
            arr = [],
            obj = {},
            str = '',
            num = 2,
            bln = true;
        equals(PSEL.convert(div), false, 'Pins should silently fail when passed an invalid element');
        equals(PSEL.convert(arr), false, 'Pins should silently fail when passed an array');
        equals(PSEL.convert(obj), false, 'Pins should silently fail when passed an object');
        equals(PSEL.convert(str), false, 'Pins should silently fail when passed an string');
        equals(PSEL.convert(num), false, 'Pins should silently fail when passed an number');
        equals(PSEL.convert(bln), false, 'Pins should silently fail when passed an boolean');
    });

    test('Test Valid Parameter', function () {
        var select = document.createElement('select');
        equals(PSEL.convert(select), true, 'Pins should return true after initializing a select element');
    });

    test('Test Pins converted widget', function() {
        var select = document.createElement('select'),
            options = [
                {
                    value: 1,
                    label: 'Test1',
                    selected: true
                },
                {
                    value: 2,
                    label: 'Test2',
                    selected: false
                },
                {
                    value: 3,
                    label: 'Test3',
                    selected: false
                }
            ],
            option;

        for (var i = 0; i < 3; i++) {
            option = document.createElement('option');
            option.value = options[i].value;
            option.appendChild(document.createTextNode(options[i].label));
            if (options[i].selected) {
                option.selected = true;
            }

            select.appendChild(option);
        }

        select.id = 'test';
        document.getElementById('qunit-fixture').appendChild(select);

        PSEL.convert(select);

        var p = document.getElementById('pins-test');
        var list = (p && p.firstChild) || null;
        var items = (list && list.childNodes) || [];
        console.log(items);

        equals(p.nodeName, 'DIV', 'Pins should convert select to div');
        equals(list.nodeName, 'UL', 'Pins first child should be an unorded list');
        equals(items.length, 2, 'There should be two items in the selected list');
        ok(items[0].className.indexOf('pin') >= 0, 'There first item should have a class of "pin".');
        
    });

    test('Test Pins convert select', function() {
        
    });
});
