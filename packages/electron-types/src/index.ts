// ---- Download types ----

export enum DownloadStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  DOWNLOADING = 'downloading',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ERROR = 'error',
  CANCELLED = 'cancelled'
}

export interface DownloadState {
  url: string
  filename: string
  savePath?: string
  status: DownloadStatus
  progress?: number
  error?: string
}

// ---- Torch / GPU types ----

export type TorchDeviceType = 'cpu' | 'nvidia' | 'mps'

export enum TorchMirrorUrl {
  NightlyCpu = 'https://download.pytorch.org/whl/nightly/cpu',
  Cuda = 'https://download.pytorch.org/whl/cu124'
}

// ---- Install types ----

export const InstallStage = {
  WELCOME_SCREEN: 'welcome_screen',
  INSTALL_OPTIONS_SELECTION: 'install_options_selection',
  CREATING_DIRECTORIES: 'creating_directories',
  INITIALIZING_CONFIG: 'initializing_config',
  PYTHON_ENVIRONMENT_SETUP: 'python_environment_setup',
  INSTALLING_REQUIREMENTS: 'installing_requirements',
  INSTALLING_PYTORCH: 'installing_pytorch',
  INSTALLING_COMFYUI_REQUIREMENTS: 'installing_comfyui_requirements',
  INSTALLING_MANAGER_REQUIREMENTS: 'installing_manager_requirements',
  MIGRATING_CUSTOM_NODES: 'migrating_custom_nodes',
  READY: 'ready',
  ERROR: 'error'
} as const

export type InstallStageName = (typeof InstallStage)[keyof typeof InstallStage]

export interface InstallStageInfo {
  stage: InstallStageName
  progress?: number
  message?: string
  error?: string
  timestamp?: number
}

export enum ProgressStatus {
  INITIAL_STATE = 'initial_state',
  DOWNLOADING = 'downloading',
  READY = 'ready',
  ERROR = 'error',
  STARTED = 'started'
}

export interface InstallOptions {
  installPath: string
  autoUpdate: boolean
  allowMetrics: boolean
  migrationSourcePath: string
  migrationItemIds: string[]
  pythonMirror: string
  pypiMirror: string
  torchMirror: string
  device: TorchDeviceType
}

// ---- Migration types ----

export interface MigrationItem {
  id: string
  label: string
  description?: string
}

export const MigrationItems: MigrationItem[] = [
  { id: 'custom_nodes', label: 'Custom Nodes' },
  { id: 'models', label: 'Models' },
  { id: 'input', label: 'Input Files' },
  { id: 'output', label: 'Output Files' }
]

// ---- Validation types ----

export type ValidationState = 'warning' | 'error' | 'OK' | 'skipped'

export interface InstallValidation {
  basePath: ValidationState
  inProgress: boolean
  unsafeBasePath?: boolean
  unsafeBasePathReason?: string
  [key: string]: ValidationState | boolean | string | undefined
}

// ---- Electron API types ----

export interface ElectronAPI {
  /** Install Hanzo Studio with the given options */
  installHanzoStudio: (options: InstallOptions) => void

  /** Download manager for model/file downloads */
  DownloadManager: {
    getAllDownloads: () => Promise<DownloadState[]>
    startDownload: (url: string, savePath: string, filename: string) => void
    pauseDownload: (url: string) => void
    resumeDownload: (url: string) => void
    cancelDownload: (url: string) => void
    onDownloadProgress: (
      callback: (data: DownloadState & { progress: number }) => void
    ) => void
  }

  /** Install stage tracking */
  InstallStage: {
    onUpdate: (callback: (info: InstallStageInfo) => void) => () => void
    getCurrent: () => Promise<InstallStageInfo>
  }

  /** Installation validation */
  Validation: {
    validateInstallation: (
      callback: (update: InstallValidation) => void
    ) => Promise<void>
  }

  /** Event tracking */
  Events: {
    trackEvent: (name: string, data?: Record<string, unknown>) => void
  }

  /** Native context menu */
  showContextMenu: () => void

  /** Allow arbitrary additional properties */
  [key: string]: unknown
}
