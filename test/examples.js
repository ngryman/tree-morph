import test from 'ava'
import morph from '../index'
import tree from './helpers/tree'
import {
  add,
  copy
} from './helpers/functions'

test('map', t => {
  function map(root, iteratee) {
    return morph(root, iteratee, add)
  }

  const newTree = map(tree,
    (node, context) => ({ depth: context.depth })
  )

  t.deepEqual(newTree, {
    depth: 0,
    children: [
      {
        depth: 1,
        children: [
          { depth: 2 },
          { depth: 2 }
        ]
      },
      {
        depth: 1,
        children: [
          { depth: 2 }
        ]
      }
    ]
  })
})

test('pluck', t => {
  function pluck(root, key) {
    return morph(root, node => ({ [key]: node[key] }), add)
  }

  const newTree = pluck(tree, 'value')

  t.deepEqual(newTree, {
    value: 1,
    children: [
      {
        value: 2,
        children: [
          { value: 3 },
          { value: 4 }
        ]
      },
      {
        value: 5,
        children: [
          { value: 6 }
        ]
      }
    ]
  })
})

test('filter', t => {
  function filter(root, predicate) {
    return morph(root,
      node => predicate(node) ? copy(node) : null
    , add)
  }

  const newTree = filter(tree, node => 'node' === node.type)

  t.deepEqual(newTree, {
    type: 'node',
    value: 1,
    children: [
      { type: 'node', value: 2 },
      { type: 'node', value: 5 }
    ]
  })
})
