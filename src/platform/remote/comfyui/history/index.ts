/**
 * @fileoverview History API module - Distribution-aware exports
 * @module platform/remote/comfyui/history
 *
 * This module provides a unified history fetching interface that automatically
 * uses the correct implementation based on build-time distribution constant.
 *
 * - Cloud builds: Uses Jobs API for memory optimization (tree-shakes V1/V2 fetchers)
 * - Desktop/localhost builds: Uses V1 API directly (tree-shakes cloud fetchers)
 *
 * The rest of the application only needs to import from this module and use
 * V1 types - all distribution-specific details are encapsulated here.
 */

import { isCloud } from '@/platform/distribution/types'
import { fetchHistoryV1 } from './fetchers/fetchHistoryV1'
import { fetchCompletedJobs } from '../jobs'
import type { HistoryV1Response } from './types/historyV1Types'

/**
 * Cloud-specific history fetcher using Jobs API
 * Fetches completed jobs with memory-optimized preview_output format
 */
async function fetchHistoryCloud(
  fetchApi: (url: string) => Promise<Response>,
  maxItems: number = 200
): Promise<HistoryV1Response> {
  // Fetch completed jobs only for history view
  return fetchCompletedJobs(fetchApi, maxItems, 0)
}

/**
 * Fetches history using the appropriate API for the current distribution.
 * Build-time constant enables dead code elimination - only one implementation
 * will be included in the final bundle.
 */
export const fetchHistory = isCloud ? fetchHistoryCloud : fetchHistoryV1

/**
 * Export only V1 types publicly - consumers don't need to know about V2
 */
export type * from './types'
