const resolvers = require('../shirt');
const models = require('../../../models');
const mongooseMemoryServer = require('../../../utils/mongo-memory-server');

const { createShirt, editShirt, deleteShirt } = resolvers.Mutation;

const mockInputs = {
  id: '123',
  shirtInput: {
    name: 'camisa 3',
    slug: 'camisa-3',
    mainImage: 'https://saopaulo.com.br/image2.jpg',
    year: 2010,
    brand: 'adidas',
    images: [
      {
        url: 'https://google.com.br',
        name: 'Imagem 2',
      },
    ],
    teamId: '5ed2718963cb6200401963c6',
  },
};

describe('[Mutation.createShirt]', () => {
  const mockContext = {
    authScope: {
      isAuth: true,
      role: 'admin',
    },
    models: {
      Shirt: models.Shirt,
    },
  };

  beforeAll(async () => {
    await mongooseMemoryServer.connect();
  });

  afterAll(async (done) => {
    await mongooseMemoryServer.disconnect();
    done();
  });

  it('creates a new shirt', async (done) => {
    const res = await createShirt(null, mockInputs, mockContext);

    expect(res._id).toBeDefined();
    expect(res.name).toBe(mockInputs.shirtInput.name);
    done();
  });

  it('fails when some field is missing', async (done) => {
    delete mockInputs.shirtInput.name;

    await expect(createShirt(null, mockInputs, mockContext)).rejects.toThrow(
      'Houve um erro em um dos campos',
    );
    done();
  });

  it('should return a permission error', async (done) => {
    mockContext.authScope.role = 'user';

    await expect(createShirt(null, mockInputs, mockContext)).rejects.toThrow(
      'Usuário sem permissão.',
    );
    done();
  });

  it('should return a authorization error', async (done) => {
    mockContext.authScope.isAuth = false;

    await expect(createShirt(null, mockInputs, mockContext)).rejects.toThrow(
      'Usuário não autenticado.',
    );
    done();
  });
});

describe('[Mutation.editShirt]', () => {
  const mockContext = {
    authScope: {
      isAuth: true,
      role: 'admin',
    },
    models: {
      Shirt: { findByIdAndUpdate: jest.fn() },
    },
  };

  const { findByIdAndUpdate } = mockContext.models.Shirt;

  it('edits shirt data', async () => {
    findByIdAndUpdate.mockReturnValueOnce({ name: 'Camisa 1' });
    const res = await editShirt(null, mockInputs, mockContext);

    expect(res).toStrictEqual({ name: 'Camisa 1' });
  });

  it('should throw an error when team couldnt be edited', async () => {
    await expect(editShirt(null, mockInputs, mockContext)).rejects.toThrow(
      'Não foi possível editar a camisa.',
    );
  });

  it('should throw an error when id is not defined', async () => {
    delete mockInputs.id;
    await expect(editShirt(null, mockInputs, mockContext)).rejects.toThrow(
      'Id é obrigatório.',
    );
  });

  it('should return a permission error', async (done) => {
    mockContext.authScope.role = 'user';

    await expect(editShirt(null, mockInputs, mockContext)).rejects.toThrow(
      'Usuário sem permissão.',
    );
    done();
  });

  it('should return a authorization error', async (done) => {
    mockContext.authScope.isAuth = false;

    await expect(editShirt(null, mockInputs, mockContext)).rejects.toThrow(
      'Usuário não autenticado.',
    );
    done();
  });
});

describe('[Mutation.deleteShirt]', () => {
  const mockContext = {
    authScope: {
      isAuth: true,
      role: 'admin',
    },
    models: {
      Shirt: { findByIdAndDelete: jest.fn() },
    },
  };

  const { findByIdAndDelete } = mockContext.models.Shirt;

  it('deletes a shirt from an id', async () => {
    findByIdAndDelete.mockReturnValueOnce({ name: 'Camisa 1' });
    const res = await deleteShirt(null, { id: '123' }, mockContext);

    expect(res).toStrictEqual({ name: 'Camisa 1' });
  });

  it('throw an error if something faild', async () => {
    findByIdAndDelete.mockReturnValueOnce(null);

    await expect(deleteShirt(null, { id: '123' }, mockContext)).rejects.toThrow(
      'Não foi possível remover a camisa.',
    );
  });

  it('should throw an error when id is not defined', async () => {
    await expect(
      deleteShirt(null, { id: undefined }, mockContext),
    ).rejects.toThrow('Id é obrigatório.');
  });

  it('should return a permission error', async (done) => {
    mockContext.authScope.role = 'user';

    await expect(deleteShirt(null, { id: '123' }, mockContext)).rejects.toThrow(
      'Usuário sem permissão.',
    );
    done();
  });

  it('should return a authorization error', async (done) => {
    mockContext.authScope.isAuth = false;

    await expect(deleteShirt(null, { id: '123' }, mockContext)).rejects.toThrow(
      'Usuário não autenticado.',
    );
    done();
  });
});
