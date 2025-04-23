// eslint-disable-next-line max-classes-per-file
import {
  assetBunLoginUrl,
  ContentType,
  getUrlQueryParam,
  getUrlQuestionType,
  hasPayType,
  IframeMsgType,
  isModerator,
  NeedResolveType,
  PageType,
  shareLocalStorageDomains,
  targetAssetBunHomeUrl,
  targetAssetBunRootUrl,
  targetLocalStorageUrl,
} from '@/common/constants';

export { getUrlQueryParam, getUrlQuestionType };
export function needQuestionToLoginOrUp(question, userInfo): void {
  if (!hasPayType(question.content_type) && question.score) {
    // 没有登录
    if (!userInfo.access_token) {
      window.location.href = '/users/login';
    }
    // 没有购买特定类型的问题又不是板块负责人，不让其进入
    else if (
      !isModerator(question, userInfo) &&
      question.buyer_user_ids.indexOf(userInfo.id) === -1
    ) {
      window.location.href = `/questions?content_type=${question.content_type}`;
    }
  }
}

class QuestionHistoryManager {
  private static instance: QuestionHistoryManager;

  private data: any = {};

  static getInstance(): QuestionHistoryManager {
    if (!QuestionHistoryManager.instance) {
      QuestionHistoryManager.instance = new QuestionHistoryManager();
    }
    return QuestionHistoryManager.instance;
  }

  setData(data: any) {
    this.data = data;
  }

  getData(): any {
    return this.data;
  }
}

export const historyManager = QuestionHistoryManager.getInstance();

export const formatNumber = (num, length, isEnd = true) => {
  const numStr = String(num);
  if (numStr.length < length) {
    let output = '';
    const offsetLen = length - numStr.length;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < offsetLen; i++) {
      output += '&nbsp;&nbsp;';
    }
    output = isEnd ? `${numStr}${output}` : `${output}${numStr}`;
    return output;
  }
  return String(num);
};

export function getDefaultAvatarPic() {
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  return `https://ai.assetbun.com/uploads/avatar/avatar${randomNumber}.png`;
}

export function appendSingleResources(
  cssUrl,
  scriptUrl,
  onLoadScript,
  once = false,
  isModule = true,
) {
  // 检查是否已经有对应的CSS文件链接
  const linkElements = document.getElementsByTagName('link');
  const existingCssLink = Array.from(linkElements).some((link) => {
    return link.href === cssUrl;
  });

  // 如果没有对应的CSS链接，则添加
  if (!existingCssLink) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = cssUrl;
    document.head.appendChild(link);
  }
  // 检查是否已经有对应的script标签
  const scriptElements = document.getElementsByTagName('script');
  const existingScript = Array.from(scriptElements).some((script) => {
    return script.src === scriptUrl;
  });

  // 如果没有对应的script标签，则添加
  if (!once || !existingScript) {
    const script = document.createElement('script');
    script.src = scriptUrl;
    if (isModule) {
      script.type = 'module'; // 如果glslEditor.min.js是一个ES6模块
    }
    script.onload = function () {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onLoadScript && onLoadScript(script);
      // 这里可以放置脚本加载后的初始化代码
    };
    script.onerror = function () {
      console.error('external script load error.');
    };
    document.head.appendChild(script);
  }
}

