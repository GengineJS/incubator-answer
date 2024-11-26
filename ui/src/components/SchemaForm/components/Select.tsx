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

import React, { FC } from 'react';
import { Dropdown, Form } from 'react-bootstrap';

import type * as Type from '@/common/interface';

interface Props {
  desc: string | undefined;
  fieldName: string;
  onChange?: (fd: Type.FormDataType) => void;
  enumValues: (string | boolean | number)[];
  enumNames: string[];
  formData: Type.FormDataType;
  readOnly: boolean;
  multiple?: boolean;
  placeholder?: string;
  displayText?: string;
}

const Index: FC<Props> = ({
  desc,
  fieldName,
  onChange,
  enumValues,
  enumNames,
  formData,
  placeholder = 'Please select',
  readOnly = false,
  multiple = false,
  displayText = 'item selected',
}) => {
  const fieldObject = formData[fieldName];

  // 确保 value 始终是数组
  const currentValues = Array.isArray(fieldObject?.value)
    ? fieldObject.value
    : fieldObject?.value
      ? [fieldObject.value]
      : [];

  const handleChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = evt.currentTarget;

    // 处理多选逻辑
    let newValues;
    if (multiple) {
      // 如果值已存在，则移除；否则添加
      newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
    } else {
      newValues = [value];
    }

    const state = {
      ...formData,
      [name]: {
        ...formData[name],
        value: multiple ? newValues : newValues[0], // 多选时保持数组，单选时取第一个值
        isInvalid: false,
      },
    };

    if (typeof onChange === 'function') {
      onChange(state);
    }
  };

  const getDisplayText = () => {
    if (currentValues.length === 0) return placeholder;
    if (currentValues.length < 2) {
      return enumNames
        .filter((_, idx) => currentValues.includes(String(enumValues[idx])))
        .join(', ');
    }
    return `${currentValues.length} ${displayText}`;
  };

  return multiple ? (
    <Dropdown>
      <Dropdown.Toggle variant="outline-secondary" id={fieldName}>
        {getDisplayText()}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {enumValues?.map((item, index) => (
          <Dropdown.Item
            key={String(item)}
            active={currentValues.includes(String(item))}
            onClick={() => {
              const value = String(item);
              const newValues = currentValues.includes(value)
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value];

              const state = {
                ...formData,
                [fieldName]: {
                  ...formData[fieldName],
                  value: newValues,
                  isInvalid: false,
                },
              };

              if (typeof onChange === 'function') {
                onChange(state);
              }
            }}>
            {enumNames?.[index]}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  ) : (
    <Form.Select
      aria-label={desc}
      name={fieldName}
      value={currentValues}
      onChange={handleChange}
      disabled={readOnly}
      isInvalid={fieldObject?.isInvalid}>
      {enumValues?.map((item, index) => (
        <option
          value={String(item)}
          key={String(item)}
          // 为多选模式添加选中状态
          selected={multiple && currentValues.includes(String(item))}>
          {enumNames?.[index]}
        </option>
      ))}
    </Form.Select>
  );
};

export default Index;
