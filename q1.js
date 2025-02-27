var sum_to_n_a = function(n) {
    // mathematical formula, sum of 1 - n = n(n+1)/2
    return n*(n+1)/2;
};

var sum_to_n_b = function(n) {
    // recursion
    if (n == 1) {
        return 1;
    }
    return n + sum_to_n_b(n-1);
};

var sum_to_n_c = function(n) {
    // iterative loop
    var sum = 0;
    for (var i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// test cases
console.log("Testing sum_to_n_a")
console.log("n = 10: ", sum_to_n_a(10));
console.log("n = 100: ", sum_to_n_a(100));

console.log("Testing sum_to_n_b")
console.log("n = 10: ", sum_to_n_b(10));
console.log("n = 100: ", sum_to_n_b(100));

console.log("Testing sum_to_n_c")
console.log("n = 10: ", sum_to_n_c(10));
console.log("n = 100: ", sum_to_n_c(100));
