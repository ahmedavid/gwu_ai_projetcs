export class Queue<T> {
    items: T[] = []

    push(item: T) {
        this.items.push(item)
    }

    pop() {
        return this.items.shift()
    }
}