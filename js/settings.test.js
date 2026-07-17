const validators = require('./settings.js');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed += 1;
    console.log('PASS: ' + message);
  } else {
    failed += 1;
    console.error('FAIL: ' + message);
  }
}

// Full name validation
assert(validators.fullName('') === 'Full name is required.', 'empty full name shows required error');
assert(validators.fullName('   ') === 'Full name is required.', 'whitespace-only full name shows required error');
assert(validators.fullName('Jane Doe') === '', 'valid full name passes');

// Email validation
assert(validators.email('') === 'Email is required.', 'empty email shows required error');
assert(validators.email('not-an-email') === 'Please enter a valid email address.', 'invalid email format fails');
assert(validators.email('user@domain') === 'Please enter a valid email address.', 'email without TLD fails');
assert(validators.email('user@example.com') === '', 'valid email passes');

// Password validation
assert(validators.password('') === 'Password is required.', 'empty password shows required error');
assert(validators.password('short1') === 'Password must be at least 8 characters.', 'password under 8 characters fails');
assert(validators.password('longenough') === 'Password must contain at least one number.', 'password without number fails');
assert(validators.password('secure123') === '', 'valid password passes');

console.log('\n--- Results ---');
console.log('Passed: ' + passed);
console.log('Failed: ' + failed);

if (failed > 0) {
  process.exit(1);
}
