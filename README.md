[![Troopers](https://cloud.githubusercontent.com/assets/618536/18787530/83cf424e-81a3-11e6-8f66-cde3ec5fa82a.png)](http://troopers.agency/?utm_source=AjaxBundle&utm_medium=github&utm_campaign=OpenSource)

[![License](https://img.shields.io/packagist/l/troopers/ajax-bundle.svg)](https://packagist.org/packages/troopers/ajax-bundle)
[![Version](https://img.shields.io/packagist/v/troopers/ajax-bundle.svg)](https://packagist.org/packages/troopers/ajax-bundle)
[![Packagist DL](https://img.shields.io/packagist/dt/troopers/ajax-bundle.svg)](https://packagist.org/packages/troopers/ajax-bundle)
[![SensioLabsInsight](https://insight.sensiolabs.com/projects/0c7ec932-671e-4bd1-8ecd-3d3a6c015909/mini.png)](https://insight.sensiolabs.com/projects/0c7ec932-671e-4bd1-8ecd-3d3a6c015909)
[![Twitter Follow](https://img.shields.io/twitter/follow/troopersagency.svg?style=social&label=Follow%20Troopers)](https://twitter.com/troopersagency)
=============

TroopersAjaxBundle
============

## Description

This bundle offers a simple structure to run ajax actions.
For each kind of action (link or form), you have to add a data-toggle="ajax" to the tag ( **a**, **form** ) and to specify the id of the container to update in the update attribute.

## Installation

With Composer :


Add this line in your composer.json file :

    "troopers/ajax-bundle": "dev-master"

Declare the bundle in your AppKernel.php:

    public function registerBundles() {
        $bundles = array(
            [...]
            new Troopers\AjaxBundle\TroopersAjaxBundle(),
            [...]

## Configuration

### AsseticInjectorBundle way

If You have installed our [AsseticInjectorBundle](https://github.com/Troopers/AsseticInjectorBundle/edit/master/README.md) bundle:

1. Thank you, you are awesome for us ;)
2. It may "just work" but if not, you'll have to check the injector tags in your javascript (`injector="foot"`) and stylesheet (`injector="head"`) blocks.

### The `normal` way

Just load `ajax.js`and `ajax.css` in your template:

```html
<!DOCTYPE html>
<html>
    <head>
        ...
        {% block stylesheets %}
            <link rel="stylesheet" href="{{ asset('bundles/troopersajax/css/ajax.css') }}" />
        {% endblock %}
    </head>
    <body>
        ...
        {% block javascripts %}
            <!-- Be sure to have jquery loaded before -->
            <script type="text/javascript" src="{{ asset('bundles/troopersajax/js/ajax.js') }}"></script>
        {% endblock %}
    </body>
</html>
```



## Examples

### Links

    <a href="ajaxCall" data-toggle="ajax" data-update="updater-container">Click me</a>
    <div id="updater-container">Here will stand the ajaxCall response</div>

### Forms

    <form action="ajaxAction" method="POST" data-toggle="ajax" data-update="updater-ajaxAction-container">
      <input type="submit" value="Ok save me" />
    </form>

    <div id="updater-ajaxAction-container">Here will stand the ajaxAction response</div>

### Link that updates a form (using the data-form jquery selector)
    <a
        data-toggle="ajax"
        data-form="#search"
        data-update="result-panel"
        data-update-strategy="append"
        href='your_url'>
        Show more
    </a>
If the link contains the data-form property, it will submit the form using the properties of the link.

### Auto-refresh a form

You can automatically send an ajax request to update your form when an input/select change, just add the data attribute "data-refreshonchange":

```html
    <select name="category" data-refreshonchange="true">
        <option value="transport">Transport</option>
        <option value="structure">Stucture</option>
    </select>
```

Then in your controller's action:

```php
 if ($request->query->get('novalidate', false) === false) {
    if ($form->isValid()) {
        // form is valid
    } else {
        // avoid to display errors when novalidate
        $form = $formFactory->createForm();
        $form->setData($user);
    }
}
```

For some reason, you would not refresh some parts of your form (for example an input type="file"). Then, add the data attribute 'data-ignoreonchange="$some_unique_id"'.

Extra features
---

As you probably noticed, you can automatically set a container for your ajax response. Actually, you can do some others features :

### Update strategy


The data-update-strategy attribute is used to define the function to use to integrate your ajax content with the container your already set by using the data-update attribute. So if you want to, you can tell the library to put after, before, append, prepend or a custom function. Note that, the default behavior is to simply replace the content of the container by the html function.

Let's take an example. If you want your ajax content to be simply added in the end of your container, here is your code :

    <a href="ajaxCall" data-toggle="ajax" data-update="updater-container" data-update-strategy="append">Click me</a>
    <div id="updater-container">This sentence will stay here and the ajax content will be displayed just after</div>

### Effect

By default, when we load ajax content, a small effect is run : hide + fadeIn (if container not empty) hide + slideDown (if container is empty).
If this effect does not feed your needs, you can set your own by filling the data-effect attribute.
For example :

    <a href="ajaxCall" data-toggle="ajax" data-update="updater-container" data-effect="slideDown">Click me</a>
    <div id="updater-container">This container will be hidden, the ajax content will be placed here and then the slideDown function will be used to display this</div>

If you do not want any effect, you can just add the data attribute noEffect on the link (or the target) tag.
For example, on the link :

    <a href="ajaxCall" data-toggle="ajax" data-update="updater-container" data-noEffect=true>Click me, no effect</a>
    <div id="updater-container">This container will be hidden without any effect if you click</div>

or directly on the target :

    <a href="ajaxCall" data-toggle="ajax" data-update="updater-container">Click me, no effect</a>
    <a href="ajaxCall" data-toggle="ajax" data-update="updater-container" data-effect="fadeIn">Click me (fadeIn)</a>
    <div id="updater-container" data-noEffect=true>This container will be hidden with or without an effect, according by the link you choose</div>

In this last example, the first link'll do the ajax call without any effect because of the data-noEffect on the target container and the second, because of its override will trigger a fadeIn effect.

### Bootstrap Modal use

This is the is the youngest of the ajax feature's family, now you can simply trigger bootstrap modal by simply adding data-toogle="modal" on the link you decides to :

    <a href="ajaxCall" data-toogle="ajax-modal">Click me and the ajax result will pop in a beautiful popup</a>

This will work "as is" but to have a cool appearence, you will have to add the correct markup inside the modal. More info in the [Twitter Bootstrap modal doc](http://getbootstrap.com/2.3.2/javascript.html#modals)


### Overwrite the loader

`AjaxBundle` comes with a default loader and an overlay. If you want, you can change it by defining the loader's markup you want to use in `window.loader`

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>{% block title %}Welcome!{% endblock %}</title>
        {% block stylesheets %}
            <link rel="stylesheet" href="{{ asset('bundles/troopersajax/css/ajax.css') }}" />
        {% endblock %}
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}" />
    </head>
    <body>
        {% block body %}{% endblock %}
        {% block javascripts %}
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
            <script type="text/javascript">
                window.loader = '<div id="canvasloader-container" style="display: none;"><img src="{{ asset('/img/loading.gif') }}" style="width: 80%; padding-top: 15px;"/></div>';
                window.loaderOverlay = null;
            </script>
            <script type="text/javascript" src="{{ asset('bundles/troopersajax/js/ajax.js') }}"></script>
        {% endblock %}
    </body>
</html>
```
This example will tell ajax.js to use the `/img/loading.gif` and will disable the overlay.
