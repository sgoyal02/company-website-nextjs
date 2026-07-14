import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('usedebounce hook tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('debounce val not update immediate- test', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: 'testing' },
    });
    expect(result.current).toBe('testing');
    rerender({ value: 'world' });
    expect(result.current).toBe('testing');
    act(() => {
      jest.advanceTimersByTime(389);
    });
    expect(result.current).toBe('testing');
  });

  it('debounce value update after delay-- test', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: 'hi' },
    });
    rerender({ value: 'there' });
    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current).toBe('there');
  });
});
