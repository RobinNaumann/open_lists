export class NotifyableService<T> {
  private _listeners: { [key: string]: ((data: T) => void)[] } = {};

  protected _notifyListeners(key: string, data: T) {
    if (this._listeners[key]) {
      for (const listener of this._listeners[key]) {
        listener(data);
      }
    }
  }

  public listen(key: string, listener: (data: T) => void): void {
    if (!this._listeners[key]) {
      this._listeners[key] = [];
    }
    this._listeners[key].push(listener);
  }

  public unlisten(key: string, listener: (data: T) => void) {
    console.log("unlisten", key);
    if (this._listeners[key]) {
      this._listeners[key] = this._listeners[key].filter((l) => l !== listener);
    }
  }
}
