import { useEffect, useState } from "preact/hooks";

type BitStreamWorker<T> = (data: (value: T) => void, error: (e: string) => void) => Promise<void>

export class Bit<T>{
    private worker?: () => Promise<T>;
    public s = useState<BitState<T>>({loading: true});

    constructor(worker?: () => Promise<T>, stream?:BitStreamWorker<T>) {
        console.log("constructing bit");
        if (worker){
            this.worker = worker;
            useEffect(() => {
                this.reload();
            }, []);
        }

        if (stream){
            useEffect(() => {
                this.listen(stream);
            },[]);
        }
    }

    //public get state() {return this.s[0];}

    public emitLoading() {
        this.emit({loading: true});
    }

    public emitError(e?: string) {
        console.log("bit error",e ?? "unknown error");
        this.emit({error: e});
    }

    public emitData(data: T) {
        this.emit({data: data});
    }

    private emit(state: BitState<T>) {
        this.s[1](state);
    }

    public async listen(stream: BitStreamWorker<T>) {
        console.log("listening to stream");
        try {
            await stream((d) => this.emitData(d),(e) => this.emitError(e));
        }
        catch (e) {
            this.emitError(e);
        }
    }

    public async reload() {
        if (!this.s[0].loading) this.emitLoading();
        try {
            this.emitData(await this.worker());
        }
        catch (e) {
            this.emitError(e);
        }
    }

    public map<D>({onLoading,onError,onData}:BitMap<D,T>): D {
        const s = this.s[0];
        if (s.loading) return onLoading();
        if (s.error) return onError(s.error);
        try{
            return onData(s.data);
        }
        catch(e){
            return onError(e);
        }
    }
}

interface BitMap<D,T>{
    onLoading: () => D;
    onError: (e: string) => D;
    onData: (value: T) => D;

}

export function mapState<D,T>(state:BitState<T>,{onLoading,onError,onData}:BitMap<D,T>): D {
    if (state.loading) return onLoading();
    if (state.error) return onError(state.error);
    return onData(state.data);
 }

export interface BitState<T>{
     loading?: boolean;
     error?: string;
     data?: T;
}