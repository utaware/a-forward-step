interface ISegments {
  uri: string
  duration: number
}

interface Manifest {
  segments: ISegments[]
}

interface ITSFile extends ISegments {
  tsFileName: string
  tsFileUrl: string
}

declare module 'm3u8-parser' {

  export class Parser {

    manifest: Manifest

    push: (data: string) => void
    end: () => void
  }
}
