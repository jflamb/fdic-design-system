<script setup lang="ts">
const props = withDefaults(defineProps<{
  url: string
  height?: string
  caption?: string
}>(), {
  height: '450'
})

const iframeSrc = props.url
  ? `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(props.url)}`
  : ''
</script>

<template>
  <figure class="fdic-figma-embed">
    <div
      v-if="iframeSrc"
      class="fdic-figma-embed-frame"
      :style="{ height: height + 'px' }"
    >
      <iframe
        :src="iframeSrc"
        loading="lazy"
        :title="caption || 'Design specification'"
        allowfullscreen
      />
    </div>
    <div v-else class="fdic-figma-embed-placeholder">
      <span class="fdic-figma-embed-placeholder-icon" aria-hidden="true">◇</span>
      <p>Figma design spec</p>
      <p class="fdic-figma-embed-placeholder-hint">Connect a Figma file to see design specifications</p>
    </div>
    <figcaption v-if="caption" class="fdic-figma-embed-caption">
      {{ caption }}
      <a
        v-if="url"
        :href="url"
        target="_blank"
        rel="noopener"
        class="fdic-figma-embed-link"
      >View in Figma →</a>
    </figcaption>
  </figure>
</template>
