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
