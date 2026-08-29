let i: number;
i = 123;

function add(a: number, b: number) {
    return a + b;
}

interface User {
    name: string;
    age: number;
    bio?: string;
}

let alice: User;
alice = { name: "Alice", age: 22 };

type Student = {
    name: string;
    age: number;
}

let bob: Student;
bob = { name: "Bob", age: 23 };

let eve: Student & { grade: "A" | "B" } = {
    name: "Eve",
    age: 24,
    grade: "A",
}

function wrap<T>(name: T) {
    return [name];
}

wrap<string>("Tom");
wrap<number>(123);
wrap<Student>(bob);
