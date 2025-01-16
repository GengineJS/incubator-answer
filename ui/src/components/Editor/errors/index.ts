// eslint-disable-next-line max-classes-per-file
import { OneDriveError, Policy, Response } from '@/components/Editor/types';

export enum UploaderErrorName {
  InvalidFile = 'InvalidFile',
  NoPolicySelected = 'NoPolicySelected',
  UnknownPolicyType = 'UnknownPolicyType',
  FailedCreateUploadSession = 'FailedCreateUploadSession',
  FailedDeleteUploadSession = 'FailedDeleteUploadSession',
  HTTPRequestFailed = 'HTTPRequestFailed',
  LocalChunkUploadFailed = 'LocalChunkUploadFailed',
  SlaveChunkUploadFailed = 'SlaveChunkUploadFailed',
  WriteCtxFailed = 'WriteCtxFailed',
  RemoveCtxFailed = 'RemoveCtxFailed',
  ReadCtxFailed = 'ReadCtxFailed',
  InvalidCtxData = 'InvalidCtxData',
  CtxExpired = 'CtxExpired',
  RequestCanceled = 'RequestCanceled',
  ProcessingTaskDuplicated = 'ProcessingTaskDuplicated',
  OneDriveChunkUploadFailed = 'OneDriveChunkUploadFailed',
  OneDriveEmptyFile = 'OneDriveEmptyFile',
  FailedFinishOneDriveUpload = 'FailedFinishOneDriveUpload',
  S3LikeChunkUploadFailed = 'S3LikeChunkUploadFailed',
  S3LikeUploadCallbackFailed = 'S3LikeUploadCallbackFailed',
  COSUploadCallbackFailed = 'COSUploadCallbackFailed',
  COSPostUploadFailed = 'COSPostUploadFailed',
  UpyunPostUploadFailed = 'UpyunPostUploadFailed',
  QiniuChunkUploadFailed = 'QiniuChunkUploadFailed',
  FailedFinishOSSUpload = 'FailedFinishOSSUpload',
  FailedFinishQiniuUpload = 'FailedFinishQiniuUpload',
  FailedTransformResponse = 'FailedTransformResponse',
  FailedGetFileLink = 'FailedGetFileLink',
}

const RETRY_ERROR_LIST = [
  UploaderErrorName.FailedCreateUploadSession,
  UploaderErrorName.HTTPRequestFailed,
  UploaderErrorName.LocalChunkUploadFailed,
  UploaderErrorName.SlaveChunkUploadFailed,
  UploaderErrorName.RequestCanceled,
  UploaderErrorName.ProcessingTaskDuplicated,
  UploaderErrorName.FailedTransformResponse,
];

// const RETRY_CODE_LIST = [-1];

// eslint-disable-next-line max-classes-per-file
export class UploaderError implements Error {
  public stack: string | undefined;

  constructor(
    public name: UploaderErrorName,
    public message: string,
  ) {
    this.stack = new Error().stack;
  }

  public Message(): string {
    return this.message;
  }

  public Retryable(): boolean {
    return RETRY_ERROR_LIST.includes(this.name);
  }
}

// HTTP 请求出错
export class HTTPError extends UploaderError {
  public response?: any;

  constructor(
    public axiosErr: any,
    protected url: string,
  ) {
    super(UploaderErrorName.HTTPRequestFailed, axiosErr.message);
    this.response = axiosErr.response;
  }

  public Message(): string {
    return `uploader.requestError: ${this.axiosErr}${this.url}`;
  }
}

// 无法解析响应
export class TransformResponseError extends UploaderError {
  constructor(
    private response: string,
    parseError: Error,
  ) {
    super(UploaderErrorName.FailedTransformResponse, parseError.message);
  }

  public Message(): string {
    return `uploader.parseResponseError: ${this.message}${this.response}`;
  }
}

