export type voidFn<T> = (message: T) => void

export class Observable<T> {
    subscribers: voidFn<T>[] = []
    
    subscribe(fn:voidFn<T>) {
        this.subscribers.push(fn)
    }

    unsubscribe(fn:voidFn<T>) {
        const index = this.subscribers.findIndex(f => f === fn)
        this.subscribers.splice(index,1)
    }

    notify(message: T) {
        for(let sub of this.subscribers) {
            sub(message)
        }
    }
}