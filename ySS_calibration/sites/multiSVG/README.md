# multi SVG

You can use any .svg drawing app. I'm using inkscape. It's nice, known, opensource vector editor.

Text if you want to change text in them they need to be as text not paths. Object should be a paths not objects if you whant to do any thing with them different then "onclick".

## adding your svg to list

In ./ySS/sites/multiSVG you have **s_multiSVGPage.js** there is a "**svgsList**" for now you can add your name of a file :)

## supported triks

This is a short explanation what it's suporting:

* **by name of a object** - name of object in .svg is a bind info for binding mechanizm. Upcomming msg from mqtt topic "and/xRot" will be loking for "and_xRot" object name. If it's a text (not object) default option will be to add text to it as it's

* **using description feald**:
  
  * basic overwrite of setting function use sentence in descriptio:

```javascript
{
"use":"putText( this,  degToHdg( val )+'`' )"
}
```

This in a example of a discription in object properties from "inkscape". It will use function "**putText**" value will be run pass "**deToHdg**".

* **this** - is a object where is description.

* **val** - is a upcomming value

* **valRaw** - as alternative if you whant it will use value without brackets.

So you can see it's a wrapper for all possible action to use with .svg :)

* you can define **onclick** from drawing app :) In inkscape it's possible to set "onclick" function :) So adding:
  
  ```javastacktrace
  mulSvgOnClick('mqtt=1,topic=and/bt0,payload=click')
  ```

    It will send to mqtt, topic "and/bt0" with value "click".

### Examples

[yss and Faaast site! (youtube) ](https://www.youtube.com/watch?v=7A5ByLkzaOA)  [yss Faaast Attack - as chrome extension (youtube)](https://www.youtube.com/watch?v=ySlGNTGg7iQ)

|                                   | what is on the picture                                                                                                |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| ![](./ss_mainMenu.png)            | Main menu of posible .svg to select from. Read section how to add one or fill free to update it! TODO - auto reindex? |
| ![](./ss_oneOfSvgs.png)           | Direct load of .svg and it's updating our text from image NICE!                                                       |
| ![](./ss_workingGlobalShader.png) | Last check of shaders if we can invert it globally ? YES! So Screens Manager is fine with multi-svg !                 |

### TODO

- [ ] now on on ws message callback parser do only one object.

- [ ] for update index a Node-red flow? there is a http API

- [ ] interactivity do it need a name of a function? I'm all ready parsing .svg

- [ ] more examples

- [ ] shader don't work good it can be yss-bug
