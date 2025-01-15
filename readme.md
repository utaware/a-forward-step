# project

## api

- list

```ts
// https://www.someacg.top/api/list?page={?}
interface TApiListItem {
  // 120337128_p0_scale.png
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

- image

```ts
// https://cdn.someacg.top/graph/thumb/120337128_p0_scale.png 500kb
// https://cdn.someacg.top/graph/origin/120337128_p0_scale.png 4.5mb
```

- detail

```ts
// https://www.someacg.top/detail/6787add0e9c63ef49a25c6af
```