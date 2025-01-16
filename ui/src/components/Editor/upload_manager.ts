import { Policy, PolicyType, Task, TaskType } from '@/components/Editor/types';
import Base from '@/components/Editor/uploader/base';
import OneDrive from '@/components/Editor/uploader/onedrive';
import { Pool } from '@/components/Editor/utils/pool';
import ResumeHint from '@/components/Editor/uploader/placeholder';

export interface Option {
  concurrentLimit: number;
  dropZone?: HTMLElement;
  onDropOver?: (e: DragEvent) => void;
  onDropLeave?: (e: DragEvent) => void;
  onToast: (type: string, msg: string) => void;
  onDropFileAdded?: (uploaders: Base[]) => void;
}

export default class UploadManager {
  public pool: Pool;

  private static id = 0;

  private policy?: Policy;

  // eslint-disable-next-line no-plusplus
  private id = ++UploadManager.id;

  // used for proactive upload (drop, paste)
  private currentPath = '/';

  constructor(private o: Option) {
    this.pool = new Pool(o.concurrentLimit);
  }

  changeConcurrentLimit = (newLimit: number) => {
    this.pool.limit = newLimit;
  };

  dispatchUploader(task: Task): Base | null {
    if (task.type === TaskType.resumeHint) {
      return new ResumeHint(task, this);
    }

    switch (task.policy.type) {
      case PolicyType.local:
        break;
      case PolicyType.remote:
        break;
      case PolicyType.onedrive:
        return new OneDrive(task, this);
      case PolicyType.oss:
        break;
      case PolicyType.qiniu:
        break;
      case PolicyType.cos:
        break;
      case PolicyType.upyun:
        break;
      case PolicyType.s3:
        break;
      default:
      // throw new UnknownPolicyError('Unknown policy type.', task.policy);
    }
    return null;
  }
}
