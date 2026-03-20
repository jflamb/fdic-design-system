<script setup lang="ts">
const props = withDefaults(defineProps<{
  storyId: string
  height?: string
  caption?: string
  storybookBaseUrl?: string
}>(), {
  height: '300',
  storybookBaseUrl: import.meta.env.VITE_STORYBOOK_URL || ''
})

const iframeSrc = props.storybookBaseUrl
  ? `${props.storybookBaseUrl}/iframe.html?id=${props.storyId}&viewMode=story`
  : ''

const storybookLink = props.storybookBaseUrl
  ? `${props.storybookBaseUrl}/?path=/story/${props.storyId}`
  : ''
</script>

<template>
  <figure class="fdic-story-embed">
    <div
      v-if="iframeSrc"
      class="fdic-story-embed-frame"
      :style="{ height: height + 'px' }"
    >
      <iframe
        :src="iframeSrc"
        loading="lazy"
        :title="caption || 'Component example'"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
    <div v-else class="fdic-story-embed-placeholder">
      <span class="fdic-story-embed-placeholder-icon" aria-hidden="true">⬡</span>
      <p>Storybook example: <code>{{ storyId }}</code></p>
      <p class="fdic-story-embed-placeholder-hint">Connect a Storybook instance to see live examples</p>
    </div>
    <figcaption v-if="caption" class="fdic-story-embed-caption">
      {{ caption }}
      <a
        v-if="storybookLink"
        :href="storybookLink"
        target="_blank"
        rel="noopener"
        class="fdic-story-embed-link"
      >View in Storybook →</a>
    </figcaption>
  </figure>
</template>
