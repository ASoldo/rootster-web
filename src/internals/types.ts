/**
 *
 * # EnvironmentConfig - is used for consistent `apiUrl` usage through whole application
 * @type {EnvironmentConfig}
 * @field {string} apiUrl - url of the api
 */
export type EnvironmentConfig = {
  apiUrl: string;
};

/**
 *
 * # NavigationItem
 * @type {NavigationItem}
 * @field {string} label - label of the navigation item
 * @field {string} path - path of the navigation item
 * @example
 * ```ts
 * const navigation: NavigationItem = {
 *  label: "Chat",
 *  path: "/chat",
 *  }
 *  ```
 */
export type NavigationItem = {
  label: string;
  path: string;
};

/**
 *
 * # Application
 * @type {Ref<Array<Application>>}
 * @field {number} id - unique id of the application
 * @field {string} name - name of the application
 * @field {any} component - component of the application
 * @field {Record<string, any>} props - props of the application
 * @field {Record<string, (...args: any[]) => void>} events - events of the application
 * @field {NavigationItem[]} navigation - navigation of the application
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

/**
 *
 * # GithubItem
 * @type {GithubItem}
 * @field {string} name - name of the file or directory
 * @field {string} path - path to the file or directory
 * @field {string} type - type of the file or directory
 * @field {string} url - url to the file or directory
 */
export type GithubItem = {
  name: string;
  path: string;
  type: "dir" | "file";
  url?: string;
};
