// Reverse a string
function reverseString(str) {
    return str.split('').reverse().join('');
}
console.log('Reverse Test : ' + reverseString('This my testing string'));

// Check Palindrome
function isPalindrome(str) {
    const reversed = str.split('').reverse().join('');
    return str.toLowerCase() === reversed.toLowerCase();
}
console.log('Result Check Palindrome : ' + isPalindrome('Jalaj'));

// Make Palindrome string
function makePalindrome(str) {
    const reverse = str.slice(0, -1).split('').reverse().join('');
    return str + reverse;
}
console.log('Palindrome Test : ' + makePalindrome('mad'));

// Find Largest Number in Array
function findLargest(arr) {
    return Math.max(...arr);
}
console.log('Largest No : ' + findLargest([10, 5, 20, 8]));

// Count Vowels
function countVowels(str) {
    return str.match(/[aeiou]/gi)?.length || 0;
}
console.log('No of Vowels : ' + countVowels("javascript"));

// Remove duplicate from array
function removeDuplicates(arr) {
    return [...new Set(arr)];
}
console.log('Duplicate Removed array : ' + removeDuplicates([1, 2, 2, 3, 3, 4]));

// Find Missing Number
function findMissing(arr) {
    const n = arr.length + 1;
    const expected = (n * (n + 1)) / 2;
    const actual = arr.reduce((sum, num) => sum + num, 0);
    return expected - actual;
}
console.log('Missing Number : ' + findMissing([1, 2, 3, 5]));

// Flatten Nested array
function flatten(arr) {
    return arr.flat(Infinity);
}
console.log('Flatten Nested array : ' + flatten([1, [2, [3, 4], 5]]));

// Group by role
const users = [
    { name: "John", role: "Admin" },
    { name: "Jane", role: "User" },
    { name: "Mike", role: "Admin" }
];

const grouped = users.reduce((acc, user) => {
    acc[user.role] = acc[user.role] || [];
    acc[user.role].push(user);
    return acc;
}, {});

console.log(grouped);