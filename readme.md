
1️⃣ What is the difference between var, let, and const?

Ans:
All these three keywords are used to declare and initialize variables.

We no longer use 'var' becasue variables declared using 'var' are accessable outside the block where they were created. It can lead to unintended issues. So it now recommended to use 'let' keyword instead.

We use 'const' keyword to decalre variable and initialize with a value but this value cannot be reassigned or modified afterwards.



-------------------------------------
2️⃣ What is the spread operator (...)?

Ans:
Spread operator is used to expand the data stored inside arrays and object so that they can be used to copy, merge or other operations.

example:

const fruits = ["apple", "banana"];
const vegetables = ["carrot", "broccoli"];

When the following statement is used,
const food1 = [fruits, vegetables]; 

the output will be 
 [["apple", "banana"], ["carrot", "broccoli"]]
they remin inside their array and both become members of the array 'food1' 

When we use the spread operatior in the following statement:
const food2 = [...fruits, ...vegetables];

the output will be 
 ["apple", "banana", "carrot", "broccoli"]

individual items of each array first become separated and then all become members of the new array.

-----------------------------------------------------------------
3️⃣ What is the difference between map(), filter(), and forEach()?

Ans:
The given three methods map(), filter() and forEach() are used to process items inside of list items like arrays.

---------------
forEach()
  It can perform operations on each items of the list but do not change them and returns nothing. 

const numbers = [1, 2, 3, 4, 5];
numbers.forEach(number => {
  console.log(number * 2);  
});

The output is:
  2, 4, 6, 8, 10

The original array remains unchanged:
console.log(numbers);  

The output is:
  [1, 2, 3, 4, 5] 


--------------
map() 

Creates a new array by transforming each of them and returns a new array but do not change the items of the original array.

const numbers = [1, 2, 3, 4];

const doubled = numbers.map(n => n * 2);
console.log(doubled);
console.log(numbers);

The outputs are: 
   [2, 4, 6, 8]
   [1, 2, 3, 4]



--------------
filter()
It is used to get only some items from a list that passes certain condition. It returns a new array but do not change the original array.

const numbers = [1, 2, 3, 4];


const evenNumbers = numbers.filter(n => n % 2 === 0);
console.log(evenNumbers);
console.log(numbers);

The outputs are: 
  [2, 4]
  [1, 2, 3, 4]


-----------------------------
4️⃣ What is an arrow function?

Ans:

Arrow functions are shorter ways to write Javascript functions. 

Example-1:
// Regular function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

Example-2:
// Regular function
function double(x) {
  return x * 2;
}

// Arrow function
const double = x => x * 2;


------------------------------
5️⃣ What are template literals?

Ans:
Template literals are a way we can use long strings in Javascript where we can use variables inside the string. We use backticks '`' and variables are used inside a '${variable_name}'. We can use multiple lines of strings.

Example:

const name = "Sam";
const message = `Hello, ${name}!`;

----------------------------------