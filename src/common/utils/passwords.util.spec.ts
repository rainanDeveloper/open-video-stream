import {
  PasswordUtil,
  NUMBER_CHAR_SET,
  LOWER_CASE_CHAR_SET,
  UPPER_CASE_CHAR_SET,
  SYMBOL_CHAR_SET,
} from './passwords.util';
describe('PasswordUtil', () => {
  let passwordUtil: PasswordUtil;
  beforeEach(async () => {
    passwordUtil = new PasswordUtil();
  });

  it('should be defined', () => {
    expect(passwordUtil).toBeDefined();
  });

  describe('calculateEntropy', () => {
    it('should calculate and return entropy of password', () => {
      // Arrange
      const password = 'Ako56oxH5cBoGyZ9fWDk';
      const precalculatedTestValue = Math.log(Math.pow(62, 20)) / Math.log(2);
      // Act
      const entropy = passwordUtil.calculateEntropy(password, [
        NUMBER_CHAR_SET,
        LOWER_CASE_CHAR_SET,
        UPPER_CASE_CHAR_SET,
        SYMBOL_CHAR_SET,
      ]);

      // Assert
      expect(typeof entropy).toEqual('number');
      expect(entropy).toEqual(precalculatedTestValue);
    });
  });
});
