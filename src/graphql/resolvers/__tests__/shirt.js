const resolvers = require('../shirt');

describe('[Shirt.team]', () => {
  const mockContext = {
    loaders: {
      teamsLoader: { load: jest.fn() },
    },
  };

  const { load } = mockContext.loaders.teamsLoader;
  const { team } = resolvers.Shirt;

  it('gets a team by id', async () => {
    const mockParent = {
      team: { _id: '123' },
    };

    load.mockReturnValueOnce({ name: 'Santos' });
    const res = await team(mockParent, null, mockContext);

    expect(res).toEqual({ name: 'Santos' });
  });

  it('throws an error if id is not passed', async () => {
    const mockParent = {
      team: { _id: undefined },
    };

    await expect(team(mockParent, null, mockContext)).rejects.toThrow(
      'O campo ID é obrigatório',
    );
  });

  it('throws an error if no team has been found', async () => {
    const mockParent = {
      team: { _id: '123' },
    };

    await expect(team(mockParent, null, mockContext)).rejects.toThrow(
      'Nenhum time foi encontrado',
    );
  });
});
