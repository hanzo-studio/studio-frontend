/**
 * @fileoverview Adapter to convert Jobs API format to V1 history format
 * @module platform/remote/comfyui/jobs/adapters/jobToTaskAdapter
 *
 * Converts cloud backend jobs API response to frontend TaskItem format.
 * Jobs use preview_output (lightweight) instead of full outputs.
 */

import type {
  HistoryTaskItem,
  TaskPrompt,
  TaskStatus
} from '@/schemas/apiSchema'
import type { JobListItem, JobStatus } from '../types/jobTypes'

/**
 * Maps job status to task status format
 * @param jobStatus - Job status from cloud backend
 * @returns TaskStatus with appropriate status_str
 */
function mapJobStatusToTaskStatus(jobStatus: JobStatus): TaskStatus {
  const statusMap: Record<JobStatus, 'success' | 'error'> = {
    completed: 'success',
    failed: 'error',
    cancelled: 'error',
    in_progress: 'success', // Treat as success for running tasks
    pending: 'success' // Treat as success for pending tasks
  }

  return {
    status_str: statusMap[jobStatus],
    completed: jobStatus === 'completed',
    messages: []
  }
}

/**
 * Maps a job list item to V1 history task item format
 * @param job - Job from cloud backend
 * @returns HistoryTaskItem compatible with existing frontend
 */
function mapJobToHistoryTaskItem(job: JobListItem): HistoryTaskItem {
  // Use create_time directly as priority (already unix timestamp)
  const priority = job.create_time

  // Create task prompt tuple: [priority, promptId, inputs, extraData, outputsToExecute]
  const prompt: TaskPrompt = [
    priority,
    job.id, // Job ID is used as prompt ID
    {}, // No inputs in jobs API list response
    {
      // Store output_count in extra_data so UI can show "X outputs" button before lazy-loading
      output_count: job.output_count
    },
    job.preview_output ? ['preview_node'] : [] // Output nodes - use preview_node if available
  ]

  // Map preview_output to outputs format
  const outputs: Record<string, any> = job.preview_output
    ? {
        preview_node: {
          images: [job.preview_output]
        }
      }
    : {}

  return {
    taskType: 'History',
    prompt,
    status: mapJobStatusToTaskStatus(job.status),
    outputs
  }
}

/**
 * Maps array of jobs to array of history task items
 * @param jobs - Array of jobs from cloud backend
 * @returns Array of HistoryTaskItem compatible with existing frontend
 */
export function mapJobsToHistory(jobs: JobListItem[]): HistoryTaskItem[] {
  // Sort by create_time descending (newest first)
  const sortedJobs = [...jobs].sort((a, b) => {
    return b.create_time - a.create_time
  })

  return sortedJobs.map(mapJobToHistoryTaskItem)
}
