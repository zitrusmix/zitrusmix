# collection-add-element-missing-error

| No element with URI "__\<URI\>__" available. Add element to mix before adding it to a collection.

:boom: Examples that throw this error:

```js
const mix = new Zitrusmix();
const collection = mix.createCollection();

collection.add('uri-404'); // throws Error
```

:bulb: This examples do not throw any error

```js
const mix = new Zitrusmix();
const collection = mix.createCollection();

mix.add('VIE', {name: 'Vienna'});

collection.add('VIE');
```

```js
const mix = new Zitrusmix();
mix.add('VIE', {name: 'Vienna'});

const cities = mix.all();

mix.add('BZO', {name: 'Bolzano'});
cities.add('BZO');
```


