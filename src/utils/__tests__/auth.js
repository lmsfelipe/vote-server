const jwt = require('jsonwebtoken');

const auth = require('../auth');

describe('[Utils.auth]', () => {
  it('returns `isAuth: false` when header is not definied', () => {
    const req = {
      headers: { authorization: null },
    };

    const authResp = auth(req);
    expect(authResp).toEqual({ isAuth: false });
  });

  it('returns `isAuth: false` if token isnt valid', () => {
    const req = {
      headers: { authorization: 'Bearer 123asdf31' },
    };

    const authResp = auth(req);
    expect(authResp).toEqual({ isAuth: false });
  });

  it('returns `isAuth: true`, userId and role if token is valid', () => {
    const req = {
      headers: { authorization: 'Bearer 123asdf31' },
    };

    jwt.verify = jest.fn();
    jwt.verify.mockReturnValueOnce({ userId: '123ZXC', role: 'admin' });

    const authResp = auth(req);
    expect(authResp).toEqual({ isAuth: true, userId: '123ZXC', role: 'admin' });
  });
});
