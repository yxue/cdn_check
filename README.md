# cdn-check

#### Check content differences between CDN servers and host server (in node.js)

## install 

```bash
npm install cdn-check
```

## Usage
```js
const cdnck = require('cdn-check');

var p = cdnck.check('0.0.0.0', 'a.b.c', ['1.1.1.1', '2.2.2.2'], ['html', 'css', 'js'], false)
p.then((data)=>{
    // ... handle here    
});
```

## API

### `check(ip: string, domain: string, dnsip: string[], checktype: string[], saveFile: boolean) => Promise`
Get the differences between cdn servers and host server

### License

MIT
