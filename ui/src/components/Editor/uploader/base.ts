// 所有 Uploader 的基类
import axios, { CancelTokenSource } from 'axios';

import { PolicyType, Task } from '../types';
import UploadManager from '../upload_manager';
// import Logger from "../logger";
import { validate } from '../utils/validator';
import { CancelToken } from '../utils/request';
import { createUploadSession, deleteUploadSession } from '../api';
import { RequestCanceledError, UploaderError } from '../errors';
import {
  getResumeCtx,
  getResumeCtxKey,
  removeResumeCtx,
} from '@/components/Editor/utils/helper';

export enum Status {
  added,
  resumable,
  initialized,
  queued,
  preparing,
  processing,
  finishing,
  finished,
  error,
  canceled,
}

export interface UploadHandlers {
  onTransition: (newStatus: Status) => void;
  onError: (err: Error) => void;
  onProgress: (data: UploadProgress) => void;
  onMsg: (msg: string, color: string) => void;
}

export interface UploadProgress {
  total: ProgressCompose;
  chunks?: ProgressCompose[];
}

export interface ProgressCompose {
  size: number;
  loaded: number;
  percent: number;
  fromCache?: boolean;
}

export interface Progress {
  total: number;
  loaded: number;
}

const resumePolicy = [
  PolicyType.local,
  PolicyType.remote,
  PolicyType.qiniu,
  PolicyType.oss,
  PolicyType.onedrive,
  PolicyType.s3,
];
const deleteUploadSessionDelay = 500;

export default abstract class Base {
  public child?: Base[];

  public status: Status = Status.added;

  public error?: Error;

  // eslint-disable-next-line no-plusplus
  public id = ++Base.id;

  private static id = 0;

  protected subscriber: UploadHandlers;

  // 用于取消请求
  protected cancelToken: CancelTokenSource = CancelToken.source();

  protected progress: UploadProgress | undefined;

  public lastTime = Date.now();

  public startTime = Date.now();

  constructor(
    public task: Task,
    protected manager: UploadManager,
  ) {
    console.info('Initialize new uploader for task: ', task);
    this.subscriber = {
      onTransition: () => {},
      onError: () => {},
      onProgress: () => {},
      onMsg: () => {},
    };
  }

  public subscribe = (handlers: UploadHandlers) => {
    this.subscriber = handlers;
  };

  public start = async () => {
    console.info('Activate uploading task');
    this.transit(Status.initialized);
    // eslint-disable-next-line no-multi-assign
    this.lastTime = this.startTime = Date.now();

    try {
      validate(this.task.file, this.task.policy);
    } catch (e) {
      console.error('File validate failed with error:', e);
      // @ts-ignore
      this.setError(e);
      return;
    }

    console.info('Enqueued in manager pool');
    this.transit(Status.queued);
    this.manager.pool.enqueue(this).catch((e) => {
      console.info('Upload task failed with error:', e);
      this.setError(e);
    });
  };

  public run = async () => {
    console.info('Start upload task, create upload session...');
    this.transit(Status.preparing);
    const cachedInfo = getResumeCtx(this.task);
    if (cachedInfo == null) {
      this.task.session = await createUploadSession(
        {
          path: this.task.dst,
          tag: this.task.tag,
          get_link: this.task.get_link,
          size: this.task.file.size,
          name: this.task.file.name,
          policy_id: this.task.policy.id,
          last_modified: this.task.file.lastModified,
        },
        this.cancelToken.token,
      );
      console.info('Upload session created:', this.task.session);
    } else {
      this.task.session = cachedInfo.session;
      this.task.resumed = true;
      this.task.chunkProgress = cachedInfo.chunkProgress;
      console.info('Resume upload from cached ctx:', cachedInfo);
    }

    this.transit(Status.processing);
    await this.upload();
    await this.afterUpload();
    removeResumeCtx(this.task);
    this.transit(Status.finished);
    console.info('Upload task completed');
  };

  public async upload(): Promise<any> {
    return false;
  }

  protected async afterUpload(): Promise<any> {
    return null;
  }

  public cancel = async () => {
    if (this.status === Status.finished) {
      return;
    }

    this.cancelToken.cancel();
    await this.cancelUploadSession();
    this.transit(Status.canceled);
  };

  public reset = () => {
    this.cancelToken = axios.CancelToken.source();
    this.progress = {
      total: {
        size: 0,
        loaded: 0,
        percent: 0,
      },
    };
  };

  protected setError(e: Error) {
    if (
      !(e instanceof UploaderError && e.Retryable()) ||
      !resumePolicy.includes(this.task.policy.type)
    ) {
      console.warn('Non-resume error occurs, clean resume ctx cache');
      this.cancelUploadSession();
    }

    if (!(e instanceof RequestCanceledError)) {
      this.status = Status.error;
      this.error = e;
      this.subscriber.onError(e);
    }
  }

  protected cancelUploadSession = (): Promise<void> => {
    return new Promise<void>((resolve) => {
      removeResumeCtx(this.task);
      if (this.task.session) {
        setTimeout(() => {
          deleteUploadSession(this.task.session!?.sessionID)
            .catch((e) => {
              console.warn('Failed to cancel upload session: ', e);
            })
            .finally(() => {
              resolve();
            });
        }, deleteUploadSessionDelay);
      } else {
        resolve();
      }
    });
  };

  protected transit(status: Status) {
    this.status = status;
    this.subscriber.onTransition(status);
  }

  public getProgressInfoItem(
    loaded: number,
    size: number,
    fromCache?: boolean,
  ): ProgressCompose {
    return {
      size,
      loaded,
      percent: (loaded / size) * 100,
      ...(fromCache == null ? {} : { fromCache }),
    };
  }

  public key(): string {
    return getResumeCtxKey(this.task);
  }
}
