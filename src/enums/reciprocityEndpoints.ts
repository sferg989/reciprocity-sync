export enum ReciprocityEndpoints {
  GetAllStates = 'https://reciprocity.uscca.cloud/states',
  ChangeLogForState = 'https://reciprocity.uscca.cloud/states/:id/changelog',
  UpdateChangeLogEntry = 'https://reciprocity.uscca.cloud/changelog/:id'
}

export enum EndpointParams {
  Id = ':id'
}
