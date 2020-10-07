**Typescript Typed Event Emitter**

A "typed" version of the native EventEmitter

# Usage

```js
import TypedEventEmitter from '@prismamedia/ts-typed-event-emitter';

// We declare the different types and the data they carry
type Events = {
  pre: [{ at: Date }],
  post: [{ took: number }],
}

// We "type" the data carried by the events like this :
const ee = new TypedEventEmitter<Events>();

// We can listen on events like this :
ee.on('pre', ({ at }) => console.log({ first: at }));
ee.on('pre', ({ at }) => console.log({ second: at }));
ee.on('post', ({ took }) => console.log({ took }));

// [...]

ee.emit('pre', { at: 2000 });
// -> { first: 2000 }
// -> { second: 2000 }

ee.emit('post', { took: 100 });
// -> { took: 100 }
```

## A convenient "wait" methods is available :

```js
// Wait for an event to be triggered
const eventData = await ee.wait('pre');

const eventDataOfTheFirstTriggeredEvent = await ee.wait('pre', 'post');
```
