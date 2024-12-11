# The Plan

## Reciprocity Endpoints

- States
  1. Get the current data to use as an "Oracle"
    - GET https://reciprocity.uscca.cloud/states/540c2d5e-f09f-11eb-9c9f-0242ac110002/permit-info
    - GET https://reciprocity.uscca.cloud/states/540c2d5e-f09f-11eb-9c9f-0242ac110002/carry-basics
    - GET https://reciprocity.uscca.cloud/states/540c2d5e-f09f-11eb-9c9f-0242ac110002/carry-locations
- Changelog
  1. Get the current data to use as an "Oracle"
  ```http
  GET https://reciprocity.uscca.cloud/changelog/9ad0a306-41a2-11ec-9fe9-02420a0001c9
  Accept: application/json
  Content-Type: application/json
  X-Api-Token: {token}
  ```
  ```json
  {
    "data": {
      "type": "changelog",
      "id": "9ad0a306-41a2-11ec-9fe9-02420a0001c9",
      "attributes": {
        "date": "2020-09-03",
        "summary": "Added information on Self Defense in the Summary"
      }
    }
  }
  ```
  2. Get data from current page and map to
      - summary
  3. Execute patch to update changelog
  ```http
  PATCH https://reciprocity.uscca.cloud/changelog/9ad0a306-41a2-11ec-9fe9-02420a0001c9
  Accept: application/json
  Content-Type: application/json
  X-Api-Token: {token}

  {
    "summary": "Added information on Self Defense in the Summary"
  }
  ```
    - might need to POST here: `https://reciprocity.uscca.cloud/states/:id/changelog` if it's a new changelog
- Links
  - todo
- Reciprocity
  - todo
- Content
  - todo

~~- Permits~~

~~- Users~~
