# project

## api

- 列表

```ts
// https://www.someacg.top/api/list?page={?}
interface TApiListItem {
  file_name: string;
  index: number;
  quality: boolean;
  size: {
    width: number;
    height: number;
    // 6787add0e9c63ef49a25c6b0
    _id: number;
  };
  // 6787add0e9c63ef49a25c6af
  _id: string;
}
```

- 资源

```ts
// https://cdn.someacg.top/graph/thumb/120337128_p0_scale.png
// https://cdn.someacg.top/graph/origin/120337128_p0_scale.png
```