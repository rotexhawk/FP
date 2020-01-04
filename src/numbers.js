// // import { left, right, either } from "./either";

// import { either, Right, Left } from "ramda";

// function toNumber(str) {
//   const int = parseInt(str);
//   if (isNaN(int)) {
//     return Left("String is not a number");
//   }
//   return Right(null, "hello");
// }

// function square(int) {
//   return int * int;
// }

// function cube(int) {
//   return Math.pow(int, 3);
// }

// function toStr(int) {
//   if (int < 100) {
//     return left("this is a small number");
//   }
//   return right(`great ${int}`);
// }

// const showValue = msg => msg;

// const res = toNumber("1")
//   .map(square)
//   .map(cube)
//   .chain(toStr);

// const value = either(showValue, showValue, res);

// console.log("value", value);

const sum = (x, y) => x + y;

const curry = fn => x => y => fn(x, y);

const unCurry = fn => (a, b) => fn(a)(b);

function compose(...funcList) {
  return funcList.reduce((acc, curr) => {
    return function(args) {
      return acc(curr(args));
    };
  });
}

function pipe(...funcList) {
  return funcList.reduce((acc, curr) => {
    return function(args) {
      return curr(acc(args));
    };
  });
}

const curriedSum = curry(sum);

console.log(curriedSum(2)(3));

const unCurriedSum = unCurry(curriedSum);

const head = list => {
  const [first, sec, ...rest] = list;
  return first;
};

const square = num => num * num;

const toStr = num => `this is awesome ${num}`;

// compose example
const sumOfFirstTwo = compose(
  toStr,
  square,
  head
);

// pipe example
const sumOfFirst = pipe(
  head,
  square,
  toStr
);

console.log(unCurriedSum(9, 1));

console.log(sumOfFirstTwo([4, 5, 6, 7, 8]));

console.log(sumOfFirst([4, 5, 6, 7, 8]));
