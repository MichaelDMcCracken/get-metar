# [@michaelmccracken/get-metar](https://www.npmjs.com/package/@michaelmccracken/get-metar)

This library gets a METAR from the Aviation Weather Center Data Server.

## Usage

```js
var getMetar = require('@michaelmccracken/get-metar');

getMetar('KRDU').then(function(obj) {
  console.log(obj);
});
```
