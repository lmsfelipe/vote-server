const resolvers = require('../shirt');

describe('[Query.shirts]', () => {
  const mockContext = {
    models: {
      Shirt: { find: jest.fn() },
    },
  };

  const { find } = mockContext.models.Shirt;
  const { shirts } = resolvers.Query;

  it('gets all shirts from context models', async () => {
    find.mockReturnValueOnce([{ name: 'Camisa 1' }]);

    const res = await shirts(null, null, mockContext);
    expect(res).toEqual([{ name: 'Camisa 1' }]);
  });

  it('returns empty array when response is null', async () => {
    find.mockReturnValueOnce(null);

    const res = await shirts(null, null, mockContext);
    expect(res).toEqual([]);
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
