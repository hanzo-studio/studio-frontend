/**
 * @fileoverview Queue API types
 * @module platform/remote/comfyui/queue/types
 */

import type { PendingTaskItem, RunningTaskItem } from '@/schemas/apiSchema'

/**
 * Queue response from /queue endpoint
 */
export interface QueueResponse {
  Running: RunningTaskItem[]
  Pending: PendingTaskItem[]
}
