/**
 * @fileoverview Jobs API module exports
 * @module platform/remote/comfyui/jobs
 *
 * Cloud backend jobs API - memory-optimized alternative to history API.
 */

// Public API exports
export { fetchCompletedJobs } from './fetchers/fetchJobs'
export {
  getWorkflowFromJob,
  getOutputsFromJob
} from './fetchers/fetchJobDetail'
