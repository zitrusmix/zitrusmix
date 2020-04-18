[![Home](../badges/home.svg)](../../README.md)

# API

## Overview

![Overview](../images/zitrusmix-overview.svg)

## Structure

### Zitrusmix

The main entry point for this library.

__[API Documentation](./zitrusmix.md) | [Source Code](../../lib/Zitrusmix.ts)__

### ContentElement

This is our content element with custom properties.

> :bulb: Notes
> * A ```ContentElement``` has to be serializable
> * A ```ContentELement``` shall not use methods

__[API Documentation](./content-element.md) | [Source Code](../../lib/ContentElement.ts)__

### ZitrusmixCollection

A collection of ```ContentElements```

> :bulb: Notes
> * A ```ZitrusmixCollection``` can contain only ```ContentElements``` that have been added to the ```Zitrusmix```
> * ```Zitrusmix.all()``` returns a ```ZitrusmixCollection``` with all elements

__[API Documentation](./zitrusmix-collection.md) | [Source Code](../../lib/ZitrusmixCollection.ts)__

### Link

A ```Link``` connects one ```ContentElement``` to one or more other ```ContentElements```.

> :bulb: Notes
> * Use methods of the ```ContentElement``` to create new ```Links```
> * A ```Link``` has an optional relationship
> * A ```Relationship``` can contain custom properties, like a ```ContentElement```

__[API Documentation](./link.md) | [Source Code](../../lib/Link.ts)__

### Plugin

> :bulb: Notes
> * Use it with ```Zitrusmix.use()``` or ```ZitrusmixCollection.use()```
> * ```Plugins``` can be async (Promise based)

__[API Documentation](./plugin.md) | [Source Code](../../lib/plugin/ZitrusmixPlugin.ts)__
