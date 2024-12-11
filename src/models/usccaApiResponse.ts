export type UsccaApiElementResponse<T> = {
  data: {
    type: string,
    id: string,
    attributes: T
  }
};

export type UsccaApiCollectionResponse<T> = {
  data: {
    type: string,
    id: string,
    attributes: T
  }[]
};
