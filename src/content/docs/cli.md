---
title: 'CLI Documentation'
description: 'The SSIN CLI tool provides command-line utilities for validating and generating Belgian Social Security Identification Numbers.'
---

The SSIN CLI tool provides command-line utilities for validating and generating Belgian Social Security Identification Numbers. It's available as both an npm package and as standalone executables for all major platforms.

## Installation

### Via NPM

```bash
npm install -g @bn3t/ssin-lib
```

### Standalone Executables

Pre-built executables are available for each release on GitHub:

- Windows: `ssin-win.exe`
- macOS: `ssin-macos` (Intel and Apple Silicon)
- Linux: `ssin-linux`

Download the appropriate executable for your platform from the [releases page](https://github.com/bn3t/ssin-lib/releases).

## Commands

### Validate SSIN

Validate an existing SSIN number:

```bash
ssin validate 05.02.09-407.53
```

Or without formatting:

```bash
ssin validate 05020940753
```

Output example:

```
✓ Valid SSIN
Formatted: 05.02.09-407.53
Birth Date: 2005-02-09
Gender: MALE
```

### Generate SSIN

Generate a new SSIN number:

```bash
# Basic generation with required parameters
ssin generate -d 2005-02-09 -g M -o 407

# Or with long options
ssin generate --date 2005-02-09 --gender M --order 407
```

Options:

- `-d, --date`: Birth date (YYYY-MM-DD)
- `-g, --gender`: Gender (M/F)
- `-o, --order`: Order number (001-997 for males, 002-998 for females)

Output example:

```
Generated SSIN: 05.02.09-407.53
```

### Help Commands

Get general help:

```bash
ssin --help
```

Get command-specific help:

```bash
ssin validate --help
ssin generate --help
```

## Examples

### Validation Examples

```bash
# Validate a formatted SSIN
ssin validate 05.02.09-407.53

# Validate an unformatted SSIN
ssin validate 05020940753

# Validate with verbose output
ssin validate -v 05.02.09-407.53
```

### Generation Examples

```bash
# Generate for a male
ssin generate -d 2005-02-09 -g M -o 407

# Generate for a female
ssin generate -d 2005-02-09 -g F -o 408

# Generate with random order number
ssin generate -d 2005-02-09 -g M --random-order
```

## Error Messages

The CLI provides clear error messages for various scenarios:

```bash
# Invalid format
$ ssin validate 1234
✗ Error: Invalid SSIN format. Must be 11 digits.

# Invalid check digits
$ ssin validate 05020940754
✗ Error: Invalid check digits.

# Invalid birth date
$ ssin validate 99139940753
✗ Error: Invalid birth date.
```

## Environment Variables

You can configure certain behaviors using environment variables:

- `SSIN_NO_COLOR`: Disable colored output
- `SSIN_FORMAT`: Set default output format (raw/formatted)

Example:

```bash
export SSIN_NO_COLOR=1
ssin validate 05020940753
```

## Integration

### Using in Scripts

The CLI is designed to be script-friendly:

```bash
# Check exit code
if ssin validate 05020940753 > /dev/null; then
    echo "Valid SSIN"
fi

# Process output
SSIN=$(ssin generate -d 2005-02-09 -g M -o 407 --raw)
echo "Generated: $SSIN"
```

### Batch Processing

Process multiple SSINs from a file:

```bash
# Process a list of SSINs
while read -r ssin; do
    ssin validate "$ssin"
done < ssins.txt
```

## Best Practices

1. **Use Raw Format in Scripts**:

   ```bash
   ssin validate --raw 05020940753
   ```

2. **Validate Input First**:

   ```bash
   if ssin validate "$input"; then
       # Process valid SSIN
   fi
   ```

3. **Use Verbose Mode for Debugging**:
   ```bash
   ssin validate -v "$input"
   ```

## Troubleshooting

Common issues and solutions:

1. **Permission Denied**

   ```bash
   # For standalone executables
   chmod +x ./ssin-linux
   ```

2. **Command Not Found**
   ```bash
   # For npm installation
   npm list -g @bn3t/ssin-lib
   ```

## Platform-Specific Notes

### Windows

- The executable can be run from Command Prompt or PowerShell
- Consider adding the executable location to your PATH

### macOS

- Both Intel and Apple Silicon binaries are provided
- You may need to allow execution in Security & Privacy settings

### Linux

- The executable is built for x86_64
- Make sure to set executable permissions

## Updates

To update the CLI:

### NPM Version

```bash
npm update -g @bn3t/ssin-lib
```

### Standalone Executables

Download the latest version from the [releases page](https://github.com/bn3t/ssin-lib/releases).

## Support

If you encounter any issues:

1. Check the [GitHub Issues](https://github.com/bn3t/ssin-lib/issues)
2. Create a new issue if needed
3. Include your platform and CLI version (`ssin --version`)
