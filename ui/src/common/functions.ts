import {
  ContentType,
  hasPayType,
  IframeMsgType,
  isModerator,
  PageType,
  shareLocalStorageDomains,
  targetAssetBunUrl,
  targetLocalStorageUrl,
} from '@/common/constants';

export function getUrlQueryParam(key: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}

export function getUrlQuestionType(key: string = 'content_type'): number {
  const param = getUrlQueryParam(key);
  return param ? parseInt(param, 10) : ContentType.QUESTION;
}

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

export function getTargetLocalStorageHost(): string {
  const currDomain = getDomainName();
  const idx = shareLocalStorageDomains.indexOf(currDomain);
  return targetLocalStorageUrl[idx];
}

export function getTargetAssetBunHost(): string {
  const currDomain = getDomainName();
  const idx = shareLocalStorageDomains.indexOf(currDomain);
  return targetAssetBunUrl[idx];
}

export interface IframeParams {
  email: string;
  password: string;
  type: IframeMsgType;
}

class IframeManager {
  private iframe: HTMLIFrameElement | null = null;

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
        console.log('Iframe loaded.');
      };
    }
    return this.iframe;
  }

  public postMsg(params: IframeParams) {
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
