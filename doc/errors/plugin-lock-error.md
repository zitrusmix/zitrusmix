# plugin-lock-error

Only one plugin can run at the same time. Please await until a plugin is resolved before using another plugin.

:boom: Examples that throw this error:

```js
const mix = new Zitrusmix();

mix.use(firstAsyncPlugin);
mix.use(secondAsyncPlugin); // throws Error
```

:bulb: Examples to maybe fix your code

```js
const mix = new Zitrusmix();

await mix.use(firstAsyncPlugin);
await mix.use(secondAsyncPlugin);
```

```js
const mix = new Zitrusmix();

mix.use(firstAsyncPlugin).then(() => mix.use(secondAsyncPlugin));
```


