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
// import { Modal } from '@/components';

export const DEFAULT_SITE_NAME = 'Answer';
export const DEFAULT_LANG = 'en_US';
export const CURRENT_LANG_STORAGE_KEY = '_a_lang_';
export const LANG_RESOURCE_STORAGE_KEY = '_a_lang_r_';
export const LOGGED_TOKEN_STORAGE_KEY = '_a_ltk_';
export const REDIRECT_PATH_STORAGE_KEY = '_a_rp_';
export const CAPTCHA_CODE_STORAGE_KEY = '_a_captcha_';
export const DRAFT_QUESTION_STORAGE_KEY = '_a_dq_';
export const DRAFT_ANSWER_STORAGE_KEY = '_a_da_';
export const DRAFT_TIMESIGH_STORAGE_KEY = '|_a_t_s_|';
export const QUESTIONS_ORDER_STORAGE_KEY = '_a_qok_';
export const DEFAULT_THEME = 'system';
export const ADMIN_PRIVILEGE_CUSTOM_LEVEL = 99;
export const SKELETON_SHOW_TIME = 1000;
export const enum IframeMsgType {
  LOGIN,
  LOGOUT,
}

export const USER_AGENT_NAMES = {
  SegmentFault: 'SegmentFault',
  WeChat: 'WeChat',
  WeCom: 'WeCom',
  DingTalk: 'DingTalk',
};

export const ADMIN_LIST_STATUS = {
  // normal;
  1: {
    variant: 'text-bg-success',
    name: 'normal',
  },
  // closed;
  2: {
    variant: 'text-bg-warning',
    name: 'closed',
  },
  // deleted
  10: {
    variant: 'text-bg-danger',
    name: 'deleted',
  },
  // pending
  11: {
    variant: 'text-bg-warning',
    name: 'pending',
  },
  normal: {
    variant: 'text-bg-success',
    name: 'normal',
  },
  closed: {
    variant: 'text-bg-warning',
    name: 'closed',
  },
  deleted: {
    variant: 'text-bg-danger',
    name: 'deleted',
  },
  pending: {
    variant: 'text-bg-warning',
    name: 'pending',
  },
  unlisted: {
    variant: 'text-bg-secondary',
    name: 'unlisted',
  },
};

export const ADMIN_NAV_MENUS = [
  {
    name: 'dashboard',
    children: [],
  },
  {
    name: 'contents',
    children: [{ name: 'questions' }, { name: 'answers' }],
  },
  {
    name: 'users',
  },
  {
    name: 'customize',
    children: [
      {
        name: 'themes',
      },
      {
        name: 'css_html',
        path: 'css-html',
      },
    ],
  },
  {
    name: 'settings',
    children: [
      { name: 'general' },
      { name: 'interface' },
      { name: 'branding' },
      { name: 'smtp' },
      { name: 'legal' },
      { name: 'write' },
      { name: 'seo' },
      { name: 'login' },
      { name: 'users', path: 'settings-users' },
      { name: 'privileges' },
    ],
  },
  {
    name: 'plugins',
    children: [
      {
        name: 'installed_plugins',
        path: 'installed-plugins',
      },
    ],
  },
];

