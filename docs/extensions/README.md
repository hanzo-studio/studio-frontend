# Hanzo Studio Extensions Documentation

## Overview

Extensions are the primary way to add functionality to Hanzo Studio. They can be custom nodes, custom nodes that render widgets (UIs made with javascript), Hanzo Studio shell UI enhancements, and more. This documentation covers everything you need to know about understanding, using, and developing extensions.

## Documentation Structure

- **[Development Guide](./development.md)** - How to develop extensions, including:
  - Extension architecture and terminology
  - How extensions load (backend vs frontend)
  - Why extensions don't work in dev server
  - Development workarounds and best practices
  
- **[Core Extensions Reference](./core.md)** - Detailed reference for core extensions:
  - Complete list of all core extensions
  - Extension architecture principles
  - Hook execution sequence
  - Best practices for extension development

## Quick Links

### Key Concepts

- **Extension**: Umbrella term for any code that extends Hanzo Studio
- **Custom Nodes**: Python backend nodes (a type of extension)
- **JavaScript Extensions**: Frontend UI enhancements
- **Core Extensions**: Built-in extensions bundled with Hanzo Studio

### Common Tasks

- [Developing extensions in dev mode](./development.md#development-workarounds)
- [Understanding the shim system](./development.md#how-the-shim-works)
- [Extension hooks and lifecycle](./core.md#extension-hooks)

### External Resources

- [Official JavaScript Extension Docs](https://docs.studio.hanzo.ai/custom-nodes/js/javascript_overview)
- [ComfyExtension TypeScript Interface](../../src/types/comfy.ts)

## Need Help?

- Check the [Development Guide](./development.md) for common issues
- Review [Core Extensions](./core.md) for examples
- Visit the [Hanzo Studio Discord](https://discord.com/invite/comfyorg) for community support