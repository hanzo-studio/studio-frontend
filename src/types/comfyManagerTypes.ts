import type { InjectionKey, Ref } from 'vue'

import type { ComfyWorkflowJSON } from '@/schemas/comfyWorkflowSchema'
import type { AlgoliaNodePack } from '@/types/algoliaTypes'
import type { components } from '@/types/comfyRegistryTypes'
import type { SearchMode } from '@/types/searchServiceTypes'

type WorkflowNodeProperties = ComfyWorkflowJSON['nodes'][0]['properties']

export type RegistryPack = components['schemas']['Node']
export type MergedNodePack = RegistryPack & AlgoliaNodePack
export const isMergedNodePack = (
  nodePack: RegistryPack | AlgoliaNodePack
): nodePack is MergedNodePack => 'comfy_nodes' in nodePack

export const IsInstallingKey: InjectionKey<Ref<boolean>> =
  Symbol('isInstalling')

export enum ManagerWsQueueStatus {
  DONE = 'done',
  IN_PROGRESS = 'in_progress'
}

export enum ManagerTab {
  All = 'all',
  Installed = 'installed',
  Workflow = 'workflow',
  Missing = 'missing',
  UpdateAvailable = 'updateAvailable'
}

export enum SortableAlgoliaField {
  Downloads = 'total_install',
  Created = 'create_time',
  Updated = 'update_time',
  Publisher = 'publisher_id',
  Name = 'name'
}

export interface TabItem {
  id: ManagerTab
  label: string
  icon: string
}

export interface SearchOption<T> {
  id: T
  label: string
}

export type TaskLog = {
  taskName: string
  logs: string[]
}

export interface UseNodePacksOptions {
  immediate?: boolean
  maxConcurrent?: number
}

export enum SelectedVersion {
  /** Latest version of the pack from the registry */
  LATEST = 'latest',
  /** Latest commit of the pack from its GitHub repository */
  NIGHTLY = 'nightly'
}

export enum ManagerChannel {
  /** All packs except those with instability or security issues */
  DEFAULT = 'default',
  /** Packs that were recently updated */
  /** Packs that were superseded by distinct replacements of some type */
  /** Packs that were forked as a result of the original pack going unmaintained */
  /** Packs with instability or security issues suitable only for developers */
  DEV = 'dev'
  /** Packs suitable for beginners */
}

export enum ManagerDatabaseSource {
  /** Get pack info from the Comfy Registry */
  /** If set to `local`, the channel is ignored */
  /** Get pack info from the cached response from the Comfy Registry (1 day TTL) */
  CACHE = 'cache'
}

export interface ManagerQueueStatus {
  /** `done_count` + `in_progress_count` + number of items queued */
  total_count: number
  /** Task worker thread is alive, a queued operation is running */
  is_processing: boolean
  /** Number of items in the queue that have been completed */
  done_count: number
  /** Number of items in the queue that are currently running */
  in_progress_count: number
}

export interface ManagerPackInfo {
  /** Either github-author/github-repo or name of pack from the registry (not id) */
  id: WorkflowNodeProperties['aux_id'] | WorkflowNodeProperties['cnr_id']
  /** Semantic version or Git commit hash */
  version: WorkflowNodeProperties['ver']
}

export interface ManagerPackInstalled {
  /**
   * The version of the pack that is installed.
   * Git commit hash or semantic version.
   */
  ver: WorkflowNodeProperties['ver']
  /**
   * The name of the pack if the pack is installed from the registry.
   * Corresponds to `Node#name` in comfy-api.
   */
  cnr_id: WorkflowNodeProperties['cnr_id']
  /**
   * The name of the pack if the pack is installed from github.
   * In the format author/repo-name. If the pack is installed from the registry, this is `null`.
   */
  aux_id: WorkflowNodeProperties['aux_id'] | null
  enabled: boolean
}

/**
 * Returned by `/customnode/installed`
 */
export type InstalledPacksResponse = Record<
  NonNullable<RegistryPack['name']>,
  ManagerPackInstalled
>

/**
 * Payload for `/manager/queue/install`
 */
export interface InstallPackParams extends ManagerPackInfo {
  /**
   * Semantic version, Git commit hash, `latest`, or `nightly`.
   */
  selected_version: WorkflowNodeProperties['ver'] | SelectedVersion
  /**
   * The GitHub link to the repository of the pack to install.
   * Required if `selected_version` is `nightly`.
   */
  repository: string
  /**
   * List of PyPi dependency names associated with the pack.
   * Used in coordination with pip package whitelist and version lock features.
   */
  pip?: string[]
  mode: ManagerDatabaseSource
  channel: ManagerChannel
  skip_post_install?: boolean
}

/**
 * Params for `/manager/queue/update_all`
 */
export interface UpdateAllPacksParams {
  mode?: ManagerDatabaseSource
}

export interface ManagerState {
  selectedTabId: ManagerTab
  searchQuery: string
  searchMode: SearchMode
  sortField: string
}
