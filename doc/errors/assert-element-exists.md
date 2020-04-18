# assert-element-exists

The method expects that a ```ContentElement``` with given ```URI``` exists in the ```Zitrusmix```.

:boom: Examples that throw this error:

```JavaScript
const mix = new Zitrusmix();

const element = mix.get('/city/vie'); // Error
```

> :bulb: Hint
> If you don't know if a ```ContenElement``` exists, use ```mix.find(...)```

:lemon: This examples do not throw any error

```JavaScript
const mix = new Zitrusmix();
mix.add('/city/view',  {name: 'Vienna'});

const element = mix.get('/city/vie');
```

