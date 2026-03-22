# COMMITVER

Simple commit with automatic versioning for Visual Studio Code.

## Features

- **Automatic Versioning**: Automatically increments patch version on each commit
- **Quick Commit**: One-click commit with version tagging
- **Package.json Update**: Automatically updates your project's package.json version
- **Smart Message Formatting**: Formats commit messages as `v1.0.24 Your message`

## How to Use

1. Open your project in VS Code
2. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
3. Type "Quick Commit with Version" and select it
4. Enter your commit message
5. Confirm the commit with the generated version

## Example

```text
Input: "Fix bug in authentication"
Output: "v1.0.25 Fix bug in authentication"
```

The extension will:

- Create a git commit with the versioned message
- Update your package.json to version 1.0.25
- Show confirmation of both actions

## Requirements

- Git repository
- package.json in your project root (for version tracking)

## Extension Settings

This extension contributes no settings at this time.

## Release Notes

### 1.0.24

- Initial release
- Basic version increment functionality
- Package.json integration

## Support

If you encounter any issues or have suggestions, please file an issue on our GitHub repository.

## License

ISC
