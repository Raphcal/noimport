# noimport

Utility to resolve ES2015 imports and to remove export statements from a given file.
Everything will be mashed up into a flat file.

Works with Javascript and Typescript files.

The current version does no tree shaking and simply patch files together.

## Installation
~~~
npm install -g noimport
~~~

## Usage
You can give `noimport` only the source file as argument to print the result to the console:
~~~
noimport source.ts
~~~

Or you can specify a target file where to write the result:
~~~
noimport source.ts target.ts
~~~

## Example
Using `noimport source.ts` on the given files:

`source.ts`
~~~ typescript
import { SomeClass } from './other';

export const instance = new SomeClass();
~~~

`other.ts`
~~~ typescript
export class SomeClass {
    property: string;
}
export class UnusedClass {
    property: string;
}
~~~

Will give the following output:
~~~ typescript
class SomeClass {
    property: string;
}
class UnusedClass {
    property: string;
}

const instance = new SomeClass();
~~~
