import type {
  FdGlobalHeaderNavigationItem,
  FdGlobalHeaderSearchConfig,
} from "./components/fd-global-header.js";

export { createHeaderSearchItemsFromNavigation } from "./components/fd-global-header.js";

export interface FdGlobalHeaderContent {
  navigation: FdGlobalHeaderNavigationItem[];
  search?: FdGlobalHeaderSearchConfig | null;
}

export interface FdGlobalHeaderContentAdapter<TSource> {
  resolve(
    source: TSource,
  ): FdGlobalHeaderContent | Promise<FdGlobalHeaderContent>;
}

export function createFdGlobalHeaderContent(
  content: FdGlobalHeaderContent,
): FdGlobalHeaderContent {
  return {
    navigation: content.navigation,
    search: content.search ?? null,
  };
}

export function createFdGlobalHeaderSearchConfig(
  config: FdGlobalHeaderSearchConfig,
): FdGlobalHeaderSearchConfig {
  return {
    paramName: "q",
    ...config,
  };
}
