/**
 * @fileoverview Job Detail Fetcher - Fetches full job details for lazy loading
 * @module platform/remote/comfyui/jobs/fetchers/fetchJobDetail
 *
 * Fetches detailed job information including full workflow and outputs.
 * Used for lazy loading when user loads a workflow from history.
 */

import type { ComfyWorkflowJSON } from '@/platform/workflow/validation/schemas/workflowSchema'
import type { PromptId, TaskOutput } from '@/schemas/apiSchema'
import type { JobDetail } from '../types/jobTypes'

/**
 * Fetches full job details from /api/jobs/{job_id}
 * @internal - Used internally by getWorkflowFromJob and getOutputsFromJob
 * @param fetchApi - API instance with fetchApi method
 * @param promptId - The prompt ID to fetch details for
 * @returns Promise resolving to full job details or undefined if not found
 */
async function getJobDetail(
  fetchApi: (url: string) => Promise<Response>,
  promptId: PromptId
): Promise<JobDetail | undefined> {
  try {
    // Note: We use prompt_id as the job identifier since frontend works with prompt IDs
    const res = await fetchApi(`/jobs/${promptId}`)

    if (!res.ok) {
      console.warn(`Job not found for prompt ${promptId}`)
      return undefined
    }

    // Backend returns job detail directly, not wrapped in { job: ... }
    const jobDetail: JobDetail = await res.json()
    return jobDetail
  } catch (error) {
    console.error(`Failed to fetch job detail for prompt ${promptId}:`, error)
    return undefined
  }
}

/**
 * Fetches workflow from job details
 * @param fetchApi - API instance with fetchApi method
 * @param promptId - The prompt ID to fetch workflow for
 * @returns Promise resolving to workflow or undefined if not found
 */
export async function getWorkflowFromJob(
  fetchApi: (url: string) => Promise<Response>,
  promptId: PromptId
): Promise<ComfyWorkflowJSON | undefined> {
  const jobDetail = await getJobDetail(fetchApi, promptId)
  // Extract workflow from nested structure: workflow.extra_data.extra_pnginfo.workflow
  return jobDetail?.workflow?.extra_data?.extra_pnginfo?.workflow
}

/**
 * Fetches full outputs from job details for lazy loading
 * @param fetchApi - API instance with fetchApi method
 * @param promptId - The prompt ID to fetch outputs for
 * @returns Promise resolving to full outputs or undefined if not found
 */
export async function getOutputsFromJob(
  fetchApi: (url: string) => Promise<Response>,
  promptId: PromptId
): Promise<TaskOutput | undefined> {
  const jobDetail = await getJobDetail(fetchApi, promptId)
  return jobDetail?.outputs
}
