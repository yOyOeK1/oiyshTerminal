Is to do some basic battery things. Do scaling of your data to `unit` you want. Have `min`, `max` values those are use to calculate `nLevel`. Ra ports `isNormal`  _boolean_ if all is OK. Location is used in otplt structure to put in in some place for you for later.


---

## use it

To use it feed any number to it in `payload`. It will handle it as you set the values in parameters of the node.

`return` _json_ {
    
 - `"topic"` _string_ - where to look for mqtt updates
 - `"volts"` _float_ - you `payload` as _number_ * `scale` from property
 - `"nLevel"` _float_ - 0.0 .... 1.0 base on current `volts` and your `min` `max` brackets
 - `"isMin"` _boolean_ - if is less then min then `false`
 - `"isMax"` _boolean_ ....
 - `"isNormal"` _boolean_ ....
 - `"unit"` _string_ - from property of the `"hz"` _float_ - frequency of the data

}