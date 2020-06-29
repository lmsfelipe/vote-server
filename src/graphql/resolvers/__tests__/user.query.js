const bcrypt = require('bcryptjs');

const resolvers = require('../user');

const { login } = resolvers.Query;

describe('[Query.login]', () => {
  const mockInputs = {
    email: 'felipe@email.com',
    password: '12345',
  };

  const mockContext = {
    models: {
      User: { findOne: jest.fn() },
    },
  };

  const mockUserResponse = {
    email: 'felipe@email.com',
    password: 'hashedPass',
    role: 'admin',
    _id: '123asd',
  };

  const { findOne } = mockContext.models.User;

  it('should login user', async (done) => {
    findOne.mockReturnValueOnce(mockUserResponse);

    bcrypt.compare = jest.fn();
    bcrypt.compare.mockReturnValueOnce(true);

    const res = await login(null, mockInputs, mockContext);

    expect(res.userId).toEqual('123asd');
    expect(res.token).toBeDefined();
    done();
  });

  it('throws an error when inputs are invalid', async () => {
    await expect(
      login(null, { email: 'foo', password: undefined }, mockContext),
    ).rejects.toThrow('Houve um erro em um dos campos.');
  });

  it('throws an error if user is not found', async () => {
    await expect(login(null, mockInputs, mockContext)).rejects.toThrow(
      'Usuário não encontrado.',
    );
  });

  it('throws an error if bcrypt compare fails', async () => {
    findOne.mockReturnValueOnce(mockUserResponse);

    await expect(login(null, mockInputs, mockContext)).rejects.toThrow(
      'Usuário não encontrado.',
    );
  });
});
