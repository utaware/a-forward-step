export interface IRoleDataItem {
  id: string
  name: string
  nickname: string
  category: string
  gender: string
  giftGreen: string
  giftBlue: string
  giftPurple: string
  affiliation: string
  event: string
  potential: string
  onlineTime: string
  birthday: string
  birthdayMonth: string
  roleImgSrc: string
}

export interface IRoleDataOption {
  key: keyof IRoleDataItem
  type: number
  label: string
}

export const roleDataOptions: IRoleDataOption[] = [
  {
    key: 'id',
    type: 1,
    label: '编号',
  },
  {
    key: 'name',
    type: 2,
    label: '角色名',
  },
  {
    key: 'nickname',
    type: 3,
    label: '昵称',
  },
  {
    key: 'category',
    type: 4,
    label: '分类',
  },
  {
    key: 'gender',
    type: 5,
    label: '性别',
  },
  {
    key: 'giftGreen',
    type: 6,
    label: '礼物-绿色',
  },
  {
    key: 'giftBlue',
    type: 7,
    label: '礼物-蓝色',
  },
  {
    key: 'giftPurple',
    type: 8,
    label: '礼物-紫色',
  },
  {
    key: 'affiliation',
    type: 9,
    label: '从属',
  },
  {
    key: 'event',
    type: 10,
    label: '事件经历',
  },
  {
    key: 'potential',
    type: 11,
    label: '潜能激发',
  },
  {
    key: 'onlineTime',
    type: 12,
    label: '上线时间',
  },
  {
    key: 'birthday',
    type: 13,
    label: '生日',
  },
  {
    key: 'birthdayMonth',
    type: 14,
    label: '生日-月份',
  },
]

// Map of role data options keyed by their type property
export const roleDataOptionsMap = roleDataOptions.reduce<{
  [key: string]: IRoleDataOption
}>((total, option) => {
  const { type } = option
  total[type] = option
  return total
}, {})
