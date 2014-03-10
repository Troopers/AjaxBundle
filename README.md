AvAjaxBundle
============

##Description

This bundle offers a simple structure to run ajax actions.
For each kind of action (link or form), you have to add a data-toggle="ajax" to the tag ( **a**, **form** ) and to specify the id of the container to update in the update attribute.

##Examples 

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

Extra features
---

As you probably noticed, you can automatically set a container for your ajax response. Actually, you can do some others features :

### Update strategy


The data-updateStrategy attribute is used to define the function to use to integrate your ajax content with the container your already set by using the data-update attribute. So if you want to, you can tell the library to put after, before, append, prepend or a custom function. Note that, the default behavior is to simply replace the content of the container by the html function.

Let's take an example. If you want your ajax content to be simply added in the end of your container, here is your code :

    <a href="ajaxCall" data-toggle="ajax" data-update="updater-container" data-updateStrategy="append">Click me</a>
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

    <a href="ajaxCall" data-toogle="modal">Click me and the ajax result will pop in a beautiful popup</a>
    
This will work "as is" but to have a cool appearence, you will have to add the correct markup inside the modal. More info in the [Twitter Bootstrap modal doc](http://getbootstrap.com/2.3.2/javascript.html#modals) 

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
    


 
 
 
 


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/AppVentus/avajaxbundle/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

