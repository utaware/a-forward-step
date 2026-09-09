export interface IRoleDataOption {
  key: string
  value: number
  label: string
}

export const roleDataOptions: IRoleDataOption[] = [
  {
    key: 'id',
    value: 1,
    label: '编号',
  },
  {
    key: 'name',
    value: 2,
    label: '角色名',
  },
  {
    key: 'nickname',
    value: 3,
    label: '昵称',
  },
  {
    key: 'type',
    value: 4,
    label: '类别',
  },
  {
    key: 'gender',
    value: 5,
    label: '性别',
  },
  {
    key: 'gift-green',
    value: 6,
    label: '礼物-绿色',
  },
  {
    key: 'gift-blue',
    value: 7,
    label: '礼物-蓝色',
  },
  {
    key: 'gift-purple',
    value: 8,
    label: '礼物-紫色',
  },
  {
    key: 'affiliation',
    value: 9,
    label: '从属',
  },
  {
    key: 'event',
    value: 10,
    label: '事件经历',
  },
  {
    key: 'potential',
    value: 11,
    label: '潜能激发',
  },
  {
    key: 'sort-time',
    value: 12,
    label: '排序-上线时间',
  },
  {
    key: 'birthday',
    value: 13,
    label: '生日',
  },
  {
    key: 'sort-birthday',
    value: 14,
    label: '生日-月份',
  },
]

// Map of role data options keyed by their value property
export const roleDataOptionsMap = roleDataOptions.reduce<{
  [key: string]: IRoleDataOption
}>((total, option) => {
  const { value } = option
  total[value] = option
  return total
}, {})
