import type { ComfyWorkflowJSON } from '@/platform/workflow/validation/schemas/workflowSchema'
import type { PromptId, TaskOutput } from '@/schemas/apiSchema'
import {
  getWorkflowFromJob,
  getOutputsFromJob
} from '@/platform/remote/comfyui/jobs'

/**
 * Fetches workflow from jobs API
 * @param fetchApi - API instance with fetchApi method
 * @param promptId - The prompt ID to fetch workflow for
 * @returns Promise resolving to workflow or undefined if not found
 */
export async function getWorkflowFromHistory(
  fetchApi: (url: string) => Promise<Response>,
  promptId: PromptId
): Promise<ComfyWorkflowJSON | undefined> {
  return getWorkflowFromJob(fetchApi, promptId)
}

/**
 * Fetches full outputs from jobs API for lazy loading
 * @param fetchApi - API instance with fetchApi method
 * @param promptId - The prompt ID to fetch outputs for
 * @returns Promise resolving to full outputs or undefined if not found
 */
export async function getOutputsFromHistory(
  fetchApi: (url: string) => Promise<Response>,
  promptId: PromptId
): Promise<TaskOutput | undefined> {
  return getOutputsFromJob(fetchApi, promptId)
}
