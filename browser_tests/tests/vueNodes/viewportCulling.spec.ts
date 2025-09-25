import { expect } from '@playwright/test'

import { comfyPageFixture as test } from '../../fixtures/ComfyPage'

test.beforeEach(async ({ comfyPage }) => {
  await comfyPage.setSetting('Comfy.UseNewMenu', 'Disabled')
})

test.describe('Vue Nodes - ViewportCulling', () => {
  test.beforeEach(async ({ comfyPage }) => {
    await comfyPage.page.clock.install()
    await comfyPage.setSetting('Comfy.VueNodes.Enabled', true)
    await comfyPage.setup()
    await comfyPage.loadWorkflow('vueNodes/culling_check')
  })

  test('should update node display values', async ({ comfyPage }) => {
    await comfyPage.vueNodes.waitForNodes()

    await comfyPage.attachScreenshot('1')
    await expect(comfyPage.vueNodes.nodes).toHaveCount(6)
    await comfyPage.page.clock.runFor(1000)
    // await expect(comfyPage.vueNodes.nodes).toHaveCount(2)
    console.log(
      await comfyPage.vueNodes.nodes.filter({ visible: true }).count()
    )

    await comfyPage.pan({ x: 0, y: -500 })

    await comfyPage.page.clock.runFor(1000)
    await comfyPage.attachScreenshot('2')
    // await expect(comfyPage.vueNodes.nodes).toHaveCount(3)
    console.log(
      await comfyPage.vueNodes.nodes.filter({ visible: true }).count()
    )

    await comfyPage.pan({ x: 0, y: -500 })

    await comfyPage.page.clock.runFor(1000)
    await comfyPage.attachScreenshot('3')
    // await expect(comfyPage.vueNodes.nodes).toHaveCount(2)
    console.log(
      await comfyPage.vueNodes.nodes.filter({ visible: true }).count()
    )

    await comfyPage.pan({ x: 0, y: -500 })

    await comfyPage.page.clock.runFor(1000)
    await comfyPage.attachScreenshot('4')
    // await expect(comfyPage.vueNodes.nodes).toHaveCount(0)
    console.log(
      await comfyPage.vueNodes.nodes.filter({ visible: true }).count()
    )
  })
})
