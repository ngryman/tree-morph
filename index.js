'use-strict'

import crawl from 'tree-crawl'

/**
 * Mutate node data.
 *
 * It treats the node atomically and create a deep clone of it.
 * Structural properties should be left untouched and modified in the layout
 * mutator instead.
 * If `null` is returned, the node is marked as removed and processed by the
 * layout mutator.
 *
 * @callback DataMutator
 * @param {Object} node Node to be mutated.
 * @param {Context} context Walk context.
 * @return {Object|undefined|null} The node itself, nothing or `null`.
 */

 /**
  * Mutate node layout.
  *
  * It treats the node as a black box that has a position in the tree. It
  * modifies its structural properties and may alter ancestors, siblings or
  * descendants nodes.
  *
  * @callback LayoutMutator
  * @param {Object|null} node Node to be mutated.
  * @param {Object} parentNode Parent of the node to be mutated.
  */

/**
 * Walk over an **immutable** tree and invoke **mutators** on each node.
 *
 * Mutators implements mutations at 2 different levels:
 * - data level: mutate node data
 * - layout level: mutate node layout
 *
 * @param {Object} root Root node of the tree.
 * @param {DataMutator} dataMutator Mutate node data.
 * @param {LayoutMutator} layoutMutator Mutate node layout.
 * @return {Object} The mutated tree.
 */
function morph(root, dataMutator, layoutMutator) {
  // both mutators are mandatory
  if ('function' !== typeof dataMutator) {
    throw new TypeError('dataMutator is not a function')
  }
  if ('function' !== typeof layoutMutator) {
    throw new TypeError('layoutMutator is not a function')
  }

  let newRoot = null, newPath = []

  crawl(root, (node, context) => {
    // mutate node data
    const newNode = dataMutator(node, context)

    // get the current path item representing the potential parent of the
    // current node
    const parent = newPath[newPath.length - 1]

    // special case for the first iteration as it's the root we are handling
    if (undefined === parent) {
      // if new node is not null, set it as the new root
      if (null != newNode) {
        newRoot = newNode
      }
      // otherwize break as the whole tree has been discarded
      else {
        context.break()
        return
      }
    }
    // standard case for other nodes deeper in the hierarchy
    else {
      // if new node is not null we apply a layout mutation
      if (null != newNode) {
        layoutMutator(newNode, parent.node)
      }
      // otherwize it is discarded
      else {
        context.skip()
      }

      // decrement parent TTL, if it reaches zero all the children have been
      // added and we go up in the hierarchy
      parent.ttl--
      if (0 === parent.ttl) {
        newPath.pop()
      }
    }

    // when all conditions are met, push new node in the path storing how many
    // children may be added as its TTL (Time To Live)
    if (
      newNode &&
      node.children &&
      0 !== node.children.length &&
      !context.is('skip')
    ) {
      newPath.push({ node: newNode, ttl: node.children.length })
    }
  })

  return newRoot
}

module.exports = morph
