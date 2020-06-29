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

  it('returns a list of teams', async () => {
    find.mockReturnValueOnce([{ name: 'Santos FC' }]);

    const res = await teams(null, null, mockContext);

    expect(res).toEqual([{ name: 'Santos FC' }]);
  });

  it('returns empty array if response is null', async () => {
    find.mockReturnValueOnce(null);

    const res = await teams(null, null, mockContext);
    expect(res).toEqual([]);
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