// OneDrive 分块上传失败
export class OneDriveChunkError extends UploaderError {
  constructor(public response: OneDriveError) {
    super(UploaderErrorName.OneDriveChunkUploadFailed, response.error.message);
  }

  public Message(): string {
    let msg = `uploader.chunkUploadErrorWithMsg: ${this.message}`;

    if (this.response.error.retryAfterSeconds !== undefined) {
      msg += `uploader.chunkUploadErrorWithRetryAfter${
        this.response.error.retryAfterSeconds
      }`;
    }

    return msg;
  }

  public Retryable(): boolean {
    return (
      super.Retryable() || this.response.error.retryAfterSeconds !== undefined
    );
  }
}

// 无法创建上传会话
export class RequestCanceledError extends UploaderError {
  constructor() {
    super(UploaderErrorName.RequestCanceled, 'Request canceled');
  }
}

// OneDrive 选择了空文件上传
export class OneDriveEmptyFileSelected extends UploaderError {
  constructor() {
    super(UploaderErrorName.OneDriveEmptyFile, 'empty file not supported');
  }

  public Message(): string {
    return 'uploader.emptyFileError';
  }
}
const RETRY_CODE_LIST = [-1];
// 后端 API 出错
export class APIError extends UploaderError {
  private appError: string;

  constructor(
    name: UploaderErrorName,
    message: string,
    protected response: Response<any>,
  ) {
    super(name, message);
    this.appError = response.msg;
  }

  public Message(): string {
    return `${this.message}: ${this.appError}`;
  }

  public Retryable(): boolean {
    return super.Retryable() && RETRY_CODE_LIST.includes(this.response.code);
  }
}

// OneDrive 无法完成文件上传
export class OneDriveFinishUploadError extends APIError {
  constructor(response: Response<any>) {
    super(UploaderErrorName.FailedFinishOneDriveUpload, '', response);
  }

  public Message(): string {
    this.message = 'uploader.finishUploadError';
    return super.Message();
  }
}

// 云存储库 获取文件链接失败
export class GetFileLinkError extends APIError {
  constructor(response: Response<any>) {
    super(UploaderErrorName.FailedGetFileLink, '', response);
  }

  public Message(): string {
    this.message = 'uploader.failedGetFileLink';
    return super.Message();
  }
}

// 无法创建上传会话
export class CreateUploadSessionError extends APIError {
  constructor(response: Response<any>) {
    super(UploaderErrorName.FailedCreateUploadSession, '', response);
  }

  public Message(): string {
    this.message = `uploader.createUploadSessionError`;
    return super.Message();
  }
}

// 无法删除上传会话
export class DeleteUploadSessionError extends APIError {
  constructor(response: Response<any>) {
    super(UploaderErrorName.FailedDeleteUploadSession, '', response);
  }

  public Message(): string {
    this.message = `uploader.deleteUploadSessionError`;
    return super.Message();
  }
}

// 上传任务冲突
export class ProcessingTaskDuplicatedError extends UploaderError {
  constructor() {
    super(
      UploaderErrorName.ProcessingTaskDuplicated,
      'Processing task duplicated',
    );
  }

  public Message(): string {
    return `uploader.conflictError`;
  }
}

// 文件未通过存储策略验证
export class FileValidateError extends UploaderError {
  // 未通过验证的文件属性
  public field: 'size' | 'suffix';

  // 对应的存储策略
  public policy: Policy;

  constructor(message: string, field: 'size' | 'suffix', policy: Policy) {
    super(UploaderErrorName.InvalidFile, message);
    this.field = field;
    this.policy = policy;
  }

  public Message(): string {
    if (this.field === 'size') {
      return `uploader.sizeExceedLimitError${this.policy.maxSize}`;
    }

    // eslint-disable-next-line no-constant-condition
    return `uploader.suffixNotAllowedError${this.policy.allowedSuffix}`
      ? this.policy.allowedSuffix!.join(',')
      : '*';
  }
}
