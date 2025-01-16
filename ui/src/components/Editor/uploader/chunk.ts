import {
  getChunks,
  getResumeCtx,
  setResumeCtx,
  sumChunk,
} from '@/components/Editor/utils/helper';

import Base from './base';

export interface ChunkProgress {
  loaded: number;
  index: number;
  etag?: string;
}

export interface ChunkInfo {
  chunk: Blob;
  index: number;
}

export default abstract class Chunk extends Base {
  protected chunks!: Blob[];

  public upload = async () => {
    console.info('Preparing uploading file chunks.');
    this.initBeforeUploadChunks();

    console.info('Starting uploading file chunks:', this.chunks);
    this.updateLocalCache();
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.chunks.length; i++) {
      if (
        this.task.chunkProgress[i].loaded < this.chunks[i].size ||
        this.chunks[i].size === 0
      ) {
        // eslint-disable-next-line no-await-in-loop
        await this.uploadChunk({ chunk: this.chunks[i], index: i });
        console.info(`Chunk [${i}] uploaded.`);
        this.updateLocalCache();
      }
    }
  };

  private initBeforeUploadChunks() {
    this.chunks = getChunks(this.task.file, this.task.session?.chunkSize);
    const cachedInfo = getResumeCtx(this.task);
    if (cachedInfo == null) {
      this.task.chunkProgress = this.chunks.map(
        (value, index): ChunkProgress => ({
          loaded: 0,
          index,
        }),
      );
    }

    this.notifyResumeProgress();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async uploadChunk(chunkInfo: ChunkInfo): Promise<any> {
    return false;
  }

  protected updateChunkProgress(loaded: number, index: number) {
    this.task.chunkProgress[index].loaded = loaded;
    this.notifyResumeProgress();
  }

  private notifyResumeProgress() {
    this.progress = {
      total: this.getProgressInfoItem(
        sumChunk(this.task.chunkProgress),
        this.task.file.size + 1,
      ),
      chunks: this.chunks.map((chunk, index) => {
        return this.getProgressInfoItem(
          this.task.chunkProgress[index].loaded,
          chunk.size,
          false,
        );
      }),
    };
    this.subscriber.onProgress(this.progress);
  }

  private updateLocalCache() {
    setResumeCtx(this.task);
  }
}
