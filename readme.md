# tree-morph

[![Greenkeeper badge](https://badges.greenkeeper.io/ngryman/tree-morph.svg)](https://greenkeeper.io/)

> Agnostic tree morphing library.

[![travis][travis-image]][travis-url] [![codecov][codecov-image]][codecov-url]

[travis-image]: https://img.shields.io/travis/ngryman/tree-morph.svg?style=flat
[travis-url]: https://travis-ci.org/ngryman/tree-morph
[codecov-image]: https://img.shields.io/codecov/c/github/ngryman/tree-morph.svg
[codecov-url]: https://codecov.io/github/ngryman/tree-morph


**tree-morph** allows you to apply either **homomorphisms** or **isomorphisms** to an **immutable tree**. You can mutate nodes at a **data level** and at a **structural level**. In other words, `tree-morph` lets you easily create high-order functions such as **map** or **filter** that work well with your tree structure.

`tree-morph` works around **mutators**. Those mutators contain logic to handle tree mutations. Depending on your needs and your tree structure, you can mutate your tree however you want, making `tree-morph` a versatile and agnostic tree mutation library.


## Install

```bash
npm install --save tree-morph
```

## Usage

```javascript
import morph from 'tree-morph'

// add a `depth` property to each node
const tree1 = morph(tree,
  (node, context) => cloneWith(node, { depth: context.depth })
, add)

// only keep `type` property
const tree2 = morph(tree, node => pick(node, 'type'), add)

// filter nodes with type=foo
const tree3 = morph(tree,
  node => ('foo' === node.type ? clone(node) : null)
, add)
```

See [more examples](test/examples.js).


## API

See the [api](docs/api.md) documentation.


## Related

 - [tree-mutate](https://github.com/ngryman/tree-mutate) Little brother of `tree-morph`, but for **mutable** trees.
 - [tree-crawl](https://github.com/ngryman/tree-crawl) Generic tree traversal library. This module uses it.


## License

MIT © [Nicolas Gryman](http://ngryman.sh)
