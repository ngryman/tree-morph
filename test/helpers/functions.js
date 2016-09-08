import clone from 'clone'

export function noop() {}

export function copy(node) {
  const cloneNode = clone(node)
  delete cloneNode.children
  return cloneNode
}

export function skipValue(value) {
  return function(node) {
    return (value !== node.value ? copy(node) : null)
  }
}

export function add(node, parentNode) {
  if (null == parentNode.children) {
    parentNode.children = []
  }
  parentNode.children.push(node)
}
