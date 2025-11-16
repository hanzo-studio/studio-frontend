/**
 * @fileoverview Jobs API types - Cloud backend job API format
 * @module platform/remote/comfyui/jobs/types/jobTypes
 *
 * These types represent the jobs API format returned by the cloud backend.
 * Jobs API provides a memory-optimized alternative to history API.
 */

import type { TaskOutput } from '@/schemas/apiSchema'

/**
 * Job status mapping from internal states to user-friendly statuses
 */
export type JobStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'cancelled'

/**
 * Preview output from jobs table - lightweight preview data
 */
interface PreviewOutput {
  filename: string
  subfolder: string
  type: 'output' | 'temp' | 'input'
}

/**
 * Job list item - returned by GET /api/jobs (list endpoint)
 * Optimized for volume with minimal data
 */
export interface JobListItem {
  id: string // Job ID (also used as prompt_id)
  status: JobStatus
  create_time: number // Unix timestamp
  update_time: number // Unix timestamp
  last_state_update: number | null
  preview_output?: PreviewOutput | null
  output_count?: number // Number of outputs (for showing count before lazy-loading)
  error_message?: string | null
}

/**
 * Workflow structure from backend
 */
interface WorkflowResponse {
  extra_data: {
    extra_pnginfo?: {
      workflow: any // The actual ComfyWorkflowJSON
    }
  }
  prompt: Record<string, any> // Node definitions
}

/**
 * Execution status information
 */
interface ExecutionStatus {
  completed: boolean
  messages: Array<[string, any]> // Array of [event_type, event_data] tuples
  status_str: string // e.g., "success", "error"
}

/**
 * Execution metadata for a node
 */
interface ExecutionNodeMeta {
  node_id: string
  display_node: string
  parent_node: string | null
  real_node_id: string
}

/**
 * Job detail - returned by GET /api/jobs/{job_id} (detail endpoint)
 * Includes full workflow and outputs for re-execution and downloads
 */
export interface JobDetail extends JobListItem {
  workflow: WorkflowResponse // Full workflow structure from backend
  outputs: TaskOutput // Full outputs from history table
  output_count?: number // Number of outputs
  execution_status?: ExecutionStatus // Execution progress and messages
  execution_meta?: Record<string, ExecutionNodeMeta> // Node execution metadata
}

/**
 * Jobs list response structure
 */
export interface JobsListResponse {
  jobs: JobListItem[]
  total: number
  offset: number
  limit: number
}
