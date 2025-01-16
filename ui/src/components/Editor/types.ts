/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { EditorView, Command } from '@codemirror/view';

export interface Position {
  ch: number;
  line: number;
  sticky?: string | undefined;
}
export interface ExtendEditor {
  addKeyMap: (keyMap: Record<string, Command>) => void;
  on: (
    event:
      | 'change'
      | 'focus'
      | 'blur'
      | 'dragenter'
      | 'dragover'
      | 'drop'
      | 'paste',
    callback: (e?) => void,
  ) => void;
  getValue: () => string;
  setValue: (value: string) => void;
  off: (
    event:
      | 'change'
      | 'focus'
      | 'blur'
      | 'dragenter'
      | 'dragover'
      | 'drop'
      | 'paste',
    callback: (e?) => void,
  ) => void;
  getSelection: () => string;
  replaceSelection: (value: string) => void;
  focus: () => void;
  wrapText: (before: string, after?: string, defaultText?: string) => void;
  replaceLines: (
    replace: Parameters<Array<string>['map']>[0],
    symbolLen?: number,
  ) => void;
  appendBlock: (content: string) => void;
  getCursor: () => Position;
  replaceRange: (value: string, from: Position, to: Position) => void;
  setSelection: (anchor: Position, head?: Position) => void;
}

export type Editor = EditorView & ExtendEditor;
export interface CodeMirrorEditor extends Editor {
  display: any;

  moduleType;
}

export interface UploadCredential {
  sessionID: string;
  expires: number;
  chunkSize: number;
  uploadURLs: string[];
  credential: string;
  uploadID: string;
  callback: string;
  policy: string;
  ak: string;
  keyTime: string;
  path: string;
  completeURL: string;
}

export interface OneDriveError {
  error: {
    code: string;
    message: string;
    innererror?: {
      code: string;
    };
    retryAfterSeconds?: number;
  };
}

export interface IEditorContext {
  editor: Editor;
  wrapText?;
  replaceLines?;
  appendBlock?;
}

export enum PolicyType {
  local = 'local',
  remote = 'remote',
  oss = 'oss',
  qiniu = 'qiniu',
  onedrive = 'onedrive',
  cos = 'cos',
  upyun = 'upyun',
  s3 = 's3',
}

export interface OneDriveChunkResponse {
  expirationDateTime: string;
  nextExpectedRanges: string[];
}

// eslint-disable-next-line import/export
export interface Response<T> {
  code: number;
  data: T;
  msg: string;
  error: string;
}

export enum TaskType {
  file,
  resumeHint,
}

export interface ChunkProgress {
  loaded: number;
  index: number;
  etag?: string;
}
type Nullable<T> = T | null;
export interface Policy {
  id: string;
  name: string;
  allowedSuffix: Nullable<string[]>;
  maxSize: number;
  type: PolicyType;
}

export interface Task {
  type: TaskType;
  name: string;
  size: number;
  policy: Policy;
  dst: string;
  get_link?: boolean;
  tag?: string;
  file: File;
  child?: Task[];
  session?: UploadCredential;
  chunkProgress: ChunkProgress[];
  resumed: boolean;
}

export interface UploadSessionRequest {
  path: string;
  tag?: string;
  size: number;
  get_link?: boolean;
  name: string;
  policy_id: string;
  last_modified?: number;
}

export interface GetFileLinkRequest {
  path: string;
  name: string;
}
