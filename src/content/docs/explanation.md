---
title: 'Understanding SSIN Numbers'
description: 'Learn about Belgian Social Security Identification Numbers'
---

The Belgian Social Security Identification Number (SSIN), formerly known as the National Number, is a unique identifier assigned to each citizen. This document explains the structure, rules, and characteristics of SSIN numbers.

## Structure

An SSIN consists of 11 digits, typically formatted as: `YY.MM.DD-OOO.CC`

The number is composed of three main parts:

1. **Birth Date** (6 digits)

   - `YY`: Year of birth (last two digits)
   - `MM`: Month of birth
   - `DD`: Day of birth

2. **Order Number** (3 digits)

   - `OOO`: A sequence number for people born on the same day
   - For men: odd numbers from 001 to 997
   - For women: even numbers from 002 to 998

3. **Check Digits** (2 digits)
   - `CC`: A control number calculated from the previous digits

## Gender Determination

The gender of a person can be determined from their SSIN:

- If the order number is **odd** (001, 003, ..., 997), the person is **male**
- If the order number is **even** (002, 004, ..., 998), the person is **female**

## Check Digit Calculation

The check digits are calculated as follows:

1. For people born before 2000:

   - Take the 9-digit number formed by the birthdate and order number
   - Divide this number by 97
   - Subtract the remainder from 97
   - The result is the check digits

2. For people born from 2000 onwards:
   - Add '2' in front of the 9-digit number
   - Divide this 10-digit number by 97
   - Subtract the remainder from 97
   - The result is the check digits

## Special Cases

### Incomplete Birth Dates

When only partial birth date information is known:

- Unknown day: Represented as `YY.MM.00`
- Unknown month and day: Represented as `YY.00.00`

### Unknown Birth Date

When no birth date information is known:

- For 20th century: Uses `00.00.1900`
- For 21st century: Uses `00.00.2000`

### Multiple Registrations

In the rare case where two people:

- Are born on the same day
- Have the same name and first names
- Are of the same gender

The municipality can request a special registration process through the National Register.

## Important Notes

1. **Uniqueness**: Each SSIN is unique and cannot be reused, even after being cancelled.

2. **Error Correction**: If an error is made in gender or birth date:

   - The SSIN must be cancelled
   - A new number must be issued
   - No corrections to existing numbers are possible

3. **Format Changes**: The system was modified in 2000 to handle the new millennium by:
   - Restarting order numbers for people born from January 1, 2000
   - Adding the prefix '2' for check digit calculation
   - Maintaining the same 11-digit format

## Historical Context

This numbering system was established to provide unique identification for Belgian citizens and residents. The format was modified in 1997 (published in Belgian Monitor on December 16, 1997) to handle the transition to the year 2000, while maintaining backward compatibility with existing numbers.
