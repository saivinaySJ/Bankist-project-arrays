'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// PROJECT_#1 :BANKIST APP:

// 1.
// CREATING DOM ELEMENTS:
const displayMovements = function (movements, sort = false) {
  // *1
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
     <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
     <div class="movements__value">${mov} &euro;</div>
    </div>
    
    `;

    // InsertAdjecentHtml:

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// 3.
// Calculating the current balance from the oveents which we added in the list ok:
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

// 4.
// Calculate display summery:

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income} EUR`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} EUR`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} EUR`;
};

// 2.username:
/*
const username = user
  .toLowerCase()
  .split(' ')
  .map(function (name) {
    return name[0];
  })
  .join('');
*/
/*
// Simplify further of this callback function to a arrow function
const createUserNames = function (user) {
  const username = user
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
  return username;
};
console.log(createUserNames('Steven Thomas Williams'));
*/
// now we will use forEach method to this function:
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);
console.log(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};
// 5.
// EVENT HANDLERS:
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // This will prevent the form from submitting:
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  // Display UI and welcome message
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields:
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

// 6th part:
// IMPLEMENTING TRANSFER:
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, recieverAcc);

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

// 8th part:
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    // Add movements
    currentAccount.movements.push(amount);
    // Update UI:
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

// 7th part:
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // Delete account
    accounts.splice((index, 1));

    // Hide UI
    containerApp.style.opacity = 0;

    inputCloseUsername.value = inputClosePin.value = '';
  }
});

// 9th part:
// FOR SORTING THE MOVEMENTS :
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
// SLICE METHOD:
let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(1, -2));
console.log(arr.slice());

// SPLICE method:
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

const months = ['jan', 'march', 'april', 'june'];
months.splice(1, 0, 'feb');
months.splice(4, 1, 'may');
console.log(months);

// REVERSE method:
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

const months2 = [
  'jan',
  'feb',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'sep',
  'oct',
  'nov',
  'dec',
];
console.log(months2.reverse());
console.log(months2);

//CONCAT method:-
const letters = arr.concat(arr2);
console.log(letters);

// THE NEW 'AT' METHOD:-
const arr1 = [25, 6, 35, 7, 45, 8, 55];

// traditional way to retrive 1st element is
console.log(arr1[1]);
// using "AT method":
console.log(arr1.at(1));
// To get last element of the array:
console.log(arr1[arr1.length - 1]);
// We can also get the last element using slice method ryt
console.log(arr1.slice(-1));
console.log(arr1.slice(-1)[0]);
console.log(arr1.at(-1));
*/
/*
// FOR-EACH method:
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// 1st using for-of loop:
console.log('---using for of loop---');
for (const movement of movements) {
  if (movement > 0) {
    console.log(`You deposited ${movement}`);
  } else if (movement < 0) {
    console.log(`You withdrew ${Math.abs(movement)}`);
  }
}

console.log('---using forEach loop---');
// 2nd using forEach method:
movements.forEach(function (movement) {
  if (movement > 0) {
    console.log(`You deposited ${movement}`);
  } else if (movement < 0) {
    console.log(`You withdrew ${Math.abs(movement)}`);
  }
});

console.log('---current index---');
// We ll go deeper in forEach loop i.e(what if wen want the current index)
// 1st in for-of loop we can do this ryt:
// for(const movement of movements){
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}:You deposited ${movement}`);
  } else if (movement < 0) {
    console.log(`Movement ${i + 1}:You withdrew ${Math.abs(movement)}`);
  }
}

console.log('---current inde using forEach---');
//2nd in forEach loop we can do this ryt:
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`movement ${i + 1}:You deposited ${mov}`);
  } else if (mov < 0) {
    console.log(`movement ${i + 1}:You withdrew ${Math.abs(mov)}`);
  }
});

// Few more examples of forEach method:
// 1.
const numbers = [1, 2, 3, 5, 6, 7];
numbers.forEach(number => {
  console.log(number);
});

// 2.
const numberArr = [2, 4, 8, 12, 16];
let doubledNumber = [];
numberArr.forEach(number => {
  doubledNumber.push(number * 2);
});

console.log(doubledNumber);

// 3.
const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

months.forEach(function (mon) {
  if (mon === 'september') {
    console.log(`This ${mon} month is so precious!`);
  } else {
    console.log(`This is a unlucky ${mon} month`);
  }
});

// 4.
const colors = ['red', 'green', 'blue'];

colors.forEach(function (color, index, array) {
  console.log(`Color ${index + 1}: ${color}`);
  console.log(`Full array: ${array}`);
});

// 5.
const mixedValues = [1, 'apple', true, 42, 'banana'];
mixedValues.forEach(value => {
  if (typeof value !== 'number') {
    console.log(value);
  }
});

// forEach METHOD ON MAPS AND SETS:

// MAPS:
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
// console.log(currencies);
currencies.forEach(function (value, key, map) {
  console.log(`${key} : ${value}`);
});

// SETS:
// const currencies
*/

