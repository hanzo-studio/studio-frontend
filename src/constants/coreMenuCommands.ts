export const CORE_MENU_COMMANDS = [
  [[], ['Comfy.NewBlankWorkflow']],
  [[], []], // Separator after New
  [['File'], ['Comfy.OpenWorkflow']],
  [
    ['File'],
    [
      'Comfy.SaveWorkflow',
      'Comfy.SaveWorkflowAs',
      'Comfy.ExportWorkflow',
      'Comfy.ExportWorkflowAPI'
    ]
  ],
  [['Edit'], ['Comfy.Undo', 'Comfy.Redo']],
  [['Edit'], ['Comfy.ClearWorkflow']],
  [['Edit'], ['Comfy.OpenClipspace']],
  [['Edit'], ['Comfy.RefreshNodeDefinitions']],
  [
    ['Edit'],
    [
      'Comfy.RefreshNodeDefinitions',
      'Comfy.Memory.UnloadModels',
      'Comfy.Memory.UnloadModelsAndExecutionCache'
    ]
  ],
  [['View'], []],
  [
    ['Help'],
    [
      'Comfy.Help.OpenHanzoStudioIssues',
      'Comfy.Help.OpenHanzoStudioDocs',
      'Comfy.Help.OpenHanzoStudioDiscord',
      'Comfy.Help.OpenHanzoStudioForum'
    ]
  ],
  [['Help'], ['Comfy.Help.AboutHanzo Studio', 'Comfy.ContactSupport']]
]
