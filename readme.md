# [@MichaelDMcCracken/get-metar](https://github.com/MichaelDMcCracken/get-metar)

This library gets a METAR from the Aviation Weather Center Data Server.

## Usage

```js
var getMetar = require('@MichaelDMcCracken/get-metar');
getMetar('KRDU').then(function(obj){
    console.log(obj);
});
```

