export type Either<L, R> =
  | { type: 'left'; value: L }
  | { type: 'right'; value: R }

export function left<L, R>(value: L): Either<L, R> {
  return { type: 'left', value }
}

export function right<L, R>(value: R): Either<L, R> {
  return { type: 'right', value }
}

export function isLeft<L, R>(either: Either<L, R>): either is { type: 'left'; value: L } {
  return either.type === 'left'
}

export function isRight<L, R>(either: Either<L, R>): either is { type: 'right'; value: R } {
  return either.type === 'right'
}