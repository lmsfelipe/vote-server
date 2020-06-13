const mongoose = require('mongoose');

const resolvers = require('../vote');
const models = require('../../../models');
const mongoMemoryServer = require('../../../utils/mongo-memory-server');

const { setVote } = resolvers.Mutation;

describe('[Mutation.setVote]', () => {
  const mockContext = {
    authScope: {
      userId: mongoose.Types.ObjectId('5ed27393967260008fa1e95d'),
      isAuth: true,
    },
    models: {
      Vote: models.Vote,
    },
    loaders: {
      teamsLoader: { load: jest.fn() },
      shirtsLoader: { load: jest.fn() },
    },
  };

  const shirtsLoad = mockContext.loaders.shirtsLoader.load;
  const teamsLoad = mockContext.loaders.teamsLoader.load;
  const shirtId = mongoose.Types.ObjectId('5ec1ceab9931750128d05007');

  beforeAll(async () => {
    await mongoMemoryServer.connect();
  });

  afterAll(async (done) => {
    await mongoMemoryServer.disconnect();
    done();
  });

  it('sets a shirts new vote', async (done) => {
    const mockedShirtRes = {
      name: 'Camisa 1',
      team: '123asd',
      votes: 0,
      save: jest.fn(),
    };

    shirtsLoad.mockReturnValueOnce(mockedShirtRes);
    mockedShirtRes.save.mockReturnValueOnce(mockedShirtRes);
    teamsLoad.mockReturnValueOnce({ name: 'Santos FC' });
    const res = await setVote(null, { shirtId }, mockContext);

    expect(res.userId).toBe(mockContext.authScope.userId);
    expect(res.shirtId).toBe(shirtId);
    expect(res._id).toBeDefined();
    expect(res.votes).toBe(1); // Make sure that key votes have been summed up
    done();
  });

  it('throws an error when shirt is not found', async (done) => {
    await expect(setVote(null, { shirtId }, mockContext)).rejects.toThrow(
      'Camisa não encontrada.',
    );

    done();
  });

  it('should return a authorization error', async (done) => {
    mockContext.authScope.isAuth = false;

    await expect(setVote(null, { shirtId }, mockContext)).rejects.toThrow(
      'Usuário não autenticado.',
    );

    done();
  });
});
