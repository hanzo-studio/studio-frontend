/**
 * @fileoverview Queue V1 API Fetcher - Standard ComfyUI queue endpoint
 * @module platform/remote/comfyui/queue/fetchers/fetchQueueV1
 *
 * Fetches queue from standard /queue endpoint.
 * Used by desktop and localhost distributions.
 */

import { api } from '@/scripts/api'
import type { QueueResponse } from '../types/queueTypes'

/**
 * Fetches queue from /queue endpoint
 * @param fetchApi - API fetch function
 * @returns Promise resolving to queue with running and pending tasks
 */
export async function fetchQueueV1(
  fetchApi: (url: string) => Promise<Response>
): Promise<QueueResponse> {
  try {
    const res = await fetchApi('/queue')
    const data = await res.json()
    return {
      // Running action uses a different endpoint for cancelling
      Running: data.queue_running.map((prompt: any) => ({
        taskType: 'Running',
        prompt,
        // rh-test uses object schema with prompt_id property
        remove: { name: 'Cancel', cb: () => api.interrupt(prompt.prompt_id) }
      })),
      Pending: data.queue_pending.map((prompt: any) => ({
        taskType: 'Pending',
        prompt
      }))
    }
  } catch (error) {
    console.error('Failed to fetch queue:', error)
    return { Running: [], Pending: [] }
  }
}
