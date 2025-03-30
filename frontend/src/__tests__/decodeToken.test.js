import decodeToken from '../utils/decodeToken';

describe('decodeToken', () => {
  it('returns dummy payload when useDummy is true', () => {
    const token = 'any.string.will.do';
    const result = decodeToken(token, { useDummy: true });

    expect(result).toEqual({
      username: 'Farhan Hossein',
      email: 'farhan.hossein@gmail.com',
      user_id: 1,
      profile_image_url: '/avatar.png',
    });
  });

  it('throws an error if token is invalid (less than 2 parts)', () => {
    const badToken = 'invalidToken';

    expect(() => decodeToken(badToken)).toThrow('Invalid token');
  });

  it('decodes a valid token payload', () => {
    const validToken = 'header.eyJmb28iOiJiYXIifQ.signature';

    const result = decodeToken(validToken);
    expect(result).toEqual({ foo: 'bar' });
  });
});
