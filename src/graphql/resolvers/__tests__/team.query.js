const resolvers = require('../team');

const { teams, teamById } = resolvers.Query;

const mockContext = {
  models: {
    Team: { find: jest.fn() },
  },
  loaders: {
    teamsLoader: { load: jest.fn() },
  },
};

describe('[Query.teams]', () => {
  const { find } = mockContext.models.Team;

  it('gets paginated teams', async () => {
    const responseMock = [
      { name: 'Santos', _id: '11aa22bb' },
      { name: 'São Paulo', _id: '22aa22bb' },
      { name: 'Palmeiras', _id: '33aa22bb' },
    ];
    const paginatedMock = {
      pageInfo: {
        endCursor: '22aa22bb',
        hasNextPage: true,
      },
      edges: [
        {
          cursor: '11aa22bb',
          node: { name: 'Santos', _id: '11aa22bb' },
        },
        {
          cursor: '22aa22bb',
          node: { name: 'São Paulo', _id: '22aa22bb' },
        },
      ],
    };

    find.mockReturnValueOnce({
      limit: () => ({
        lean: () => responseMock,
      }),
    });

    const res = await teams(null, { first: 2 }, mockContext);
    expect(res).toEqual(paginatedMock);
  });

  it('throws an error when wasnt possible to fetch teams', async () => {
    find.mockReturnValueOnce({
      limit: () => ({
        lean: () => null,
      }),
    });

    await expect(teams(null, {}, mockContext)).rejects.toThrow();
  });
});

describe('[Query.teamById', () => {
  const { load } = mockContext.loaders.teamsLoader;

  it('returns a team from id', async () => {
    load.mockReturnValueOnce({ name: 'Santos FC' });

    const res = await teamById(null, { id: '123' }, mockContext);
    expect(res).toEqual({ name: 'Santos FC' });
  });

  it('throws an error if id is not defined', async () => {
    await expect(
      teamById(null, { id: undefined }, mockContext),
    ).rejects.toThrow('O campo ID é obrigatório');
  });

  it('throws an error if no team has been found', async () => {
    load.mockReturnValueOnce(undefined);

    await expect(teamById(null, { id: '123' }, mockContext)).rejects.toThrow(
      'Nenhum time foi encontrado',
    );
  });
});
