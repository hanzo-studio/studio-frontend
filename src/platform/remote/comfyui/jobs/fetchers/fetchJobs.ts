/**
 * @fileoverview Jobs API Fetcher - Cloud backend jobs endpoint
 * @module platform/remote/comfyui/jobs/fetchers/fetchJobs
 *
 * Fetches jobs from cloud backend /api/jobs endpoint with memory optimization.
 * Used exclusively by cloud distribution as replacement for history_v2.
 */

import { mapJobsToHistory } from '../adapters/jobToTaskAdapter'
import type { HistoryV1Response } from '../../history/types/historyV1Types'
import type { JobsListResponse, JobStatus } from '../types/jobTypes'

/**
 * Fetches jobs from cloud jobs API and adapts to V1 history format
 * @internal - Used internally by fetchCompletedJobs
 * @param fetchApi - API instance with fetchApi method
 * @param statuses - Job statuses to filter by (e.g., ['completed'], ['in_progress', 'pending'])
 * @param maxItems - Maximum number of jobs to fetch
 * @param offset - Offset for pagination
 * @returns Promise resolving to V1 history response (adapted from jobs)
 */
async function fetchJobs(
  fetchApi: (url: string) => Promise<Response>,
  statuses: JobStatus[],
  maxItems: number = 200,
  offset: number = 0
): Promise<HistoryV1Response> {
  // Build query string manually to avoid URL encoding the comma in status list
  const statusParam = statuses.join(',')
  const url = `/jobs?status=${statusParam}&limit=${maxItems}&offset=${offset}`

  const res = await fetchApi(url)
  const rawData: JobsListResponse = await res.json()

  const adaptedHistory = mapJobsToHistory(rawData.jobs)
  return { History: adaptedHistory }
}

/**
 * Fetches completed jobs only
 * @param fetchApi - API instance with fetchApi method
 * @param maxItems - Maximum number of jobs to fetch
 * @param offset - Offset for pagination
 * @returns Promise resolving to V1 history response with completed jobs
 */
export async function fetchCompletedJobs(
  fetchApi: (url: string) => Promise<Response>,
  maxItems: number = 200,
  offset: number = 0
): Promise<HistoryV1Response> {
  return fetchJobs(fetchApi, ['completed'], maxItems, offset)
}
