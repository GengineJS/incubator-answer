import { CancelToken } from 'axios';

import { ChunkInfo } from '@/components/Editor/uploader/chunk';
import { Progress } from '@/components/Editor/uploader/base';
import {
  GetFileLinkRequest,
  OneDriveChunkResponse,
  UploadCredential,
  UploadSessionRequest,
} from '@/components/Editor/types';
import {
  CreateUploadSessionError,
  DeleteUploadSessionError,
  HTTPError,
  OneDriveChunkError,
  OneDriveFinishUploadError,
} from '@/components/Editor/errors';
import { request, requestAPI } from '@/components/Editor/utils/request';
import { getTargetRootAssetBunHost } from '@/common/functions';

export async function getFileLink(req: GetFileLinkRequest): Promise<string> {
  const targetHost = getTargetRootAssetBunHost();
  const res = await requestAPI<string>(`${targetHost}/api/v3/file/link`, {
    method: 'post',
    data: req,
  });

  if (res.data.code !== 0) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    // throw new GetFileLinkError(res.data);
    return '';
  }
  return res.data.data;
}

export async function oneDriveUploadChunk(
  url: string,
  range: string, // if range is empty, this will be an request to query the session status
  chunk: ChunkInfo,
  onProgress: (p: Progress) => void,
  cancel: CancelToken,
): Promise<OneDriveChunkResponse> {
  const res = await request<OneDriveChunkResponse>(url, {
    method: range === '' ? 'get' : 'put',
    headers: {
      'content-type': 'application/octet-stream',
      ...(range !== '' && { 'content-range': range }),
    },
    data: chunk.chunk,
    onUploadProgress: (progressEvent) => {
      onProgress({
        loaded: progressEvent.loaded,
        total: progressEvent.total,
      });
    },
    cancelToken: cancel,
  }).catch((e) => {
    if (e instanceof HTTPError && e.response) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw new OneDriveChunkError(e.response.data);
    }

    throw e;
  });

  return res.data;
}

export async function finishOneDriveUpload(
  sessionID: string,
  cancel: CancelToken,
): Promise<UploadCredential> {
  const targetHost = getTargetRootAssetBunHost();
  const res = await requestAPI<UploadCredential>(
    `${targetHost}/api/v3/callback/onedrive/finish/${sessionID}`,
    {
      method: 'post',
      data: {
        permalink: true,
      },
      cancelToken: cancel,
    },
  );
  console.log(res.data.data);
  if (res.data.code !== 0) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw new OneDriveFinishUploadError(res.data);
  }
  return res.data.data;
}

export async function createUploadSession(
  req: UploadSessionRequest,
  cancel: CancelToken,
): Promise<UploadCredential> {
  const targetHost = getTargetRootAssetBunHost();
  const res = await requestAPI<UploadCredential>(
    `${targetHost}/api/v3/file/upload`,
    {
      method: 'put',
      data: req,
      cancelToken: cancel,
    },
  );

  if (res.data.code !== 0) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw new CreateUploadSessionError(res.data);
  }

  return res.data.data;
}

export async function deleteUploadSession(id: string): Promise<any> {
  const res = await requestAPI<UploadCredential>(`file/upload/${id}`, {
    method: 'delete',
  });

  if (res.data.code !== 0) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw new DeleteUploadSessionError(res.data);
  }

  return res.data.data;
}
