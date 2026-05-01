export const FIELDS = [
  'Наклейка ДИТ', 'Доменное имя', 'MAC адрес', 'IP адрес', 'Локация',
  'Здание, кабинет', 'Департамент', 'ФИО пользователя', 'Логин пользователя',
  'Версия Windows', 'Ключ Windows', 'Версия Office', 'Ключ Office',
  '1С', 'Е1', 'Content Reader', 'Acrobat', 'Характеристика', 'Партийный номер',
  'Серийный номер', 'Монитор', 'Монитор 2', 'IP-телефон', 'Другое оборудование',
  'Примечание', 'Обновление WIN7',
]

export const CHECKBOX_FIELDS = ['1С', 'Е1', 'Content Reader', 'Acrobat', 'Обновление WIN7']

export const SOFT_INDICATORS = ['1С', 'Е1', 'Content Reader', 'Acrobat']

export const DEPT_PALETTE = [
  '#42b883', '#7B1FA2', '#00897B', '#43A047', '#F9A825',
  '#E64A19', '#C2185B', '#5E35B1', '#0097A7', '#558B2F',
  '#F57C00', '#D32F2F', '#455A64', '#795548',
]

export const UNASSIGNED = '— Без отдела'

export const TAB_GROUPS = [
  {
    id: 'user',
    label: 'Пользователь',
    fields: ['ФИО пользователя', 'Логин пользователя', 'Локация', 'Здание, кабинет', 'Департамент'],
  },
  {
    id: 'pc',
    label: 'Компьютер',
    fields: ['Наклейка ДИТ', 'Доменное имя', 'MAC адрес', 'IP адрес', 'Характеристика', 'Партийный номер', 'Серийный номер', 'Монитор', 'Монитор 2'],
  },
  {
    id: 'soft',
    label: 'ПО и железо',
    fields: ['Версия Windows', 'Ключ Windows', 'Версия Office', 'Ключ Office', '1С', 'Е1', 'Content Reader', 'Acrobat', 'IP-телефон', 'Другое оборудование', 'Примечание', 'Обновление WIN7'],
  },
]

export const LS_KEY = 'it_registry_v1'
