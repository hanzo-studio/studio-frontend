# Scripts Directory Documentation

This directory contains TypeScript code inherited from the legacy Hanzo Studio JavaScript frontend project. The code has been migrated from JavaScript to TypeScript while maintaining compatibility with the original functionality.

When implementing new features, prefer using the new Vue3 system over the legacy scripts.

## Key Components

### ComfyApi (api.ts)

Main API client class that handles communication with the Hanzo Studio backend. Provides methods for:

- Queue management
- Model operations
- Extension handling
- WebSocket communication
- User data management

### ComfyApp (app.ts)

Core application class that manages:

- Graph manipulation
- Node management
- Canvas interactions
- Extension system
- Workflow state

### UI Components (ui/)

Collection of reusable UI components including:

- Buttons and button groups
- Popups and dialogs
- Draggable lists
- Image previews
- Menu system
- Settings dialog

## Integration with Vite

All TypeScript exports are shimmed through Vite configuration to maintain compatibility with the legacy JavaScript codebase. The shimming logic can be found in `vite.config.mts`.

## Legacy Compatibility

This codebase maintains compatibility with the original [Hanzo Studio Legacy Frontend](https://github.com/hanzo-studio/Hanzo Studio_legacy_frontend) while providing TypeScript type safety and modern development features.

For users wanting to fall back to the legacy frontend, use the command line argument:

```bash
--front-end-version hanzo-studio/Hanzo Studio_legacy_frontend@latest
```