export function appendArrayResources(
  cssUrls: string[] = [], // 接受一个CSS URL的数组
  scriptUrls: string[] = [], // 接受一个JavaScript URL的数组
  defer = false, // 新增参数，决定是否使用defer属性
) {
  // const promises = [];
  // 检查并添加CSS链接
  cssUrls.forEach((cssUrl) => {
    if (!document.querySelector(`link[href="${cssUrl}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = cssUrl;
      document.head.appendChild(link);
    }
  });

  // 检查并添加script标签
  scriptUrls.forEach((scriptUrl) => {
    if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
      const script = document.createElement('script');
      script.src = scriptUrl;
      // script.onload = function () {
      //   document.head.removeChild(script);
      // };
      // script.type = 'text/template';
      // 设置延迟加载属性
      if (defer) {
        script.defer = true; // 使用defer属性
      } else {
        script.async = true; // 默认使用async属性
      }
      document.head.appendChild(script);
    }
  });
}

export function hasQueryParam(url: string | null = null): boolean {
  // 获取当前页面的URL
  const currentUrl = url || window.location.href;
  // 解析当前URL
  const urlObj = new URL(currentUrl, window.location.origin);
  // 获取查询字符串部分
  const queryParams = urlObj.search;
  // 检查查询字符串是否为空
  return queryParams !== '';
}

export function isAssetBunPageType(): boolean {
  const param = getUrlQueryParam('page_type');
  return param ? parseInt(param, 10) === PageType.ASSETBUN : false;
}

export function getDomainName(url: string | null = null) {
  if (!url) {
    url = window.location.href;
  }
  // 创建一个URL对象
  const parsedUrl = new URL(url);
  // 获取主机名，即域名部分
  return parsedUrl.hostname;
}

export function isLocalHost(hostname: string) {
  return shareLocalStorageDomains.indexOf(hostname) === 0;
}

export function isNeedResolveType(contentType: ContentType, score: number) {
  return (
    (NeedResolveType.indexOf(contentType) !== -1 && score > 0) ||
    contentType === ContentType.BOUNTY
  );
}

export function removeLastNewline(str) {
  if (str.endsWith('\n')) {
    return str.slice(0, -1); // 移除最后一个字符
  }
  return str;
}

export function getTargetLocalStorageHost(): string {
  const currDomain = getDomainName();
  const idx = shareLocalStorageDomains.indexOf(currDomain);
  return targetLocalStorageUrl[idx];
}

export const isLightTheme = () => {
  const htmlTag = document.querySelector('html') as HTMLHtmlElement;
  const theme = htmlTag.getAttribute('data-bs-theme');
  return theme === 'light';
};

export function getTargetAssetBunHost(): string {
  const currDomain = getDomainName();
  const idx = shareLocalStorageDomains.indexOf(currDomain);
  const redirectStr = getUrlQueryParam('redirect');
  return redirectStr
    ? targetAssetBunRootUrl[idx] + decodeURIComponent(redirectStr)
    : targetAssetBunHomeUrl[idx];
}

export function getAssetBunLoginHost(): string {
  const currDomain = getDomainName();
  const idx = shareLocalStorageDomains.indexOf(currDomain);
  return assetBunLoginUrl[idx];
}

export function getTargetRootAssetBunHost(): string {
  const currDomain = getDomainName();
  const idx = shareLocalStorageDomains.indexOf(currDomain);
  return targetAssetBunRootUrl[idx];
}

export function getAssetBunReviewURL(): string {
  return `${getTargetRootAssetBunHost()}/admin/share`;
}

export interface IframeParams {
  email: string;
  password: string;
  type: IframeMsgType;
}

export class SseService {
  private static sse: SseService;

  private static eveSource: EventSource;

  private static aiCallbacks: Map<string, any> = new Map<string, any>();

  static GetInstance() {
    if (SseService.sse) {
      return SseService.sse;
    }
    SseService.sse = new SseService();
    const currDomain = getDomainName();
    const eveUrl =
      currDomain === 'localhost'
        ? 'http://localhost:8080/events?stream=message'
        : 'https://sse.assetbun.com/events?stream=message';
    SseService.eveSource = new EventSource(eveUrl);
    return SseService.sse;
  }

  private static aiCallback(eve) {
    SseService.aiCallbacks.forEach((callback) => {
      callback(eve);
    });
  }

  addAIEventListener() {
    this.removeAIEventListener();
    SseService.eveSource.addEventListener('message', SseService.aiCallback);
  }

  removeAIEventListener() {
    SseService.eveSource.removeEventListener('message', SseService.aiCallback);
  }

  addAICallback(key, callback) {
    if (SseService.aiCallbacks.has(key)) {
      SseService.aiCallbacks.delete(key);
    }
    SseService.aiCallbacks.set(key, callback);
  }
}

class IframeManager {
  private iframe: HTMLIFrameElement | null = null;

  private callback;

  private loadedCallback;

  private isLoaded;

  public initIframe() {
    // 尝试从DOM中获取现有的<iframe>
    this.iframe = document.getElementById('shareFrame') as HTMLIFrameElement;
    if (!this.iframe) {
      const targetStorageUrl = getTargetLocalStorageHost();
      this.iframe = document.createElement('iframe');
      this.iframe.id = 'shareFrame';
      this.iframe.width = String(10);
      this.iframe.height = String(10);
      this.iframe.src = targetStorageUrl;
      this.iframe.style.display = 'none';
      document.body.appendChild(this.iframe);
      // 初始化完成后的回调或其他操作
      this.iframe.onload = () => {
        if (this.loadedCallback) {
          this.loadedCallback();
          this.loadedCallback = null;
        }
        this.isLoaded = true;
      };
      const that = this;
      window.addEventListener(
        'message',
        function (event) {
          const originRoot = getTargetRootAssetBunHost();
          if (that.callback && event.origin === originRoot) {
            that.callback(event.data);
            that.callback = null;
          }
        },
        false,
      );
    }
    return this.iframe;
  }

  public onLoaded(loadedCallback) {
    this.loadedCallback = loadedCallback;
    this.initIframe();
    if (this.isLoaded) {
      this.loadedCallback();
    }
  }

  public postMsg(params: IframeParams, callback) {
    this.callback = callback;
    const iframe = this.initIframe();
    const contentWindow = iframe.contentWindow!;
    const targetStorageUrl = getTargetLocalStorageHost();
    contentWindow.postMessage(params, targetStorageUrl);
  }
}

/**
 * 封装的函数，用于关闭导航栏。
 * 如果导航栏内容是可见的，将点击导航栏切换按钮以隐藏它。
 */
export function closeNavbarIfOpen() {
  // 获取导航栏内容元素
  const collapse = document.querySelector('#navBarContent');
  // 检查元素是否存在并且是否是显示状态
  if (collapse && collapse.classList.contains('show')) {
    // 获取导航栏切换按钮元素
    const toggle = document.querySelector('#navBarToggle') as HTMLElement;
    // 如果切换按钮存在，点击它
    if (toggle) {
      toggle.click();
    }
  }
}

export const iframeManager = new IframeManager();

export function convertMarkdownLinks(markdown: string): string {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g; // 使用 'g' 标志来匹配所有链接

  return markdown.replace(regex, (match, text, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${text}</a>`;
  });
}