/*
// CODING CHALLENGE#1:
// 1.
const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice();
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);

  // dogsJulia.slice(1,3)
  // 2.creating an array:
  const dogs = dogsJuliaCorrected.concat(dogsKate);
  console.log(dogs);
  dogs.forEach(function (dog, i) {
    if (dog >= 3) {
      console.log(`Dog number ${i + 1} is an adult, and is ${dog}years old`);
    } else if (dog < 3) {
      console.log(`Dog number ${i + 1} is still a puppy🐶`);
    }
  });
};
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
*/
/*
// DATA TRANSFORMATION: MAPS,FILTER,REDUCE:
// MAP METHODS:-
 const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;
// const movementUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

const movementUSD = movements.map(mov => mov * eurToUsd);

console.log(movements);
console.log(movementUSD);

const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
console.log(movementsUSDfor);

const movementsDescriptions = movements.map((mov, i, arr) => {
  if (mov > 0) {
    return `movement ${i + 1}:You deposited ${mov}`;
  } else if (mov < 0) {
    return `movement ${i + 1}:You withdrew ${Math.abs(mov)}`;
  }
});
console.log(movementsDescriptions);
*/

// FILTER METHOD:

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/*
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits);
*/
/*
const deposits = movements.filter(mov => mov > 0);
console.log(movements);
console.log(deposits);
const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);

// Some more examples of filter method
// 1. filter even numbers between 20
const numbers = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers);

// 2.filter the given words with their length
const words = ['apple', 'banana', 'cherry', 'date', 'blueberry'];
const shortwords = words.filter(word => word.length <= 5);
console.log(shortwords);
*/
/*
// THE REDUCE METHOD:
console.log(movements);
// here ACCUMULATOR is like a SNOWBALL:
const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`Iteration ${i} : ${acc}`);
  return acc + cur;
}, 0);
console.log(balance);
// So please see the explanation of the above example

// Same example using for-of loop:
let balance2 = 0;
for (const mov of movements) {
  balance2 += mov;
}
console.log(balance2);
// sae example using arrow functions:
const balance3 = movements.reduce((acc, cur) => acc + cur, 0);
console.log(balance3);
*/
/*
// CODING CHALLENGE#2:
// 1.
const calcAverageHumanAge = function (ages) {
  const humanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));

  // 2.
  const adults = humanAge.filter(age => age >= 18);
  console.log(humanAge);
  console.log(adults);

  const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
  console.log(average);
};
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

const eurToUsd = 1.1;
const totalDepositUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositUSD);

// Coding Challenge#3:

const calcAverageHumanAge1 = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
const age1=calcAverageHumanAge1([5, 2, 4, 1, 15, 8, 3])
console.log(age1);

*/
/*
// THE FIND METHOD:-
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

// We will go to next level in this find method:
console.log(accounts);
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
*/
/*
// Some more examples of FINDINDEX method:
// 1.
const people = [
  { name: 'Saivinay', age: 25 },
  { name: 'Janani', age: 19 },
  { name: 'Suresh', age: 29 },
  { name: 'Shyam', age: 32 },
];
const targetLetter = 'J';
const index = people.findIndex(person => person.name.startsWith(targetLetter));
console.log(index);

// SOME AND EVERY METHOD:
// Some method:
const anyDeposit = movements.some(mov => mov > 0);
console.log(anyDeposit);

// Every method:
console.log(movements.every(mov => mov > 0));
// Check  for account-4 movements:
console.log(account4.movements.every(mov => mov > 0));

// FLAT AND FLATMAP method:
// FLAT method:
// Ex-1:
const arr = [[1, 2, 3], [4, 5, 6], [7, 8], 9, 10];
console.log(arr.flat());
// Ex-2
const arrDeep = [[[1, 2], 3], [4, [5, 6]], [7, 8, 9], 10];
// console.log(arrDeep.flat(1));
console.log(arrDeep.flat(2));
// Ex-3:
const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);

const allMovements = accountMovements.flat();
console.log(allMovements);

const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

const overallBalance1 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance1);

// FLATMAP method:
const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);

// SORTING ARRAYS:
// 1.Strings:
const owners = ['Saivinay', 'Janani', 'Abhilash', 'Chandrashaker'];
console.log(owners.sort());
console.log(owners);

// 2.Numbers:
console.log(movements);
*/
// return < 0 = a,b (keep the order)
// return > 0 = b,a (switch the order)
// Ascending order:
/*
movements.sort((a, b) => {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }
});
console.log(movements);
*/
movements.sort((a, b) => a - b);
console.log(movements);

/*
// Descending order:
movements.sort((a, b) => {
  if (a > b) {
    return -1;
  } else if (a < b) {
    return 1;
  }
});
console.log(movements);
*/
movements.sort((a, b) => b - a);
console.log(movements);

// MORE WAYS OF CREATING AND FILLNG ARRAYS:
console.log([1, 2, 3, 4, 5, 6, 7]);
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// Empty Arrays and Fill Method:
const x = new Array(7);
console.log(x);

// x.fill(1)
// x.fill(1,3)
x.fill(1, 3, 5);
console.log(x);

const arr = [1, 2, 3, 4, 5, 6, 7];
arr.fill(23, 3, 5);
console.log(arr);

const y = Array.from({ length: 10 }, () => 1);
console.log(y);

// Creating this below line programatically:
// const arr = [1, 2, 3, 4, 5, 6, 7];
const z = Array.from({ length: 7 }, (cur, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value')
  );
  console.log(movementsUI.map(el => el.textContent.replace('&euro', '')));
});

// ARRAY METHODS PRACTICE:
// 1.
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, cur) => acc + cur, 0);
console.log(bankDepositSum);
// 2.
/*
const numDeposit1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;
console.log(numDeposit1000);
*/
const numDeposit1000 = accounts
  .flatMap(acc => acc.movements)
  // .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
  // .reduce((count, cur) => (cur >= 1000 ? count++ : count), 0);
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(numDeposit1000);

// Prefixed ++ operator:
let m = 23;
// console.log(m++);
console.log(++m);
console.log(m);
