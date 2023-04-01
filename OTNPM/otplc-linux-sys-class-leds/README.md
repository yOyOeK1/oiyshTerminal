## otplc-linux-sys-class-leds

    Is to have a nodejs interface for leds on your keyboard.

Can not only on/off also get/set values and triggers.



### use case

Video showing how to set it up and use it wrapt in node-red node as node-red-otplc-linux-sys-class-leds ...

[![](https://i.ytimg.com/an_webp/X3jwnlGD_SM/mqdefault_6s.webp?du=3000&sqp=CIewoaEG&rs=AOn4CLBo2zmuuYR-4eJyDtKvtJkHamsh8w)
](https://www.youtube.com/watch?v=X3jwnlGD_SM)

*node-red-otplc-linux-sys-class-leds oiyshTerminal at npm* - on youtube from setting it up to blinking led...



### requirements

- linux

- access to write and read files on your system `/sys/class/leds/*/brightness` and/or
  
  `/sys/class/leds/*/trigger`



### installation using npm

Install it locally or with `-g` globally

```shell
npm i otplc-linux-sys-class-leds
```

then check it in `node` ...



### how to use it example

In `node` command line:

```json
> let o0 = require("otplc-linux-sys-class-leds");
undefined
> let l = new o0();
undefined
> l.dirList();
[ 'input2::capslock', 'input2::numlock', 'input2::scrolllock' ]
> l.chkperm('input2::capslock');
true
> l.getStatusFromSysFs('input2::capslock');
{
  name: 'input2::capslock',
  brightness: {
    now: 0,
    max: 1,
    trigger: 'kbd-capslock',
    triggers: [
      'none',
      .....
      'kbd-ctrlrlock',
      'AC-online',
      'rc-feedback'
    ]
  }
}
> l.getStatus('input2::capslock');
0
> l.set('input2::capslock','1');
OK
undefined
> l.getStatus('input2::capslock');
1
```

---
If you see that this make sens 

[![](https://camo.githubusercontent.com/cd07f1a5d90e454e7bbf69d22ebe4cdbd3a0b3dcf56ba0b6c2495a8e99c776be/68747470733a2f2f6b6f2d66692e636f6d2f696d672f676974687562627574746f6e5f736d2e737667)](https://ko-fi.com/B0B0DFYGS)