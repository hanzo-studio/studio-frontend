// ---- Download types ----

export enum DownloadStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
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
    incrementUserProperty: (property: string, value: number) => void
  }

  /** Native context menu */
  showContextMenu: (options?: { type?: string }) => void

  /** Get the Electron desktop app version */
  getElectronVersion: () => Promise<string>

  /** Get the Hanzo Studio backend version */
  getHanzoStudioVersion: () => string

  /** Get the current platform */
  getPlatform: () => string

  /** Restart the application */
  restartApp: (message?: string, delay?: number) => void

  /** Quit the application */
  quit: () => void

  /** Reinstall the application */
  reinstall: () => void

  /** Restart and install a pending update */
  restartAndInstall: () => void

  /** Check for available updates */
  checkForUpdates: (options?: {
    disableUpdateReadyAction?: boolean
  }) => Promise<{ isUpdateAvailable: boolean; version?: string }>

  /** Change the application theme */
  changeTheme: (theme: Record<string, unknown>) => void

  /** Set metrics consent */
  setMetricsConsent: (consent: boolean) => Promise<void>

  /** Validate a Hanzo Studio source path */
  validateHanzoStudioSource: (
    path: string
  ) => Promise<{ isValid: boolean; message?: string }>

  /** Desktop configuration */
  Config: {
    setWindowStyle: (style: string) => void
    getDetectedGpu?: () => string
    [key: string]: unknown
  }

  /** Network utilities */
  NetWork: {
    canAccessUrl: (url: string) => Promise<boolean>
    [key: string]: unknown
  }

  /** Terminal access */
  Terminal: {
    onOutput: (callback: (data: string) => void) => () => void
    write: (data: string) => Promise<void>
    resize: (cols: number, rows: number) => Promise<void>
    restore: () => Promise<{
      buffer: string[]
      size: { cols: number; rows: number }
    }>
    [key: string]: unknown
  }

  /** Dialog access (desktop-ui) */
  Dialog: {
    clickButton: (value: string) => Promise<void>
    [key: string]: unknown
  }

  /** Open folders */
  openLogsFolder: () => void
  openModelsFolder: () => void
  openOutputsFolder: () => void
  openInputsFolder: () => void
  openCustomNodesFolder: () => void
  openModelConfig: () => void
  openDevTools: () => void

  /** Validate install path */
  validateInstallPath: (
    path: string
  ) => Promise<{ isValid: boolean; message?: string }>

  /** Allow arbitrary additional properties */
  [key: string]: unknown
}
