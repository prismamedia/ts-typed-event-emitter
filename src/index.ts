import { errorMonitor, EventEmitter } from 'events';

export { errorMonitor } from 'events';

export type TEventMap = Record<string | symbol, unknown[]>;

type TInternalEventMap<TMap extends TEventMap> = {
  error: [Error];
  [errorMonitor]: [Error];
  newListener: [TEventName<TMap>, TEventListener<TMap>];
  removeListener: [TEventName<TMap>, TEventListener<TMap>];
} & TMap;

export type TEventName<TMap extends TEventMap> = Extract<
  keyof TInternalEventMap<TMap>,
  string | symbol
>;

export type TEventArgs<
  TMap extends TEventMap,
  TName extends TEventName<TMap> = TEventName<TMap>
> = TInternalEventMap<TMap>[TName];

export type TEventListener<
  TMap extends TEventMap,
  TName extends TEventName<TMap> = TEventName<TMap>
> = (...args: TEventArgs<TMap, TName>) => void;

export type TEventEmitterOptions<TMap extends TEventMap> = Partial<
  { [TName in TEventName<TMap>]: TEventListener<TMap, TName> }
>;

export class TypedEventEmitter<TMap extends TEventMap> extends EventEmitter {
  public constructor(options?: TEventEmitterOptions<TMap>) {
    super({ captureRejections: true });

    if (options) {
      for (const [name, listener] of Object.entries(options)) {
        if (listener) {
          this.on<any>(name, listener);
        }
      }
    }
  }

  public emit<TName extends TEventName<TMap>>(
    name: TName,
    ...args: TEventArgs<TMap, TName>
  ) {
    return super.emit(name, ...args);
  }

  public addListener<TName extends TEventName<TMap>>(
    name: TName,
    listener: TEventListener<TMap, TName>,
  ) {
    return super.addListener(name, listener as any);
  }

  public on<TName extends TEventName<TMap>>(
    name: TName,
    listener: TEventListener<TMap, TName>,
  ) {
    return this.addListener(name, listener);
  }

  public once<TName extends TEventName<TMap>>(
    name: TName,
    listener: TEventListener<TMap, TName>,
  ) {
    return super.once(name, listener as any);
  }

  public listeners<TName extends TEventName<TMap>>(name: TName) {
    return super.listeners(name) as TEventListener<TMap, TName>[];
  }

  public listenerCount(name: TEventName<TMap>) {
    return super.listenerCount(name);
  }

  public eventNames() {
    return super.eventNames() as TEventName<TMap>[];
  }

  public removeAllListeners(name?: TEventName<TMap>) {
    return super.removeAllListeners(name);
  }

  public removeListener<TName extends TEventName<TMap>>(
    name: TName,
    listener: TEventListener<TMap, TName>,
  ) {
    return super.removeListener(name, listener as any);
  }

  public off<TName extends TEventName<TMap>>(
    name: TName,
    listener: TEventListener<TMap, TName>,
  ) {
    return this.removeListener(name, listener);
  }

  public async wait<TName extends TEventName<TMap>>(
    ...names: TName[]
  ): Promise<TEventArgs<TMap, TName>> {
    return new Promise((resolve) => {
      const listeners = [...new Set(names)].map((name): [
        name: TName,
        listener: TEventListener<TMap, TName>,
      ] => [
        name,
        (...args) => {
          listeners.forEach((args) => this.off(...args));

          resolve(args);
        },
      ]);

      listeners.forEach((args) => this.on(...args));
    });
  }
}

export default TypedEventEmitter;
