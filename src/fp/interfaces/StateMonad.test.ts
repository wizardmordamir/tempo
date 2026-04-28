// this is a test file. to use add .test to the filename

// import { describe, expect, it } from 'bun:test';
// import { assign } from '../../utils/assign';
// import { monadPipe, StateMonad } from './StateMonad';

// describe('StateMonad & monadPipe', () => {
//   it('should snowball values through multiple assignments', async () => {
//     const pipeline = monadPipe(StateMonad)(
//       assign('b', (ctx) => ctx.a + 1),
//       assign('c', (ctx) => ctx.b + 1),
//     );

//     const m = await pipeline({ a: 1 });
//     const { value } = m.extract();

//     expect(value).toEqual({ a: 1, b: 2, c: 3 });
//   });

//   it('should handle async functions in the pipe', async () => {
//     const pipeline = monadPipe(StateMonad)(
//       assign('data', async (ctx) => {
//         return Promise.resolve(`fetched-${ctx.id}`);
//       }),
//     );

//     const m = await pipeline({ id: 123 });
//     expect(m.extract().value).toEqual({ id: 123, data: 'fetched-123' });
//   });

//   it('should short-circuit (stop processing) on error', async () => {
//     let callCount = 0;

//     const pipeline = monadPipe(StateMonad)(
//       assign('first', () => 'ok'),
//       (_ctx) => {
//         throw new Error('Boom!');
//       },
//       assign('second', () => {
//         callCount++; // This should never run
//         return 'not ok';
//       }),
//     );

//     const m = await pipeline({});
//     const state = m.extract();

//     expect(state.stopProcessing).toBe(true);
//     expect(state.errors[0].message).toBe('Boom!');
//     expect(state.value.first).toBe('ok');
//     expect(state.value.second).toBeUndefined();
//     expect(callCount).toBe(0);
//   });

//   it('should allow "taps" that do not change the context', async () => {
//     let capturedValue = null;

//     const pipeline = monadPipe(StateMonad)(
//       assign('a', () => 1),
//       (ctx) => {
//         capturedValue = ctx.a; // Manual tap
//         return ctx;
//       },
//       assign('b', (ctx) => ctx.a + 1),
//     );

//     const m = await pipeline({});
//     expect(capturedValue).toBe(1);
//     expect(m.extract().value).toEqual({ a: 1, b: 2 });
//   });

//   it('should preserve types through assign', async () => {
//     // This is primarily a compile-time check, but ensures
//     // runtime logic doesn't drop keys.
//     const initial = { root: true };
//     const m = await StateMonad.unit(initial).bind(assign('sub', () => ({ nested: true })));

//     expect(m.extract().value).toEqual({
//       root: true,
//       sub: { nested: true },
//     });
//   });
// });
