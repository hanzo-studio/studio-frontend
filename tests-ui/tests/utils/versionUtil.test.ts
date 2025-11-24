import { describe, expect, it, vi } from 'vitest'

import {
  checkVersionCompatibility,
  getFrontendVersion
} from '@/workbench/extensions/manager/utils/versionUtil'

// Mock config module
vi.mock('@/config', () => ({
  default: {
    app_version: '1.24.0-1'
  }
}))

describe('versionUtil', () => {
  describe('checkVersionCompatibility', () => {
    it('should return null when current version is undefined', () => {
      const result = checkVersionCompatibility(
        'hanzo-studio_version',
        undefined,
        '>=1.0.0'
      )
      expect(result).toBeNull()
    })

    it('should return null when current version is null', () => {
      const result = checkVersionCompatibility(
        'hanzo-studio_version',
        null as any,
        '>=1.0.0'
      )
      expect(result).toBeNull()
    })

    it('should return null when current version is empty string', () => {
      const result = checkVersionCompatibility('hanzo-studio_version', '', '>=1.0.0')
      expect(result).toBeNull()
    })

    it('should return null when supported version is undefined', () => {
      const result = checkVersionCompatibility(
        'hanzo-studio_version',
        '1.0.0',
        undefined
      )
      expect(result).toBeNull()
    })

    it('should return null when supported version is null', () => {
      const result = checkVersionCompatibility(
        'hanzo-studio_version',
        '1.0.0',
        null as any
      )
      expect(result).toBeNull()
    })

    it('should return null when supported version is empty string', () => {
      const result = checkVersionCompatibility('hanzo-studio_version', '1.0.0', '')
      expect(result).toBeNull()
    })

    it('should return null when supported version is whitespace only', () => {
      const result = checkVersionCompatibility(
        'hanzo-studio_version',
        '1.0.0',
        '   '
      )
      expect(result).toBeNull()
    })

    describe('version compatibility checks', () => {
      it('should return null when version satisfies >= requirement', () => {
        const result = checkVersionCompatibility(
          'hanzo-studio_version',
          '2.0.0',
          '>=1.0.0'
        )
        expect(result).toBeNull()
      })

      it('should return null when version exactly matches requirement', () => {
        const result = checkVersionCompatibility(
          'hanzo-studio_version',
          '1.0.0',
          '1.0.0'
        )
        expect(result).toBeNull()
      })

      it('should return null when version satisfies ^ requirement', () => {
        const result = checkVersionCompatibility(
          'hanzo-studio_version',
          '1.2.3',
          '^1.0.0'
        )
        expect(result).toBeNull()
      })

      it('should return null when version satisfies ~ requirement', () => {
        const result = checkVersionCompatibility(
          'hanzo-studio_version',
          '1.0.5',
          '~1.0.0'
        )
        expect(result).toBeNull()
      })

      it('should return null when version satisfies range requirement', () => {
        const result = checkVersionCompatibility(
          'hanzo-studio_version',
          '1.5.0',
          '1.0.0 - 2.0.0'
        )
        expect(result).toBeNull()
      })

      it('should return conflict when version does not satisfy >= requirement', () => {
        const result = checkVersionCompatibility(
          'hanzo-studio_version',
          '0.9.0',
          '>=1.0.0'
        )
        expect(result).toEqual({
          type: 'hanzo-studio_version',
          current_value: '0.9.0',
          required_value: '>=1.0.0'
        })
      })

      it('should return conflict when version does not satisfy ^ requirement', () => {
        const result = checkVersionCompatibility(
          'hanzo-studio_version',
          '2.0.0',
          '^1.0.0'
        )
        expect(result).toEqual({
          type: 'hanzo-studio_version',
          current_value: '2.0.0',
          required_value: '^1.0.0'
        })
      })

      it('should return conflict when version is outside range', () => {
        const result = checkVersionCompatibility(
          'hanzo-studio_version',
          '3.0.0',
          '1.0.0 - 2.0.0'
        )
        expect(result).toEqual({
          type: 'hanzo-studio_version',
          current_value: '3.0.0',
          required_value: '1.0.0 - 2.0.0'
        })
      })
    })

    describe('version cleaning', () => {
      it('should handle versions with v prefix', () => {
        const result = checkVersionCompatibility(
          'hanzo-studio_version',
          'v1.0.0',
          '>=1.0.0'
        )
        expect(result).toBeNull()
      })

      it('should handle versions with pre-release tags', () => {
        // Pre-release versions have specific semver rules
        // 1.0.0-alpha satisfies >=1.0.0-alpha but not >=1.0.0
        const result = checkVersionCompatibility(
          'hanzo-studio_version',
          '1.0.0-alpha',
          '>=1.0.0-alpha'
        )
        expect(result).toBeNull()

        // This should fail because pre-release < stable
        const result2 = checkVersionCompatibility(
          'hanzo-studio_version',
          '1.0.0-alpha',
          '>=1.0.0'
        )
        expect(result2).toEqual({
          type: 'hanzo-studio_version',
          current_value: '1.0.0-alpha',
          required_value: '>=1.0.0'
        })
      })

      it('should handle versions with build metadata', () => {
        const result = checkVersionCompatibility(
          'hanzo-studio_version',
          '1.0.0+build123',
          '>=1.0.0'
        )
        expect(result).toBeNull()
      })

      it('should handle malformed versions gracefully', () => {
        const result = checkVersionCompatibility(
          'hanzo-studio_version',
          'not-a-version',
          '>=1.0.0'
        )
        expect(result).toEqual({
          type: 'hanzo-studio_version',
          current_value: 'not-a-version',
          required_value: '>=1.0.0'
        })
      })
    })

    describe('different conflict types', () => {
      it('should handle hanzo-studio_version type', () => {
        const result = checkVersionCompatibility(
          'hanzo-studio_version',
          '0.5.0',
          '>=1.0.0'
        )
        expect(result?.type).toBe('hanzo-studio_version')
      })

      it('should handle frontend_version type', () => {
        const result = checkVersionCompatibility(
          'frontend_version',
          '0.5.0',
          '>=1.0.0'
        )
        expect(result?.type).toBe('frontend_version')
      })
    })

    describe('complex version ranges', () => {
      it('should handle OR conditions with ||', () => {
        const result = checkVersionCompatibility(
          'hanzo-studio_version',
          '1.5.0',
          '>=1.0.0 <2.0.0 || >=3.0.0'
        )
        expect(result).toBeNull()
      })

      it('should handle multiple constraints', () => {
        const result = checkVersionCompatibility(
          'hanzo-studio_version',
          '1.5.0',
          '>=1.0.0 <2.0.0'
        )
        expect(result).toBeNull()
      })

      it('should return conflict when no constraints are met', () => {
        const result = checkVersionCompatibility(
          'hanzo-studio_version',
          '2.5.0',
          '>=1.0.0 <2.0.0 || >=3.0.0 <4.0.0'
        )
        expect(result).toEqual({
          type: 'hanzo-studio_version',
          current_value: '2.5.0',
          required_value: '>=1.0.0 <2.0.0 || >=3.0.0 <4.0.0'
        })
      })
    })
  })

  describe('getFrontendVersion', () => {
    it('should return app_version from config when available', () => {
      const version = getFrontendVersion()
      expect(version).toBe('1.24.0-1')
    })

    it('should fallback to VITE_APP_VERSION when app_version is not available', async () => {
      // Save original environment
      const originalEnv = import.meta.env.VITE_APP_VERSION

      // Mock config without app_version
      vi.doMock('@/config', () => ({
        default: {}
      }))

      // Set VITE_APP_VERSION
      import.meta.env.VITE_APP_VERSION = '2.0.0'

      // Clear module cache to force re-import
      vi.resetModules()

      // Import fresh module
      const versionUtil = await import(
        '@/workbench/extensions/manager/utils/versionUtil'
      )

      const version = versionUtil.getFrontendVersion()
      expect(version).toBe('2.0.0')

      // Restore original env
      import.meta.env.VITE_APP_VERSION = originalEnv

      // Reset mocks for next test
      vi.resetModules()
      vi.doMock('@/config', () => ({
        default: {
          app_version: '1.24.0-1'
        }
      }))
    })

    it('should return undefined when no version is available', async () => {
      // Save original environment
      const originalEnv = import.meta.env.VITE_APP_VERSION

      // Mock config without app_version
      vi.doMock('@/config', () => ({
        default: {}
      }))

      // Clear VITE_APP_VERSION
      delete import.meta.env.VITE_APP_VERSION

      // Clear module cache to force re-import
      vi.resetModules()

      // Import fresh module
      const versionUtil = await import(
        '@/workbench/extensions/manager/utils/versionUtil'
      )

      const version = versionUtil.getFrontendVersion()
      expect(version).toBeUndefined()

      // Restore original env
      if (originalEnv !== undefined) {
        import.meta.env.VITE_APP_VERSION = originalEnv
      }

      // Reset mocks for next test
      vi.resetModules()
      vi.doMock('@/config', () => ({
        default: {
          app_version: '1.24.0-1'
        }
      }))
    })
  })
})
