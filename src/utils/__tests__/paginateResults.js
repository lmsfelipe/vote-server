const paginateResults = require('../paginateResults');

describe('PaginateResults', () => {
  it('returns cursor pagination', () => {
    const dataMock = [
      { name: 'Camisa 1', _id: '11aa22bb' },
      { name: 'Camisa 2', _id: '22aa22bb' },
      { name: 'Camisa 3', _id: '33aa22bb' },
    ];

    const paginatedMock = {
      pageInfo: {
        endCursor: '22aa22bb',
        hasNextPage: true,
      },
      edges: [
        {
          cursor: '11aa22bb',
          node: { name: 'Camisa 1', _id: '11aa22bb' },
        },
        {
          cursor: '22aa22bb',
          node: { name: 'Camisa 2', _id: '22aa22bb' },
        },
      ],
    };

    const resp = paginateResults(2, dataMock);
    expect(resp).toEqual(paginatedMock);
  });

  it('returns hasNextPage false when there is no more data to load', () => {
    const dataMock = [
      { name: 'Camisa 1', _id: '11aa22bb' },
      { name: 'Camisa 2', _id: '22aa22bb' },
    ];

    const paginatedMock = {
      pageInfo: {
        endCursor: '22aa22bb',
        hasNextPage: false,
      },
      edges: [
        {
          cursor: '11aa22bb',
          node: { name: 'Camisa 1', _id: '11aa22bb' },
        },
        {
          cursor: '22aa22bb',
          node: { name: 'Camisa 2', _id: '22aa22bb' },
        },
      ],
    };

    const resp = paginateResults(2, dataMock);
    expect(resp).toEqual(paginatedMock);
  });
});
