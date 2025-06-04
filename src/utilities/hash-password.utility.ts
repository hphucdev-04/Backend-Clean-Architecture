import bcrypt from 'bcrypt';

export class HashPasswordUtility {
  private static readonly SALT_ROUNDS = 10;

  public static async hash(password: string, saltRounds: number = this.SALT_ROUNDS): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds); 
    return bcrypt.hash(password, salt);
  }

  public static async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  public static generateRandomCode(length = 5): string {
    const chars = '0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }
}
