# stable-element-uri-error

The UID of a content element can not be changed after construction. The UID is immuteable.

:boom: Examples that throw this error:

```js
const mix = new Zitrusmix();
const element = new ContentElement('foo', {name: 'foo'}, mix);

element.uid = 'bar'; // throws Error
```

```js
const mix = new Zitrusmix();
const element = new ContentElement('foo', {uid: 'bar'}, mix); // throws Error
```
