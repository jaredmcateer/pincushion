# Pin Cushion #

Pin Cushion is a multi-select widget that gives you a flowing list of objects pinned to a cushion. Heavily inspired by [Chosen](http://harvesthq.github.com/chosen/) this widget aims to solve a more specific use case.

Pin Cushion uses [Backbone](http://documentcloud.github.com/backbone), [underscore](http://documentcloud.github.com/underscore/), [jQuery](http://jquery.com/) and optionally an AMD library such as [RequireJS](http://requirejs.org/). This version of the widget makes the assumption you're building a webapp for a modern browser and the demo makes heavy use of CSS3 for transitions and effects. This isn't a requirement but it's up to you to make the changes necessary to have it look pretty in older browsers. The CSS is built using [SASS](http://sass-lang.com/) any contributions to the CSS should be done through the `scss` file.

If you're using an AMD such as RequireJS you can simply import `pincushion/widget` into your module and call `whateverYouNamedMe.view.cushion(options);`. If you're not using an AMD then you can access the widget through a global variable `window.PINCUSHION.view.cushion(options);`.

## Options ##

The following options are provided to the widget through the cushion view. All options are optional, all attributes of the objects in the `data` array are mandatory, however.

* `data` - an array of object literals that contain the following key/values
    - `label` - String. The unique pin label to display and suggest autocompletion
    - `value` - String. If you wish to assign some non-semantic meantion to the pin it can be done so with the value attribute
    - `pinned` - Boolean. If true the pin is displayed in the cushion. It is selectable and removable
    - `required` - Boolean. If true the pin is displayed in the cushion. It cannot be selected nor removed
* `parentEl` - jQuery Object. This is the element that the cushion is initially appended to. Default: body
* `fetchPins` -  Function. If provided this overrides the logic for suggesting pins.
* `addPin` - Function. If provided this overrides the logic for adding pins to the cushion.


## jQuery Plugin ##

There is also an optional jQuery plugin that allows you to easily create cushions either by replacing an existing Select element or by defining your own pins through an ajax call or hard coding directly into the plugin call.

When replacing a select element the pin cushion will use the options for labels, values and `data-state`. The `data-state` attribute can be either `pinned` or `required`. `pinned` merely sets the pin state to be added to the cushion by default, the `required` state of the pin means that the pin is added to the cushion by default and cannot be removed. The following script demonstrates a pincushion using the element plugin functionality of pin cushion. It will create a pin cushion, using the `option` elements for their Pin model data and replace the select element in the dom with the newly created widget.

    <select>
        <option value="1" data-state="pinned">Default 1</option>
        <option value="2" data-state="required'>Required 1</option>
        <option vlaue="3" data-state="pinned">Default 2</option>
        <option value="4">Option 1</option>
        <option value="5">Option 2</option>
    </select>
    
    <script>
        $(document).ready(function () {
            $('select').pinCushion();
        });
    </script>

The following is a similar pin cushion except using the jquery function plugin that uses an object literal in place of the select element.

    <div id="container"><div>

    <script>
        $(document.ready(function () {
            $.pinCushion({
                data: [
                    {label: 'Default 1', value: '1', pinned: true, required: false},
                    {label: 'Required 1', value:'2', pinned: false, required: false},
                    {label: 'Default 2', value: '3', pinned: true, required: false},
                    {label: 'Option 1', value: '4', pinned: false, required: false},
                    {label: 'Option 2', value: '5', pinned: false, required: false},
                ],
                parentEl: $('#container')
            });
        });
    </script>

### Additional Options ###

In addition to all the standard options the jQuery function plugin, `$.pinCushion();`, takes and additional option which is `element` which is the select element to be replaced. The jQuery element plugin, `$('selector').pinCushion();` adds this parameter automatically. 

If you define the `parentEl` option, instead of replacing the element defined in the `element` attribute the `element` will be removed and the pincushion appended to the `parentEl` element.
