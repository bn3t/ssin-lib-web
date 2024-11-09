[![Netlify Status](https://api.netlify.com/api/v1/badges/6bccf062-2852-4764-aa50-1f72ee9aed87/deploy-status)](https://app.netlify.com/sites/ssin-lib/deploys)

# Belgian SSIN Generator and Validator

This project provides a web application for generating and validating Belgian Social Security Identification Numbers (SSIN). It includes both a generator that creates valid SSINs based on input parameters and a validator that checks and analyzes existing SSINs.

## Features

- **SSIN Generator**

  - Generate valid SSINs based on birth date, gender, and order number
  - Automatic validation of input parameters
  - Gender-specific order number validation (odd for males, even for females)
  - Copy formatted or raw SSIN to clipboard
  - Clear explanation of order number rules

- **SSIN Validator**
  - Validate existing SSINs
  - Display detailed SSIN information including:
    - Birth date
    - Gender
    - Formatted and raw number representations
  - Automatic formatting of input
  - Comprehensive error messages for invalid SSINs

## Technical Stack

- React
- TypeScript
- Ant Design (UI components)
- [@bn3t/ssin-lib](https://www.npmjs.com/package/@bn3t/ssin-lib) for SSIN calculations
- Vitest for testing
- Tailwind CSS for styling

## Installation

1. Clone the repository:

```bash
git clone git@github.com:bn3t/ssin-lib-web.git
cd ssin-lib-web
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Testing

The project includes comprehensive test coverage for both the generator and validator components. Run the tests using:

```bash
npm test
```

Test files can be found in:

- `src/components/__tests__/GeneratorForm.test.tsx`
- `src/components/__tests__/ValidatorForm.test.tsx`

## Project Structure

```
src/
├── components/
│   ├── GeneratorForm.tsx     # SSIN generator component
│   ├── ValidatorForm.tsx     # SSIN validator component
│   ├── MobileNav.tsx         # Mobile navigation component
│   └── __tests__/           # Component tests
├── content/
│   └── config.ts            # Content configuration
└── test/
    └── setup.tsx            # Test setup configuration
```

## SSIN Format

A Belgian SSIN consists of 11 digits in the format: `YY.MM.DD-OOO.CC`

- `YY`: Year of birth (00-99)
- `MM`: Month of birth (01-12)
- `DD`: Day of birth (01-31)
- `OOO`: Order number
  - Males: Odd numbers (001-997)
  - Females: Even numbers (002-998)
- `CC`: Check digits

## License

This project is licensed under the MIT License.

## Contributing

Feel free to contribute by opening issues or submitting pull requests.

## Contact

If you have any questions or feedback, feel free to reach out.

### Note

This library is designed to work with specific formats of SSIN and may not cover all edge cases for every country. Please make sure it fits your use case before using it in a production environment.

## Acknowledgments

- [@bn3t/ssin-lib](https://www.npmjs.com/package/@bn3t/ssin-lib) for SSIN generation and validation
- [Astro](https://astro.build/) for static site generation and routing
- [Ant Design](https://ant.design/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