export const TIMEZONES = [
  {
    label: 'Africa',
    options: [
      { value: 'Africa/Abidjan', label: 'Abidjan' },
      { value: 'Africa/Accra', label: 'Accra' },
      { value: 'Africa/Addis_Ababa', label: 'Addis Ababa' },
      { value: 'Africa/Algiers', label: 'Algiers' },
      { value: 'Africa/Asmara', label: 'Asmara' },
      { value: 'Africa/Bamako', label: 'Bamako' },
      { value: 'Africa/Bangui', label: 'Bangui' },
      { value: 'Africa/Banjul', label: 'Banjul' },
      { value: 'Africa/Bissau', label: 'Bissau' },
      { value: 'Africa/Blantyre', label: 'Blantyre' },
      { value: 'Africa/Brazzaville', label: 'Brazzaville' },
      { value: 'Africa/Bujumbura', label: 'Bujumbura' },
      { value: 'Africa/Cairo', label: 'Cairo' },
      { value: 'Africa/Casablanca', label: 'Casablanca' },
      { value: 'Africa/Ceuta', label: 'Ceuta' },
      { value: 'Africa/Conakry', label: 'Conakry' },
      { value: 'Africa/Dakar', label: 'Dakar' },
      { value: 'Africa/Dar_es_Salaam', label: 'Dar es Salaam' },
      { value: 'Africa/Djibouti', label: 'Djibouti' },
      { value: 'Africa/Douala', label: 'Douala' },
      { value: 'Africa/El_Aaiun', label: 'El Aaiun' },
      { value: 'Africa/Freetown', label: 'Freetown' },
      { value: 'Africa/Gaborone', label: 'Gaborone' },
      { value: 'Africa/Harare', label: 'Harare' },
      { value: 'Africa/Johannesburg', label: 'Johannesburg' },
      { value: 'Africa/Juba', label: 'Juba' },
      { value: 'Africa/Kampala', label: 'Kampala' },
      { value: 'Africa/Khartoum', label: 'Khartoum' },
      { value: 'Africa/Kigali', label: 'Kigali' },
      { value: 'Africa/Kinshasa', label: 'Kinshasa' },
      { value: 'Africa/Lagos', label: 'Lagos' },
      { value: 'Africa/Libreville', label: 'Libreville' },
      { value: 'Africa/Lome', label: 'Lome' },
      { value: 'Africa/Luanda', label: 'Luanda' },
      { value: 'Africa/Lubumbashi', label: 'Lubumbashi' },
      { value: 'Africa/Lusaka', label: 'Lusaka' },
      { value: 'Africa/Malabo', label: 'Malabo' },
      { value: 'Africa/Maputo', label: 'Maputo' },
      { value: 'Africa/Maseru', label: 'Maseru' },
      { value: 'Africa/Mbabane', label: 'Mbabane' },
      { value: 'Africa/Mogadishu', label: 'Mogadishu' },
      { value: 'Africa/Monrovia', label: 'Monrovia' },
      { value: 'Africa/Nairobi', label: 'Nairobi' },
      { value: 'Africa/Ndjamena', label: 'Ndjamena' },
      { value: 'Africa/Niamey', label: 'Niamey' },
      { value: 'Africa/Nouakchott', label: 'Nouakchott' },
      { value: 'Africa/Ouagadougou', label: 'Ouagadougou' },
      { value: 'Africa/Porto-Novo', label: 'Porto-Novo' },
      { value: 'Africa/Sao_Tome', label: 'Sao Tome' },
      { value: 'Africa/Tripoli', label: 'Tripoli' },
      { value: 'Africa/Tunis', label: 'Tunis' },
      { value: 'Africa/Windhoek', label: 'Windhoek' },
    ],
  },
  {
    label: 'America',
    options: [
      { value: 'America/Adak', label: 'Adak' },
      { value: 'America/Anchorage', label: 'Anchorage' },
      { value: 'America/Anguilla', label: 'Anguilla' },
      { value: 'America/Antigua', label: 'Antigua' },
      { value: 'America/Araguaina', label: 'Araguaina' },
      {
        value: 'America/Argentina/Buenos_Aires',
        label: 'Argentina - Buenos Aires',
      },
      { value: 'America/Argentina/Catamarca', label: 'Argentina - Catamarca' },
      { value: 'America/Argentina/Cordoba', label: 'Argentina - Cordoba' },
      { value: 'America/Argentina/Jujuy', label: 'Argentina - Jujuy' },
      { value: 'America/Argentina/La_Rioja', label: 'Argentina - La Rioja' },
      { value: 'America/Argentina/Mendoza', label: 'Argentina - Mendoza' },
      {
        value: 'America/Argentina/Rio_Gallegos',
        label: 'Argentina - Rio Gallegos',
      },
      { value: 'America/Argentina/Salta', label: 'Argentina - Salta' },
      { value: 'America/Argentina/San_Juan', label: 'Argentina - San Juan' },
      { value: 'America/Argentina/San_Luis', label: 'Argentina - San Luis' },
      { value: 'America/Argentina/Tucuman', label: 'Argentina - Tucuman' },
      { value: 'America/Argentina/Ushuaia', label: 'Argentina - Ushuaia' },
      { value: 'America/Aruba', label: 'Aruba' },
      { value: 'America/Asuncion', label: 'Asuncion' },
      { value: 'America/Atikokan', label: 'Atikokan' },
      { value: 'America/Bahia', label: 'Bahia' },
      { value: 'America/Bahia_Banderas', label: 'Bahia Banderas' },
      { value: 'America/Barbados', label: 'Barbados' },
      { value: 'America/Belem', label: 'Belem' },
      { value: 'America/Belize', label: 'Belize' },
      { value: 'America/Blanc-Sablon', label: 'Blanc-Sablon' },
      { value: 'America/Boa_Vista', label: 'Boa Vista' },
      { value: 'America/Bogota', label: 'Bogota' },
      { value: 'America/Boise', label: 'Boise' },
      { value: 'America/Cambridge_Bay', label: 'Cambridge Bay' },
      { value: 'America/Campo_Grande', label: 'Campo Grande' },
      { value: 'America/Cancun', label: 'Cancun' },
      { value: 'America/Caracas', label: 'Caracas' },
      { value: 'America/Cayenne', label: 'Cayenne' },
      { value: 'America/Cayman', label: 'Cayman' },
      { value: 'America/Chicago', label: 'Chicago' },
      { value: 'America/Chihuahua', label: 'Chihuahua' },
      { value: 'America/Costa_Rica', label: 'Costa Rica' },
      { value: 'America/Creston', label: 'Creston' },
      { value: 'America/Cuiaba', label: 'Cuiaba' },
      { value: 'America/Curacao', label: 'Curacao' },
      { value: 'America/Danmarkshavn', label: 'Danmarkshavn' },
      { value: 'America/Dawson', label: 'Dawson' },
      { value: 'America/Dawson_Creek', label: 'Dawson Creek' },
      { value: 'America/Denver', label: 'Denver' },
      { value: 'America/Detroit', label: 'Detroit' },
      { value: 'America/Dominica', label: 'Dominica' },
      { value: 'America/Edmonton', label: 'Edmonton' },
      { value: 'America/Eirunepe', label: 'Eirunepe' },
      { value: 'America/El_Salvador', label: 'El Salvador' },
      { value: 'America/Fort_Nelson', label: 'Fort Nelson' },
      { value: 'America/Fortaleza', label: 'Fortaleza' },
      { value: 'America/Glace_Bay', label: 'Glace Bay' },
      { value: 'America/Godthab', label: 'Godthab' },
      { value: 'America/Goose_Bay', label: 'Goose Bay' },
      { value: 'America/Grand_Turk', label: 'Grand Turk' },
      { value: 'America/Grenada', label: 'Grenada' },
      { value: 'America/Guadeloupe', label: 'Guadeloupe' },
      { value: 'America/Guatemala', label: 'Guatemala' },
      { value: 'America/Guayaquil', label: 'Guayaquil' },
      { value: 'America/Guyana', label: 'Guyana' },
      { value: 'America/Halifax', label: 'Halifax' },
      { value: 'America/Havana', label: 'Havana' },
      { value: 'America/Hermosillo', label: 'Hermosillo' },
      {
        value: 'America/Indiana/Indianapolis',
        label: 'Indiana - Indianapolis',
      },
      { value: 'America/Indiana/Knox', label: 'Indiana - Knox' },
      { value: 'America/Indiana/Marengo', label: 'Indiana - Marengo' },
      { value: 'America/Indiana/Petersburg', label: 'Indiana - Petersburg' },
      { value: 'America/Indiana/Tell_City', label: 'Indiana - Tell City' },
      { value: 'America/Indiana/Vevay', label: 'Indiana - Vevay' },
      { value: 'America/Indiana/Vincennes', label: 'Indiana - Vincennes' },
      { value: 'America/Indiana/Winamac', label: 'Indiana - Winamac' },
      { value: 'America/Inuvik', label: 'Inuvik' },
      { value: 'America/Iqaluit', label: 'Iqaluit' },
      { value: 'America/Jamaica', label: 'Jamaica' },
      { value: 'America/Juneau', label: 'Juneau' },
      { value: 'America/Kentucky/Louisville', label: 'Kentucky - Louisville' },
      { value: 'America/Kentucky/Monticello', label: 'Kentucky - Monticello' },
      { value: 'America/Kralendijk', label: 'Kralendijk' },
      { value: 'America/La_Paz', label: 'La Paz' },
      { value: 'America/Lima', label: 'Lima' },
      { value: 'America/Los_Angeles', label: 'Los Angeles' },
      { value: 'America/Lower_Princes', label: 'Lower Princes' },
      { value: 'America/Maceio', label: 'Maceio' },
      { value: 'America/Managua', label: 'Managua' },
      { value: 'America/Manaus', label: 'Manaus' },
      { value: 'America/Marigot', label: 'Marigot' },
      { value: 'America/Martinique', label: 'Martinique' },
      { value: 'America/Matamoros', label: 'Matamoros' },
      { value: 'America/Mazatlan', label: 'Mazatlan' },
      { value: 'America/Miquelon', label: 'Miquelon' },
      { value: 'America/Moncton', label: 'Moncton' },
      { value: 'America/Monterrey', label: 'Monterrey' },
      { value: 'America/Montevideo', label: 'Montevideo' },
      { value: 'America/Montserrat', label: 'Montserrat' },
      { value: 'America/Nassau', label: 'Nassau' },
      { value: 'America/New_York', label: 'New York' },
      { value: 'America/Nipigon', label: 'Nipigon' },
      { value: 'America/Nome', label: 'Nome' },
      { value: 'America/Noronha', label: 'Noronha' },
      { value: 'America/North_Dakota/Beulah', label: 'North Dakota - Beulah' },
      { value: 'America/North_Dakota/Center', label: 'North Dakota - Center' },
      {
        value: 'America/North_Dakota/New_Salem',
        label: 'North Dakota - New Salem',
      },
      { value: 'America/Ojinaga', label: 'Ojinaga' },
      { value: 'America/Panama', label: 'Panama' },
      { value: 'America/Pangnirtung', label: 'Pangnirtung' },
      { value: 'America/Paramaribo', label: 'Paramaribo' },
      { value: 'America/Phoenix', label: 'Phoenix' },
      { value: 'America/Port-au-Prince', label: 'Port-au-Prince' },
      { value: 'America/Port_of_Spain', label: 'Port of Spain' },
      { value: 'America/Porto_Velho', label: 'Porto Velho' },
      { value: 'America/Puerto_Rico', label: 'Puerto Rico' },
      { value: 'America/Punta_Arenas', label: 'Punta Arenas' },
      { value: 'America/Rainy_River', label: 'Rainy River' },
      { value: 'America/Rankin_Inlet', label: 'Rankin Inlet' },
      { value: 'America/Recife', label: 'Recife' },
      { value: 'America/Regina', label: 'Regina' },
      { value: 'America/Resolute', label: 'Resolute' },
      { value: 'America/Rio_Branco', label: 'Rio Branco' },
      { value: 'America/Santarem', label: 'Santarem' },
      { value: 'America/Santiago', label: 'Santiago' },
      { value: 'America/Santo_Domingo', label: 'Santo Domingo' },
      { value: 'America/Sao_Paulo', label: 'Sao Paulo' },
      { value: 'America/Scoresbysund', label: 'Scoresbysund' },
      { value: 'America/Sitka', label: 'Sitka' },
      { value: 'America/St_Barthelemy', label: 'St Barthelemy' },
      { value: 'America/St_Johns', label: 'St Johns' },
      { value: 'America/St_Kitts', label: 'St Kitts' },
      { value: 'America/St_Lucia', label: 'St Lucia' },
      { value: 'America/St_Thomas', label: 'St Thomas' },
      { value: 'America/St_Vincent', label: 'St Vincent' },
      { value: 'America/Swift_Current', label: 'Swift Current' },
      { value: 'America/Tegucigalpa', label: 'Tegucigalpa' },
      { value: 'America/Thule', label: 'Thule' },
      { value: 'America/Thunder_Bay', label: 'Thunder Bay' },
      { value: 'America/Tijuana', label: 'Tijuana' },
      { value: 'America/Toronto', label: 'Toronto' },
      { value: 'America/Tortola', label: 'Tortola' },
      { value: 'America/Vancouver', label: 'Vancouver' },
      { value: 'America/Whitehorse', label: 'Whitehorse' },
      { value: 'America/Winnipeg', label: 'Winnipeg' },
      { value: 'America/Yakutat', label: 'Yakutat' },
      { value: 'America/Yellowknife', label: 'Yellowknife' },
    ],
  },
  {
    label: 'Antarctica',
    options: [
      { value: 'Antarctica/Casey', label: 'Casey' },
      { value: 'Antarctica/Davis', label: 'Davis' },
      { value: 'Antarctica/DumontDUrville', label: 'DumontDUrville' },
      { value: 'Antarctica/Macquarie', label: 'Macquarie' },
      { value: 'Antarctica/Mawson', label: 'Mawson' },
      { value: 'Antarctica/McMurdo', label: 'McMurdo' },
      { value: 'Antarctica/Palmer', label: 'Palmer' },
      { value: 'Antarctica/Rothera', label: 'Rothera' },
      { value: 'Antarctica/Syowa', label: 'Syowa' },
      { value: 'Antarctica/Troll', label: 'Troll' },
      { value: 'Antarctica/Vostok', label: 'Vostok' },
    ],
  },
  {
    label: 'Arctic',
    options: [{ value: 'Arctic/Longyearbyen', label: 'Longyearbyen' }],
  },
  {
    label: 'Asia',
    options: [
      { value: 'Asia/Aden', label: 'Aden' },
      { value: 'Asia/Almaty', label: 'Almaty' },
      { value: 'Asia/Amman', label: 'Amman' },
      { value: 'Asia/Anadyr', label: 'Anadyr' },
      { value: 'Asia/Aqtau', label: 'Aqtau' },
      { value: 'Asia/Aqtobe', label: 'Aqtobe' },
      { value: 'Asia/Ashgabat', label: 'Ashgabat' },
      { value: 'Asia/Atyrau', label: 'Atyrau' },
      { value: 'Asia/Baghdad', label: 'Baghdad' },
      { value: 'Asia/Bahrain', label: 'Bahrain' },
      { value: 'Asia/Baku', label: 'Baku' },
      { value: 'Asia/Bangkok', label: 'Bangkok' },
      { value: 'Asia/Barnaul', label: 'Barnaul' },
      { value: 'Asia/Beirut', label: 'Beirut' },
      { value: 'Asia/Bishkek', label: 'Bishkek' },
      { value: 'Asia/Brunei', label: 'Brunei' },
      { value: 'Asia/Chita', label: 'Chita' },
      { value: 'Asia/Choibalsan', label: 'Choibalsan' },
      { value: 'Asia/Colombo', label: 'Colombo' },
      { value: 'Asia/Damascus', label: 'Damascus' },
      { value: 'Asia/Dhaka', label: 'Dhaka' },
      { value: 'Asia/Dili', label: 'Dili' },
      { value: 'Asia/Dubai', label: 'Dubai' },
      { value: 'Asia/Dushanbe', label: 'Dushanbe' },
      { value: 'Asia/Famagusta', label: 'Famagusta' },
      { value: 'Asia/Gaza', label: 'Gaza' },
      { value: 'Asia/Hebron', label: 'Hebron' },
      { value: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh' },
      { value: 'Asia/Hong_Kong', label: 'Hong Kong' },
      { value: 'Asia/Hovd', label: 'Hovd' },
      { value: 'Asia/Irkutsk', label: 'Irkutsk' },
      { value: 'Asia/Jakarta', label: 'Jakarta' },
      { value: 'Asia/Jayapura', label: 'Jayapura' },
      { value: 'Asia/Jerusalem', label: 'Jerusalem' },
      { value: 'Asia/Kabul', label: 'Kabul' },
      { value: 'Asia/Kamchatka', label: 'Kamchatka' },
      { value: 'Asia/Karachi', label: 'Karachi' },
      { value: 'Asia/Kathmandu', label: 'Kathmandu' },
      { value: 'Asia/Khandyga', label: 'Khandyga' },
      { value: 'Asia/Kolkata', label: 'Kolkata' },
      { value: 'Asia/Krasnoyarsk', label: 'Krasnoyarsk' },
      { value: 'Asia/Kuala_Lumpur', label: 'Kuala Lumpur' },
      { value: 'Asia/Kuching', label: 'Kuching' },
      { value: 'Asia/Kuwait', label: 'Kuwait' },
      { value: 'Asia/Macau', label: 'Macau' },
      { value: 'Asia/Magadan', label: 'Magadan' },
      { value: 'Asia/Makassar', label: 'Makassar' },
      { value: 'Asia/Manila', label: 'Manila' },
      { value: 'Asia/Muscat', label: 'Muscat' },
      { value: 'Asia/Nicosia', label: 'Nicosia' },
      { value: 'Asia/Novokuznetsk', label: 'Novokuznetsk' },
      { value: 'Asia/Novosibirsk', label: 'Novosibirsk' },
      { value: 'Asia/Omsk', label: 'Omsk' },
      { value: 'Asia/Oral', label: 'Oral' },
      { value: 'Asia/Phnom_Penh', label: 'Phnom Penh' },
      { value: 'Asia/Pontianak', label: 'Pontianak' },
      { value: 'Asia/Pyongyang', label: 'Pyongyang' },
      { value: 'Asia/Qatar', label: 'Qatar' },
      { value: 'Asia/Qostanay', label: 'Qostanay' },
      { value: 'Asia/Qyzylorda', label: 'Qyzylorda' },
      { value: 'Asia/Riyadh', label: 'Riyadh' },
      { value: 'Asia/Sakhalin', label: 'Sakhalin' },
      { value: 'Asia/Samarkand', label: 'Samarkand' },
      { value: 'Asia/Seoul', label: 'Seoul' },
      { value: 'Asia/Shanghai', label: 'Shanghai' },
      { value: 'Asia/Singapore', label: 'Singapore' },
      { value: 'Asia/Srednekolymsk', label: 'Srednekolymsk' },
      { value: 'Asia/Taipei', label: 'Taipei' },
      { value: 'Asia/Tashkent', label: 'Tashkent' },
      { value: 'Asia/Tbilisi', label: 'Tbilisi' },
      { value: 'Asia/Tehran', label: 'Tehran' },
      { value: 'Asia/Thimphu', label: 'Thimphu' },
      { value: 'Asia/Tokyo', label: 'Tokyo' },
      { value: 'Asia/Tomsk', label: 'Tomsk' },
      { value: 'Asia/Ulaanbaatar', label: 'Ulaanbaatar' },
      { value: 'Asia/Urumqi', label: 'Urumqi' },
      { value: 'Asia/Ust-Nera', label: 'Ust-Nera' },
      { value: 'Asia/Vientiane', label: 'Vientiane' },
      { value: 'Asia/Vladivostok', label: 'Vladivostok' },
      { value: 'Asia/Yakutsk', label: 'Yakutsk' },
      { value: 'Asia/Yangon', label: 'Yangon' },
      { value: 'Asia/Yekaterinburg', label: 'Yekaterinburg' },
      { value: 'Asia/Yerevan', label: 'Yerevan' },
    ],
  },
  {
    label: 'Atlantic',
    options: [
      { value: 'Atlantic/Azores', label: 'Azores' },
      { value: 'Atlantic/Bermuda', label: 'Bermuda' },
      { value: 'Atlantic/Canary', label: 'Canary' },
      { value: 'Atlantic/Cape_Verde', label: 'Cape Verde' },
      { value: 'Atlantic/Faroe', label: 'Faroe' },
      { value: 'Atlantic/Madeira', label: 'Madeira' },
      { value: 'Atlantic/Reykjavik', label: 'Reykjavik' },
      { value: 'Atlantic/South_Georgia', label: 'South Georgia' },
      { value: 'Atlantic/Stanley', label: 'Stanley' },
      { value: 'Atlantic/St_Helena', label: 'St Helena' },
    ],
  },
  {
    label: 'Australia',
    options: [
      { value: 'Australia/Adelaide', label: 'Adelaide' },
      { value: 'Australia/Brisbane', label: 'Brisbane' },
      { value: 'Australia/Broken_Hill', label: 'Broken Hill' },
      { value: 'Australia/Currie', label: 'Currie' },
      { value: 'Australia/Darwin', label: 'Darwin' },
      { value: 'Australia/Eucla', label: 'Eucla' },
      { value: 'Australia/Hobart', label: 'Hobart' },
      { value: 'Australia/Lindeman', label: 'Lindeman' },
      { value: 'Australia/Lord_Howe', label: 'Lord Howe' },
      { value: 'Australia/Melbourne', label: 'Melbourne' },
      { value: 'Australia/Perth', label: 'Perth' },
      { value: 'Australia/Sydney', label: 'Sydney' },
    ],
  },
  {
    label: 'Europe',
    options: [
      { value: 'Europe/Amsterdam', label: 'Amsterdam' },
      { value: 'Europe/Andorra', label: 'Andorra' },
      { value: 'Europe/Astrakhan', label: 'Astrakhan' },
      { value: 'Europe/Athens', label: 'Athens' },
      { value: 'Europe/Belgrade', label: 'Belgrade' },
      { value: 'Europe/Berlin', label: 'Berlin' },
      { value: 'Europe/Bratislava', label: 'Bratislava' },
      { value: 'Europe/Brussels', label: 'Brussels' },
      { value: 'Europe/Bucharest', label: 'Bucharest' },
      { value: 'Europe/Budapest', label: 'Budapest' },
      { value: 'Europe/Busingen', label: 'Busingen' },
      { value: 'Europe/Chisinau', label: 'Chisinau' },
      { value: 'Europe/Copenhagen', label: 'Copenhagen' },
      { value: 'Europe/Dublin', label: 'Dublin' },
      { value: 'Europe/Gibraltar', label: 'Gibraltar' },
      { value: 'Europe/Guernsey', label: 'Guernsey' },
      { value: 'Europe/Helsinki', label: 'Helsinki' },
      { value: 'Europe/Isle_of_Man', label: 'Isle of Man' },
      { value: 'Europe/Istanbul', label: 'Istanbul' },
      { value: 'Europe/Jersey', label: 'Jersey' },
      { value: 'Europe/Kaliningrad', label: 'Kaliningrad' },
      { value: 'Europe/Kiev', label: 'Kiev' },
      { value: 'Europe/Kirov', label: 'Kirov' },
      { value: 'Europe/Lisbon', label: 'Lisbon' },
      { value: 'Europe/Ljubljana', label: 'Ljubljana' },
      { value: 'Europe/London', label: 'London' },
      { value: 'Europe/Luxembourg', label: 'Luxembourg' },
      { value: 'Europe/Madrid', label: 'Madrid' },
      { value: 'Europe/Malta', label: 'Malta' },
      { value: 'Europe/Mariehamn', label: 'Mariehamn' },
      { value: 'Europe/Minsk', label: 'Minsk' },
      { value: 'Europe/Monaco', label: 'Monaco' },
      { value: 'Europe/Moscow', label: 'Moscow' },
      { value: 'Europe/Oslo', label: 'Oslo' },
      { value: 'Europe/Paris', label: 'Paris' },
      { value: 'Europe/Podgorica', label: 'Podgorica' },
      { value: 'Europe/Prague', label: 'Prague' },
      { value: 'Europe/Riga', label: 'Riga' },
      { value: 'Europe/Rome', label: 'Rome' },
      { value: 'Europe/Samara', label: 'Samara' },
      { value: 'Europe/San_Marino', label: 'San Marino' },
      { value: 'Europe/Sarajevo', label: 'Sarajevo' },
      { value: 'Europe/Saratov', label: 'Saratov' },
      { value: 'Europe/Simferopol', label: 'Simferopol' },
      { value: 'Europe/Skopje', label: 'Skopje' },
      { value: 'Europe/Sofia', label: 'Sofia' },
      { value: 'Europe/Stockholm', label: 'Stockholm' },
      { value: 'Europe/Tallinn', label: 'Tallinn' },
      { value: 'Europe/Tirane', label: 'Tirane' },
      { value: 'Europe/Ulyanovsk', label: 'Ulyanovsk' },
      { value: 'Europe/Uzhgorod', label: 'Uzhgorod' },
      { value: 'Europe/Vaduz', label: 'Vaduz' },
      { value: 'Europe/Vatican', label: 'Vatican' },
      { value: 'Europe/Vienna', label: 'Vienna' },
      { value: 'Europe/Vilnius', label: 'Vilnius' },
      { value: 'Europe/Volgograd', label: 'Volgograd' },
      { value: 'Europe/Warsaw', label: 'Warsaw' },
      { value: 'Europe/Zagreb', label: 'Zagreb' },
      { value: 'Europe/Zaporozhye', label: 'Zaporozhye' },
      { value: 'Europe/Zurich', label: 'Zurich' },
    ],
  },
  {
    label: 'Indian',
    options: [
      { value: 'Indian/Antananarivo', label: 'Antananarivo' },
      { value: 'Indian/Chagos', label: 'Chagos' },
      { value: 'Indian/Christmas', label: 'Christmas' },
      { value: 'Indian/Cocos', label: 'Cocos' },
      { value: 'Indian/Comoro', label: 'Comoro' },
      { value: 'Indian/Kerguelen', label: 'Kerguelen' },
      { value: 'Indian/Mahe', label: 'Mahe' },
      { value: 'Indian/Maldives', label: 'Maldives' },
      { value: 'Indian/Mauritius', label: 'Mauritius' },
      { value: 'Indian/Mayotte', label: 'Mayotte' },
      { value: 'Indian/Reunion', label: 'Reunion' },
    ],
  },
  {
    label: 'Pacific',
    options: [
      { value: 'Pacific/Apia', label: 'Apia' },
      { value: 'Pacific/Auckland', label: 'Auckland' },
      { value: 'Pacific/Bougainville', label: 'Bougainville' },
      { value: 'Pacific/Chatham', label: 'Chatham' },
      { value: 'Pacific/Chuuk', label: 'Chuuk' },
      { value: 'Pacific/Easter', label: 'Easter' },
      { value: 'Pacific/Efate', label: 'Efate' },
      { value: 'Pacific/Enderbury', label: 'Enderbury' },
      { value: 'Pacific/Fakaofo', label: 'Fakaofo' },
      { value: 'Pacific/Fiji', label: 'Fiji' },
      { value: 'Pacific/Funafuti', label: 'Funafuti' },

      { value: 'Pacific/Galapagos', label: 'Galapagos' },
      { value: 'Pacific/Gambier', label: 'Gambier' },
      { value: 'Pacific/Guadalcanal', label: 'Guadalcanal' },
      { value: 'Pacific/Guam', label: 'Guam' },
      { value: 'Pacific/Honolulu', label: 'Honolulu' },
      { value: 'Pacific/Kiritimati', label: 'Kiritimati' },
      { value: 'Pacific/Kosrae', label: 'Kosrae' },
      { value: 'Pacific/Kwajalein', label: 'Kwajalein' },
      { value: 'Pacific/Majuro', label: 'Majuro' },
      { value: 'Pacific/Marquesas', label: 'Marquesas' },
      { value: 'Pacific/Midway', label: 'Midway' },
      { value: 'Pacific/Nauru', label: 'Nauru' },
      { value: 'Pacific/Niue', label: 'Niue' },
      { value: 'Pacific/Norfolk', label: 'Norfolk' },
      { value: 'Pacific/Noumea', label: 'Noumea' },
      { value: 'Pacific/Pago_Pago', label: 'Pago Pago' },
      { value: 'Pacific/Palau', label: 'Palau' },
      { value: 'Pacific/Pitcairn', label: 'Pitcairn' },
      { value: 'Pacific/Pohnpei', label: 'Pohnpei' },
      { value: 'Pacific/Port_Moresby', label: 'Port Moresby' },
      { value: 'Pacific/Rarotonga', label: 'Rarotonga' },
      { value: 'Pacific/Saipan', label: 'Saipan' },
      { value: 'Pacific/Tahiti', label: 'Tahiti' },
      { value: 'Pacific/Tarawa', label: 'Tarawa' },
      { value: 'Pacific/Tongatapu', label: 'Tongatapu' },
      { value: 'Pacific/Wake', label: 'Wake' },
      { value: 'Pacific/Wallis', label: 'Wallis' },
    ],
  },

  {
    label: 'UTC',
    options: [{ value: 'UTC', label: 'UTC' }],
  },
];
export const DEFAULT_TIMEZONE = 'UTC';

export const TIMELINE_NORMAL_ACTIVITY_TYPE = [
  'undeleted',
  'deleted',
  'downvote',
  'upvote',
  'reopened',
  'closed',
  'pin',
  'unpin',
  'show',
  'hide',
];

export const SYSTEM_AVATAR_OPTIONS = [
  {
    label: 'System',
    value: 'system',
  },
  {
    label: 'Gravatar',
    value: 'gravatar',
  },
];

export const TAG_SLUG_NAME_MAX_LENGTH = 35;

export enum ContentType {
  NONE,
  QUESTION,
  ARTICLE,
  ASSETBUN,
  BOUNTY,
  AIPIC,
}

export const QueryContentTypeFromStr = {
  questions: ContentType.QUESTION,
  articles: ContentType.ARTICLE,
  assetbuns: ContentType.ASSETBUN,
  bounties: ContentType.BOUNTY,
};

export const assetBunName = '资产包子云盘';

export enum PageType {
  ASSETBUN = 1,
  ANSWER = 2,
}
export const assetBunSearch = `page_type=${PageType.ASSETBUN}`;
export const assetBunPolicyUrl = 'https://assetbun.com/policy/';
export const assetBunPrivateUrl = 'https://assetbun.com/privacy/';
export const shareLocalStorageDomains = ['localhost', 'learnearn.cn'];
export const targetLocalStorageDomains = ['localhost', 'cloud.assetbun.com'];
export const targetLocalStorageUrl = [
  'http://localhost:5212/share.html',
  'https://cloud.assetbun.com/share.html',
];
export const targetAssetBunHomeUrl = [
  'http://localhost:5212/home',
  'https://cloud.assetbun.com/home',
];
export const targetAssetBunRootUrl = [
  'http://localhost:5212',
  'https://cloud.assetbun.com',
];
export const PayContentType = [
  ContentType.QUESTION,
  ContentType.BOUNTY,
  ContentType.ASSETBUN,
];

export function getUrlQueryParam(key: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}

export function getUrlQuestionType(key: string = 'content_type'): number {
  const param = getUrlQueryParam(key);
  return param ? parseInt(param, 10) : ContentType.QUESTION;
}

// 由提出问题的人已经做出了付款操作类型的帖子，让别人付款查看的类型不属于该帖子
export function hasPayType(ct: number = -1): boolean {
  const contentType = ct === -1 ? getUrlQuestionType() : ct;
  return PayContentType.indexOf(contentType) !== -1;
}

export function isModerator(question, userInfo): boolean {
  const questionUserId = question.user_id;

  // 别用user_info,有可能是最后回复者的id
  // if (!questionUserId && question.user_info) {
  //   questionUserId = question.user_info.id;
  // }
  const isAuthor = userInfo?.id === questionUserId;
  const isAdmin = userInfo?.role_id === 2;
  const moderator = userInfo?.role_id === 3;
  return isAuthor || isAdmin || moderator;
}

export function isVIP(user): boolean {
  if (!user || !user.group_info) {
    return false;
  }
  const groupInfo = user.group_info;
  return groupInfo.Name !== 'Admin' && groupInfo.Name !== 'User';
}

// export function openModal(title, content, confirmText, confirmCallback): void {
//   Modal.confirm({
//     title,
//     content,
//     cancelBtnVariant: 'link',
//     confirmBtnVariant: 'danger',
//     confirmText,
//     onConfirm: () => {
//       confirmCallback();
//     },
//   });
// }
