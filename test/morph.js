import test from 'ava'
import spy from 'spy'
import morph from '../index'
import tree from './helpers/tree'
import {
  noop,
  copy,
  skipValue,
  add
} from './helpers/functions'

test('return a new tree', t => {
  const newTree = morph(tree, copy, add)
  t.not(newTree, tree)
  t.deepEqual(newTree, tree)
})

test('invoke data mutator on each node', t => {
  const mutator = spy(copy)
  morph(tree, mutator, add)
  t.is(mutator.callCount, 6)
  t.true(mutator.calledWith(tree))
})

test('skip node if data mutator returns null', t => {
  const mutator = spy(skipValue(2))
  morph(tree, mutator, add)

  t.is(mutator.callCount, 4)
  t.true(mutator.calledWith(tree))
})

test('return null if data mutator skips root', t => {
  const newTree = morph(tree, skipValue(1), add)
  t.is(newTree, null)
})

test('break traversal if data mutator skips root', t => {
  const mutator = spy(skipValue(1))
  morph(tree, mutator, add)
  t.is(mutator.callCount, 1)
})

test('invoke layout mutator on each node except root', t => {
  const mutator = spy(add)
  morph(tree, copy, mutator)
  t.is(mutator.callCount, 5)
})

test('do not invoke layout mutator if data mutator skips a node', t => {
  const mutator = spy(add)
  morph(tree, skipValue(2), mutator)
  t.is(mutator.callCount, 2)
  t.true(mutator.neverCalledWith(tree))
})

test('return null if tree is undefined', t => {
  const newTree = morph(null, noop, noop)
  t.is(newTree, null)
})

test('complain about missing data mutator', t => {
  t.throws(() => morph(tree, null, noop), 'dataMutator is not a function')
})

test('complain about missin appender', t => {
  t.throws(() => morph(tree, noop, null), 'layoutMutator is not a function')
})
