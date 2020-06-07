const resolvers = require('../resolvers');
const mongoMemoryServer = require('../../../utils/mongo-memory-server');
const models = require('../../../models');

const { createTeam, editTeam, deleteTeam } = resolvers.Mutation;

const mockInputs = {
  teamInput: {
    name: 'Santos FC',
    slug: 'santos-fc',
    image: 'https://gremio.com.br/image.jpg',
  },
  id: '123',
};

describe('[Mutation.createTeam]', () => {
  const mockContext = {
    authScope: {
      isAuth: true,
      role: 'admin',
    },
    models: {
      Team: models.Team,
    },
  };

  beforeAll(async () => {
    await mongoMemoryServer.connect();
  });

  afterAll(async (done) => {
    await mongoMemoryServer.disconnect();
    done();
  });

  it('creates a new team', async (done) => {
    const res = await createTeam(null, mockInputs, mockContext);

    expect(res._id).toBeDefined();
    expect(res.name).toBe('Santos FC');
    done();
  });

  it('fails when some field is missing', async (done) => {
    delete mockInputs.teamInput.name;

    await expect(createTeam(null, mockInputs, mockContext)).rejects.toThrow(
      'Houve um erro em um dos campos',
    );
    done();
  });

  it('should return a permission error', async (done) => {
    mockContext.authScope.role = 'user';

    await expect(createTeam(null, mockInputs, mockContext)).rejects.toThrow(
      'Usuário sem permissão.',
    );
    done();
  });

  it('should return a authorization error', async (done) => {
    mockContext.authScope.isAuth = false;

    await expect(createTeam(null, mockInputs, mockContext)).rejects.toThrow(
      'Usuário não autenticado.',
    );
    done();
  });
});

describe('[Mutation.editTeam]', () => {
  const mockContext = {
    authScope: {
      isAuth: true,
      role: 'admin',
    },
    models: {
      Team: { findByIdAndUpdate: jest.fn() },
    },
  };

  const { findByIdAndUpdate } = mockContext.models.Team;

  it('edits team data', async () => {
    findByIdAndUpdate.mockReturnValueOnce({ name: 'Camisa 1' });
    const res = await editTeam(null, mockInputs, mockContext);

    expect(res).toStrictEqual({ name: 'Camisa 1' });
  });

  it('should throw an error when team couldnt be edited', async () => {
    await expect(editTeam(null, mockInputs, mockContext)).rejects.toThrow(
      'Não foi possível editar o time.',
    );
  });

  it('should throw an error when id is not defined', async () => {
    delete mockInputs.id;
    await expect(editTeam(null, mockInputs, mockContext)).rejects.toThrow(
      'Id é obrigatório.',
    );
  });

  it('should return a permission error', async (done) => {
    mockContext.authScope.role = 'user';

    await expect(editTeam(null, mockInputs, mockContext)).rejects.toThrow(
      'Usuário sem permissão.',
    );
    done();
  });

  it('should return a authorization error', async (done) => {
    mockContext.authScope.isAuth = false;

    await expect(editTeam(null, mockInputs, mockContext)).rejects.toThrow(
      'Usuário não autenticado.',
    );
    done();
  });
});

describe('[Mutation.deleteTeam]', () => {
  const mockContext = {
    authScope: {
      isAuth: true,
      role: 'admin',
    },
    models: {
      Team: { findByIdAndDelete: jest.fn() },
    },
  };

  const { findByIdAndDelete } = mockContext.models.Team;

  it('deletes a team from an id', async () => {
    findByIdAndDelete.mockReturnValueOnce({ name: 'Camisa 1' });
    const res = await deleteTeam(null, { id: '123' }, mockContext);

    expect(res).toStrictEqual({ name: 'Camisa 1' });
  });

  it('throw an error if something failed', async () => {
    findByIdAndDelete.mockReturnValueOnce(null);

    await expect(deleteTeam(null, { id: '123' }, mockContext)).rejects.toThrow(
      'Não foi possível remover o time.',
    );
  });

  it('should throw an error when id is not defined', async () => {
    await expect(
      deleteTeam(null, { id: undefined }, mockContext),
    ).rejects.toThrow('Id é obrigatório.');
  });

  it('should return a permission error', async (done) => {
    mockContext.authScope.role = 'user';

    await expect(deleteTeam(null, { id: '123' }, mockContext)).rejects.toThrow(
      'Usuário sem permissão.',
    );
    done();
  });

  it('should return a authorization error', async (done) => {
    mockContext.authScope.isAuth = false;

    await expect(deleteTeam(null, { id: '123' }, mockContext)).rejects.toThrow(
      'Usuário não autenticado.',
    );
    done();
  });
});
