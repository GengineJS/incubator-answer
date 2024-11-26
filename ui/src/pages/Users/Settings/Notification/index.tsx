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

import React, { useState, FormEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import type { FormDataType, NotificationConfig } from '@/common/interface';
import { useToast } from '@/hooks';
import { useGetNotificationConfig, putNotificationConfig } from '@/services';
import { SchemaForm, JSONSchema, UISchema, initFormData } from '@/components';

const Index = () => {
  const toast = useToast();
  const { t } = useTranslation('translation', {
    keyPrefix: 'settings.notification',
  });
  const { data: configData } = useGetNotificationConfig();
  const emailSubjects = [
    'all_email_new_score_question',
    'all_email_new_question',
    'all_email_new_score_article',
    'all_email_new_article',
    'all_email_new_bounty',
    'all_email_new_score_assetbun',
    'all_email_new_assetbun',
    'all_email_new_subject_for_following_tags',
    'all_email_new_subject_score_for_following_tags',
  ];
  const defaultEmailSubjects = emailSubjects.filter(
    (subject) => configData?.[subject]?.enable,
  );
  const schema: JSONSchema = {
    title: t('email_heading'),
    properties: {
      inbox: {
        type: 'boolean',
        title: t('inbox.label'),
        description: t('inbox.description'),
        default: configData?.inbox.enable,
      },
      all_new_subject: {
        type: 'boolean',
        title: t('all_new_subject.label'),
        description: t('all_new_subject.description'),
        default: configData?.all_new_subject.enable,
      },
      all_new_subject_for_following_tags: {
        type: 'boolean',
        title: t('all_new_subject_for_following_tags.label'),
        description: t('all_new_subject_for_following_tags.description'),
        default: configData?.all_new_subject_for_following_tags.enable,
      },
      // title: {
      //   type: 'null',
      //   title: t('email_heading'),
      // },
      // email_inbox: {
      //   type: 'boolean',
      //   title: t('inbox.label'),
      //   description: t('inbox.description'),
      //   default: configData?.email_inbox.enable,
      // },
      all_email_new_subject: {
        type: 'boolean',
        title: t('all_email_new_subject.label'),
        description: t('all_email_new_subject.description'),
        enum: emailSubjects,
        default: defaultEmailSubjects,
        enumNames: [
          t('all_new_score_question.title'),
          t('all_new_question.title'),
          t('all_new_score_article.title'),
          t('all_new_article.title'),
          t('all_new_bounty.title'),
          t('all_new_score_assetbun.title'),
          t('all_new_assetbun.title'),
          t('all_new_none_score_subject_for_following_tags.title'),
          t('all_new_score_subject_for_following_tags.title'),
        ],
        placeholder: t('all_email_new_subject.placeholder'),
        displayText: t('all_email_new_subject.displayText'),
        multiple: true,
      },
    },
  };
  const uiSchema: UISchema = {
    inbox: {
      'ui:widget': 'switch',
      'ui:options': {
        label: t('turn_on'),
      },
    },
    all_new_subject: {
      'ui:widget': 'switch',
      'ui:options': {
        label: t('turn_on'),
      },
    },
    all_new_subject_for_following_tags: {
      'ui:widget': 'switch',
      'ui:options': {
        label: t('turn_on'),
        text: t('all_new_subject_for_following_tags.description'),
      },
    },
    // email_inbox: {
    //   'ui:widget': 'switch',
    //   'ui:options': {
    //     label: t('turn_on'),
    //   },
    // },
    all_email_new_subject: {
      'ui:widget': 'select',
      'ui:options': {
        label: t('turn_on'),
      },
    },
  };
  const [formData, setFormData] = useState<FormDataType>(initFormData(schema));

  useEffect(() => {
    setFormData(initFormData(schema));
  }, [configData]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const params = {
      inbox: {
        enable: formData.inbox.value,
        key: configData?.inbox.key,
      },
      all_new_subject: {
        enable: formData.all_new_subject.value,
        key: configData?.all_new_subject.key,
      },
      all_new_subject_for_following_tags: {
        enable: formData.all_new_subject_for_following_tags.value,
        key: configData?.all_new_subject_for_following_tags.key,
      },
    } as NotificationConfig;
    const allEmailNewSubject = formData.all_email_new_subject
      .value as Array<string>;
    allEmailNewSubject.forEach((val) => {
      params[`${val}`] = {
        enable: true,
        key: configData?.[`${val}`].key,
      };
    });

    putNotificationConfig(params).then(() => {
      toast.onShow({
        msg: t('update', { keyPrefix: 'toast' }),
        variant: 'success',
      });
    });
  };

  const handleChange = (ud) => {
    setFormData(ud);
  };
  return (
    <>
      <h3 className="mb-4">{t('email_heading')}</h3>
      <SchemaForm
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default React.memo(Index);
