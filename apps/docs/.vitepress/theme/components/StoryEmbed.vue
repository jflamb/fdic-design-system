<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useData } from "vitepress";

type StorybookTheme = "dark" | "light"

const STORYBOOK_THEME_QUERY_PARAM = "fdic-theme"
const STORYBOOK_THEME_GLOBAL = "theme"
const STORYBOOK_THEME_MESSAGE_TYPE = "fdic-theme-change"

const props = withDefaults(defineProps<{
  storyId: string
  linkStoryId?: string
  height?: string
  caption?: string
  storybookBaseUrl?: string
}>(), {
  height: '300',
  storybookBaseUrl: import.meta.env.VITE_STORYBOOK_URL || ''
})

const { isDark } = useData()
const iframeRef = ref<HTMLIFrameElement | null>(null)

const normalizedStorybookBaseUrl = computed(() =>
  props.storybookBaseUrl.replace(/\/$/, '')
)

const embedTheme = computed<StorybookTheme>(() => (isDark.value ? "dark" : "light"))
const initialEmbedTheme = embedTheme.value

const getThemeSearchParams = (theme: StorybookTheme) => new URLSearchParams({
  globals: `${STORYBOOK_THEME_GLOBAL}:${theme}`,
  [STORYBOOK_THEME_QUERY_PARAM]: theme
})

const iframeSrc = computed(() => {
  if (!normalizedStorybookBaseUrl.value) {
    return ''
  }

  const searchParams = new URLSearchParams({
    id: props.storyId,
    viewMode: 'story',
  })
  const themeSearchParams = getThemeSearchParams(initialEmbedTheme)

  themeSearchParams.forEach((value, key) => {
    searchParams.set(key, value)
  })

  return `${normalizedStorybookBaseUrl.value}/iframe.html?${searchParams.toString()}`
})

const storybookLink = computed(() => {
  if (!normalizedStorybookBaseUrl.value) {
    return ''
  }

  const searchParams = new URLSearchParams({
    path: `/story/${props.linkStoryId || props.storyId}`
  })
  const themeSearchParams = getThemeSearchParams(embedTheme.value)

  themeSearchParams.forEach((value, key) => {
    searchParams.set(key, value)
  })

  return `${normalizedStorybookBaseUrl.value}/?${searchParams.toString()}`
})

const getStorybookTargetOrigin = (): string => {
  if (!normalizedStorybookBaseUrl.value) {
    return "*"
  }

  try {
    const currentUrl = typeof window === "undefined" ? "http://localhost" : window.location.href
    return new URL(normalizedStorybookBaseUrl.value, currentUrl).origin
  } catch {
    return "*"
  }
}

const postThemeMessage = (): void => {
  iframeRef.value?.contentWindow?.postMessage({
    type: STORYBOOK_THEME_MESSAGE_TYPE,
    theme: embedTheme.value
  }, getStorybookTargetOrigin())
}

watch(embedTheme, () => {
  postThemeMessage()
})
</script>

<template>
  <figure class="fdic-story-embed">
    <div
      v-if="iframeSrc"
      class="fdic-story-embed-frame"
      :style="{ height: height + 'px' }"
    >
      <iframe
        ref="iframeRef"
        :src="iframeSrc"
        loading="lazy"
        :title="caption || 'Component example'"
        sandbox="allow-scripts allow-same-origin"
        @load="postThemeMessage"
      />
    </div>
    <div v-else class="fdic-story-embed-placeholder">
      <span class="fdic-story-embed-placeholder-icon" aria-hidden="true">⬡</span>
      <p>Storybook example: <code>{{ storyId }}</code></p>
      <p v-if="linkStoryId && linkStoryId !== storyId">Storybook link target: <code>{{ linkStoryId }}</code></p>
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
