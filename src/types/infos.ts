export interface IAnimeSrouce {
  href: string
  text: string
}

export interface IAnimeVersion {
  name: string
  resouce: IAnimeSrouce[]
}

export interface IAnimePageInfos {
  title: string
  introduce: string
  remarks: string[]
  tags: string[]
  versions: string[]
  anime: IAnimeVersion[]
}
