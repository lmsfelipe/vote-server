const resolvers = require('../shirt');

describe('[Query.shirts]', () => {
  const mockContext = {
    models: {
      Shirt: { find: jest.fn() },
    },
  };

  const { find } = mockContext.models.Shirt;
  const { shirts } = resolvers.Query;

  it('gets paginated shirts', async () => {
    const responseMock = [
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

    find.mockReturnValueOnce({
      limit: () => ({
        lean: () => responseMock,
      }),
    });

    const res = await shirts(null, { first: 2 }, mockContext);
    expect(res).toEqual(paginatedMock);
  });

  it('throws an error when wasnt possible to fetch shirts', async () => {
    find.mockReturnValueOnce({
      limit: () => ({
        lean: () => null,
      }),
    });

    await expect(shirts(null, {}, mockContext)).rejects.toThrow();
  });
});

describe('[Query.shirtById]', () => {
  const mockContext = {
    loaders: {
      shirtsLoader: { load: jest.fn() },
    },
  };

  const { load } = mockContext.loaders.shirtsLoader;
  const { shirtById } = resolvers.Query;

  it('gets a shirt by id', async () => {
    load.mockReturnValueOnce({ name: 'Camisa 1' });

    const res = await shirtById(null, { id: 1 }, mockContext);
    expect(res).toEqual({ name: 'Camisa 1' });
  });

  it('throws an error if id is not passed', async () => {
    await expect(shirtById(null, { id: '' }, mockContext)).rejects.toThrow(
      'O campo ID é obrigatório',
    );
  });

  it('throws an erro if no shirt has been found', async () => {
    load.mockReturnValueOnce(undefined);

    await expect(shirtById(null, { id: '123' }, mockContext)).rejects.toThrow(
      'Nenhuma camisa foi encontrada',
    );
  });
});
