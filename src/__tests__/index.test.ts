import { TypedEventEmitter } from '..';

type MyEvents = {
  pre: [{ at: Date }];
  post: [{ tookInMs: number }];
  end: [];
};

describe('EventEmitter', () => {
  it('works as expected', async () => {
    const ee = new TypedEventEmitter<MyEvents>();

    // The data is not present
    // @ts-expect-error
    ee.emit('pre');

    // The data is not valid
    // @ts-expect-error
    ee.emit('pre', { at: 'not a date' });

    ee.emit('pre', { at: new Date() });

    // An event without data
    ee.emit('end');

    expect(ee.eventNames()).toEqual([]);

    ee.on('pre', () => {});

    // The property does not exist
    // @ts-expect-error
    ee.on('pre', ({ notAt }) => {});

    expect(ee.eventNames()).toEqual(['pre']);

    ee.on('end', () => {});

    expect(ee.eventNames()).toEqual(['pre', 'end']);

    ee.removeAllListeners('pre');
    expect(ee.eventNames()).toEqual(['end']);

    ee.removeAllListeners('end');
    expect(ee.eventNames()).toEqual([]);

    await expect(
      Promise.all([
        ee.wait('pre', 'post', 'error'),
        ee.emit('post', { tookInMs: 123 }),
        ee.emit('pre', { at: new Date() }),
      ]),
    ).resolves.toEqual([[{ tookInMs: 123 }], true, false]);

    expect(ee.eventNames()).toEqual([]);
  });
});
