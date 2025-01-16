import { Task } from '../types';
import UploadManager from '../upload_manager';
import { sumChunk } from '@/components/Editor/utils/helper';

import { Status } from './base';
import Chunk, { ChunkInfo } from './chunk';

export default class ResumeHint extends Chunk {
  constructor(task: Task, manager: UploadManager) {
    super(task, manager);
    this.status = Status.resumable;
    this.progress = {
      total: this.getProgressInfoItem(
        sumChunk(this.task.chunkProgress),
        this.task.size + 1,
      ),
    };
    this.subscriber.onProgress(this.progress);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async uploadChunk(chunkInfo: ChunkInfo) {
    return null;
  }
}
