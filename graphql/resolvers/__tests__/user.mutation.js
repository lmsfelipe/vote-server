const resolvers = require('../user');
const mongoMemoryServer = require('../../../utils/mongo-memory-server');
const models = require('../../../models');

const { createUser, editUser } = resolvers.Mutation;

const mockInputs = {
  userInput: {
    name: 'Felipe',
    email: 'felipe@email.com',
    password: '12345',
  },
  id: '123',
};

describe('[Mutation.createUser]', () => {
  const mockContext = {
    models: {
      User: models.User,
    },
  };

  beforeAll(async () => {
    await mongoMemoryServer.connect();
  });

  afterAll(async (done) => {
    await mongoMemoryServer.disconnect();
    done();
  });

  it('creates a new user', async (done) => {
    const res = await createUser(null, mockInputs, mockContext);

    expect(res._id).toBeDefined();
    expect(res.name).toBe('Felipe');
    expect(res.password).not.toBe('12345');
    done();
  });

  it('fails when some field is missing', async (done) => {
    mockInputs.userInput.name = '';

    await expect(createUser(null, mockInputs, mockContext)).rejects.toThrow(
      'Por favor, verifique os campos preenchidos.',
    );
    done();
  });

  it('throws an error if email is alredy in use', async (done) => {
    mockInputs.userInput.name = 'Felipe';
    mockContext.models.User.findOne = jest.fn();
    mockContext.models.User.findOne.mockReturnValueOnce(true);

    await expect(createUser(null, mockInputs, mockContext)).rejects.toThrow(
      'Esse e-mail já está em uso.',
    );
    done();
  });
});

describe('[Mutation.editUser]', () => {
  const mockContext = {
    authScope: {
      isAuth: true,
    },
    models: {
      User: { findByIdAndUpdate: jest.fn() },
    },
  };

  const { findByIdAndUpdate } = mockContext.models.User;

  it('edits user data', async () => {
    findByIdAndUpdate.mockReturnValueOnce({ name: 'João' });
    const res = await editUser(null, mockInputs, mockContext);

    expect(res).toStrictEqual({ name: 'João' });
  });

  it('should throw an error when user couldnt be edited', async () => {
    await expect(editUser(null, mockInputs, mockContext)).rejects.toThrow(
      'Não foi possível editar o usuário.',
    );
  });

  it('should throw an error when id is not defined', async () => {
    delete mockInputs.id;
    await expect(editUser(null, mockInputs, mockContext)).rejects.toThrow(
      'Id é obrigatório.',
    );
  });

  it('should return a authorization error', async (done) => {
    mockContext.authScope.isAuth = false;

    await expect(editUser(null, mockInputs, mockContext)).rejects.toThrow(
      'Usuário não autenticado.',
    );
    done();
  });
});
