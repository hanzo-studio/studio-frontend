<template>
  <Button
    variant="secondary"
    size="icon-sm"
    aria-label="View Asset"
    @click="toggle"
  >
    <i class="icon-[lucide--ellipsis]" />
  </Button>

  <Popover
    ref="popover"
    append-to="body"
    auto-z-index
    dismissable
    close-on-escape
    unstyled
    :base-z-index="1000"
    :pt="{
      root: {
        class: cn('absolute z-50')
      },
      content: {
        class: cn(
          'mt-1 rounded-lg',
          'bg-secondary-background text-base-foreground',
          'shadow-lg'
        )
      }
    }"
    @show="$emit('menuOpened')"
    @hide="$emit('menuClosed')"
  >
    <div class="flex min-w-40 flex-col gap-2 p-2">
      <slot :close="hide" />
    </div>
  </Popover>
</template>

<script setup lang="ts">
import Popover from 'primevue/popover'
import { ref } from 'vue'

import Button from '@/components/ui/button/Button.vue'
import { cn } from '@/utils/tailwindUtil'

const popover = ref<InstanceType<typeof Popover>>()

defineEmits<{
  menuOpened: []
  menuClosed: []
}>()

const toggle = (event: Event) => {
  popover.value?.toggle(event)
}

const hide = () => {
  popover.value?.hide()
}
</script>
