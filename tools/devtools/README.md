# Hanzo Studio DevTools

This directory contains development tools and test utilities for Hanzo Studio, previously maintained as a separate repository at `https://github.com/hanzo-studio/Hanzo Studio_devtools`.

## Contents

- `__init__.py` - Server endpoints for development tools (`/api/devtools/*`)
- `dev_nodes.py` - Development and testing nodes for Hanzo Studio
- `fake_model.safetensors` - Test fixture for model loading tests

## Purpose

These tools provide:
- Test endpoints for browser automation
- Development nodes for testing various UI features
- Mock data for consistent testing environments

## Usage

During CI/CD, these files are automatically copied to the Hanzo Studio `custom_nodes` directory. For local development, copy these files to your Hanzo Studio installation:

```bash
cp -r tools/devtools/* /path/to/your/Hanzo Studio/custom_nodes/Hanzo Studio_devtools/
```

## Migration

This directory was created as part of issue #4683 to merge the Hanzo Studio_devtools repository into the main frontend repository, eliminating the need for separate versioning and simplifying the development workflow.