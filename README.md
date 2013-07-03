AvAjaxBundle
============

##Description

This bundle offers a simple structure to run ajax actions.
For each kind of action (link or form), you have to add a class="ajax" to the tag ( **a**, **form** ) and to specify the id of the container to update in the update attribute.

##Examples 

### Links

    <a href="ajaxCall" class="ajax" update="updater-container">Click me</a>
    <div id="updater-container">Here will stand the ajaxCall response</div>

### Forms

    <form action="ajaxAction" method="POST" class="ajax" update="updater-ajaxAction-container">
      <input type="submit" value="Ok save me" />
    </form>

    <div id="updater-ajaxAction-container">Here will stand the ajaxAction response</div>

## Installation

With Composer :


Add this line in your composer.json file :

    "appventus/ajax-bundle": "dev-master"

Declare the bundle in your AppKernel.php:

    public function registerBundles() {
        $bundles = array(
            [...]
            new AppVentus\AjaxBundle\AvAjaxBundle(),
            [...]

##Configuration

###AsseticInjectorBundle way

If You have installed our insanous [AsseticInjectorBundle](https://github.com/AppVentus/AsseticInjectorBundle/edit/master/README.md) bundle:

    1. You are awesome ;)
    2. you just have to add the injector tags in your javascript (injector="foot") and stylesheet (injector="head") blocks.

###The poor, bad and ancestral way !

    1. Just add in your assetic {% javascripts block "@AvAjaxBundle/Resources/public/js/ajax.js" %}
    2. Just add in your assetic {% stylesheets block "@AvAjaxBundle/Resources/public/css/ajax.css" %}
    


 
 
 
 
