# @hanzo-studio/tailwind-utils

Shared Tailwind CSS utility functions for the Hanzo Studio Frontend monorepo.

## Usage

The `cn` function combines `clsx` and `tailwind-merge` to handle conditional classes and resolve Tailwind conflicts.

```typescript
import { cn } from '@hanzo-studio/tailwind-utils'

// Use with conditional classes (object)
<div :class="cn('transition-opacity', { 'opacity-75': !isHovered })" />

// Use with conditional classes (ternary)
<button
  :class="cn('px-4 py-2', isActive ? 'bg-blue-500' : 'bg-smoke-500')"
/>
```

## Installation

This package is part of the Hanzo Studio Frontend monorepo and is automatically available to all workspace packages.

```json
{
  "dependencies": {
    "@hanzo-studio/tailwind-utils": "workspace:*"
  }
}
```
