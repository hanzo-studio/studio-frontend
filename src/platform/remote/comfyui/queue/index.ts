/**
 * @fileoverview Queue API module - Distribution-aware exports
 * @module platform/remote/comfyui/queue
 *
 * This module provides a unified queue fetching interface that automatically
 * uses the correct implementation based on build-time distribution constant.
 *
 * - Cloud builds: Uses Jobs API for active jobs (in_progress, pending)
 * - Desktop/localhost builds: Uses V1 API directly (/queue endpoint)
 *
 * The rest of the application only needs to import from this module.
 */

import { isCloud } from '@/platform/distribution/types'
import { fetchQueueV1 } from './fetchers/fetchQueueV1'
import type { JobListItem } from '../jobs/types/jobTypes'
import type { QueueResponse } from './types/queueTypes'
import type { TaskPrompt } from '@/schemas/apiSchema'

/**
 * Cloud-specific queue fetcher using Jobs API
 * Fetches active jobs (in_progress, pending) and separates them by original status
 */
async function fetchQueueCloud(
  fetchApi: (url: string) => Promise<Response>
): Promise<QueueResponse> {
  // Fetch jobs raw data before adapter conversion
  const statusParam = ['in_progress', 'pending'].join(',')
  const url = `/jobs?status=${statusParam}&limit=200&offset=0`
  const res = await fetchApi(url)
  const rawData: { jobs: JobListItem[] } = await res.json()

  // Separate by original job status before adapter loses this info
  const inProgressJobs = rawData.jobs.filter(
    (job) => job.status === 'in_progress'
  )
  const pendingJobs = rawData.jobs.filter((job) => job.status === 'pending')

  // Helper to create prompt tuple from job (main branch uses tuple schema)
  const jobToPrompt = (job: JobListItem): TaskPrompt => [
    job.create_time, // priority (already unix timestamp)
    job.id, // prompt_id (job ID is used as prompt ID)
    {}, // prompt (workflow inputs)
    { client_id: '' }, // extra_data
    [] // outputs_to_execute
  ]

  return {
    Running: inProgressJobs.map((job) => ({
      taskType: 'Running' as const,
      prompt: jobToPrompt(job),
      remove: {
        name: 'Cancel',
        cb: async () => {
          const { api } = await import('@/scripts/api')
          await api.interrupt(job.id)
        }
      }
    })),
    Pending: pendingJobs.map((job) => ({
      taskType: 'Pending' as const,
      prompt: jobToPrompt(job)
    }))
  }
}

/**
 * Fetches queue using the appropriate API for the current distribution.
 * Build-time constant enables dead code elimination - only one implementation
 * will be included in the final bundle.
 */
export const fetchQueue = isCloud ? fetchQueueCloud : fetchQueueV1

/**
 * Export types
 */
export type * from './types/queueTypes'
