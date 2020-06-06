const resolvers = require('../resolvers');

describe('[Query.teams]', () => {
  const mockContext = {
    models: {
      Team: { find: jest.fn() },
    },
  };

  const { find } = mockContext.models.Team;

  it('returns a list of teams', async () => {
    const { teams } = resolvers.Query;
    find.mockReturnValueOnce({ name: 'Santos FC' });

    const res = await teams(null, null, mockContext);

    expect(res).toEqual({ name: 'Santos FC' });
  });
});
