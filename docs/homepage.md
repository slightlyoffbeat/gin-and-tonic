# BitStrap
## CSS Framework & Guidelines for BitTorrent

This documentation is created with a combination of a custom gulp file and [kss-node](https://github.com/kss-node/kss-node).

You can add to the documentation by adding simple comments inside your scss files. Here's an example KSS comment:

```
/*
Button

Your average button

Markup:
<a class="button">Sample Button</a>

Styleguide: 2.1
*/
```

The "Styleguide 2.1" will determine where it is. Base numbers such as "2.0" will appear in the sidebar and will set up a section. Numbers such as "2.1" will appear in order in that section.

**For more information on how to write KSS comments, see the [KSS spec](https://github.com/kss-node/kss/blob/spec/SPEC.md).**

## Running & building BitStrap's documentation.

This site is built using the gulp file in the BitStrap repo. 

Run ```gulp bitstrap``` to run a local version of the documentation 

Run ```gulp bitstrap-build``` to only build it.
