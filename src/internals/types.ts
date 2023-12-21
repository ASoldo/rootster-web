/**
 * `EnvironmentConfig` - is used for consistent `apiUrl` usage through whole application
 */
export type EnvironmentConfig = {
  apiUrl: string;
};

export type NavigationItem = {
  label: string;
  path: string;
};

/**
 * List of all opened applications
 * @type {Ref<Array<Application>>}
 * @example
 * ```ts
 * const apps: Ref<Array<Application>> = ref<Array<Application>>([])
 * ```
 */
export type Application = {
  id: number;
  name: string;
  component: any;
  props: Record<string, any>;
  events?: Record<string, (...args: any[]) => void>;
  navigation?: NavigationItem[];
};

export type GithubItem = {
  name: string;
  path: string;
  type: "dir" | "file";
  url?: string;
};
