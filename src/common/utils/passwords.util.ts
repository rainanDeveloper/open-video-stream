export const NUMBER_CHAR_SET = '0123456789';
export const LOWER_CASE_CHAR_SET = 'abcdefghijklmnopqrstuvwxyz';
export const UPPER_CASE_CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const SYMBOL_CHAR_SET = '!@#$%*()?><.,?;:\\\'´"';

export class PasswordUtil {
  calculateEntropy(password: string, charsets: string[]) {
    const interceptionsOnCharsets: Array<Array<string>> = charsets.map(
      (charset) => {
        // gets the array of chars which the password has
        return charset.split('').filter((c) => password.indexOf(c) > -1);
      },
    );

    const totalSizeOfPoolOnPassword = interceptionsOnCharsets
      .map((interceptionArray, index) => {
        if (interceptionArray.length > 0) {
          return charsets[index].length;
        } else {
          return 0;
        }
      })
      .reduce((previousLenght, nextLength) => previousLenght + nextLength, 0);

    const lengthOfPassword = password.length;

    return (
      Math.log(Math.pow(totalSizeOfPoolOnPassword, lengthOfPassword)) / // Logarithm change of base rule: log_a (b) = log_x(b) / log_x(a)
      Math.log(2)
    );
  }
}
