[![Home](../badges/home.svg)](../../README.md)

# Zitrusmix

## Constructor

```typescript
new Zitrusmix();
```

## Properties

### links
Returns the `LinkStore` that contains all links between `ContentElements`.

```typescript
const mix = new Zitrusmix();
const links = mix.links;
```

## Methods

### add
```typescript
add(uri: ElementURI, content?: Content): ContentElement
```

Add `content` to the `Zitrusmix`. The `content` can be any serializable object.
Returns the `ContentElement`.

```typescript
const mix = new Zitrusmix();
mix.add('/city/vienna', {country: 'Austria'});
```

### all
```typescript
all(): ZitrusmixCollection
```

Returns a `ZitrusmixCollection` with all `ContentElements`.

```typescript
const mix = new Zitrusmix();
mix.add('/city/vienna', {country: 'Austria'});
mix.add('/city/bolzano', {country: 'Italia'});

const allCities = mix.all();
```

### clear
```typescript
clear(): void
```
Removes all `ContentElements` and `Links` from the `Zitrusmix` instance.

```typescript
const mix = new Zitrusmix();
mix.add('/city/vienna', {country: 'Austria'});
mix.clear();

mix.has('/city/vienna'); // false
```

## Examples
