---
title: 'Library Documentation'
description: 'The SSIN (Social Security Identification Number) library provides a robust TypeScript implementation for handling Belgian social security numbers.'
---

The SSIN (Social Security Identification Number) library provides a robust TypeScript implementation for handling Belgian social security numbers. It offers comprehensive validation, formatting, and generation capabilities while maintaining strict type safety.

## Installation

Install via npm:

```bash
npm install @bn3t/ssin-lib
```

Or using yarn:

```bash
yarn add @bn3t/ssin-lib
```

## Core Features

### 1. SSIN Validation

The library provides comprehensive validation of SSIN numbers:

```typescript
import { SSIN } from '@bn3t/ssin-lib';

// Create and validate an SSIN
try {
  const ssin = new SSIN('05020940753');
  console.log('SSIN is valid');
} catch (error) {
  console.error('Invalid SSIN:', error.message);
}
```

### 2. Formatting

Convert between raw and formatted representations:

```typescript
import { SSIN } from '@bn3t/ssin-lib';

const ssin = new SSIN('05020940753');

// Get formatted version (YY.MM.DD-OOO.CC)
console.log(ssin.getFormattedSSIN()); // "05.02.09-407.53"

// The raw number is always available
console.log(ssin.toString()); // "05020940753"
```

### 3. Information Extraction

Extract various components from a valid SSIN:

```typescript
import { SSIN } from '@bn3t/ssin-lib';

const ssin = new SSIN('05020940753');

// Get birth date
const birthdate = ssin.getBirthdate();
console.log(birthdate?.toString()); // "2005-02-09"

// Get gender
console.log(ssin.getGender()); // "MALE"

// Get order number
console.log(ssin.getOrderNumber()); // 407

// Get check digits
console.log(ssin.getCheckDigits()); // 53
```

### 4. SSIN Generation

Generate valid SSIN numbers based on provided information:

```typescript
import { SSIN, LocalDate } from '@bn3t/ssin-lib';

// Generate from birthdate and order number
const birthdate = LocalDate.of(2005, 2, 9);
const orderNumber = 407;
const ssin = SSIN.generateFromBirthdateAndOrderNumber(birthdate, orderNumber);

console.log(ssin.getFormattedSSIN()); // "05.02.09-407.53"
```

## Working with Dates

The library uses a custom `LocalDate` class for date handling:

```typescript
import { LocalDate } from '@bn3t/ssin-lib';

// Create a LocalDate
const date = LocalDate.of(2005, 2, 9);

// Get components
console.log(date.getYear()); // 2005
console.log(date.getMonth()); // 2
console.log(date.getDay()); // 9

// Format date
console.log(date.toString()); // "2005-02-09"
```

## Validation Details

The library performs several validation checks:

1. **Length Validation**: Ensures the SSIN is exactly 11 digits
2. **Date Validation**: Verifies the birth date is valid
3. **Order Number Validation**: Checks if the order number matches the gender rules
4. **Check Digit Validation**: Verifies the check digits are correct

Example with explicit validation:

```typescript
import { SSIN } from '@bn3t/ssin-lib';

try {
  const ssin = new SSIN('05020940753');

  // All these will throw if invalid
  ssin.validateLength();
  ssin.validateBirthdate();
  ssin.validateOrderNumber();
  ssin.validateCheckDigits();

  console.log('SSIN is valid');
} catch (error) {
  console.error('Validation failed:', error.message);
}
```

## Error Handling

The library throws specific error types for different validation failures:

```typescript
try {
  const ssin = new SSIN('invalid');
} catch (error) {
  if (error instanceof SSINValidationError) {
    console.error('Validation failed:', error.message);
  } else if (error instanceof SSINFormatError) {
    console.error('Format error:', error.message);
  }
}
```

## Type Definitions

The library provides TypeScript definitions for all its components:

```typescript
interface ISSIN {
  getFormattedSSIN(): string;
  getBirthdate(): LocalDate | null;
  getGender(): Gender;
  getOrderNumber(): number;
  getCheckDigits(): number;
  toString(): string;
}

enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
```

## Best Practices

1. **Always use try-catch**:

   ```typescript
   try {
     const ssin = new SSIN(userInput);
   } catch (error) {
     handleValidationError(error);
   }
   ```

2. **Prefer formatted output**:

   ```typescript
   // Good
   console.log(ssin.getFormattedSSIN());

   // Less readable
   console.log(ssin.toString());
   ```

3. **Validate early**:

   ```typescript
   function processSSIN(ssinString: string) {
     // Validate SSIN first
     const ssin = new SSIN(ssinString);

     // Continue with validated SSIN
     const birthdate = ssin.getBirthdate();
     // ...
   }
   ```

## Contributing

Contributions are welcome! Please feel free to submit pull requests, report issues, or suggest improvements through the GitHub repository.

## License

This library is licensed under the MIT License.

## Support

If you encounter any issues or have questions:

1. Check the [GitHub Issues](https://github.com/bn3t/ssin-lib/issues)
2. Create a new issue if needed
3. Refer to the source code for detailed implementation

Remember to check for updates regularly as new features and improvements are added to the library.
