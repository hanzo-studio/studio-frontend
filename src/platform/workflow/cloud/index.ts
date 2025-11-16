/**
 * Cloud: Fetches workflow by prompt_id. Desktop: Returns undefined (workflows already in history).
 * Cloud: Lazy loads full outputs. Desktop: Returns undefined (outputs already in history).
 */
import { isCloud } from '@/platform/distribution/types'

import {
  getWorkflowFromHistory as cloudImpl,
  getOutputsFromHistory as cloudOutputsImpl
} from './getWorkflowFromHistory'

export const getWorkflowFromHistory = isCloud
  ? cloudImpl
  : async () => undefined

export const getOutputsFromHistory = isCloud
  ? cloudOutputsImpl
  : async () => undefined
