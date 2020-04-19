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


## Examples
