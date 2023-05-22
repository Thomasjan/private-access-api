
import { RowDataPacket } from 'mysql2';
import { Connection, getConnection } from 'typeorm';

export class User {
  public id: number;
  public name: string;
  public email: string;
  public password: string;
  public entreprise_id: number;
  public role_id: number;

  constructor(id: number, name: string, email: string, password: string, entreprise_id: number, role_id: number) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.entreprise_id = entreprise_id;
    this.role_id = role_id;
  }

  static fromRow(row: RowDataPacket): User {
    const { id, name, email, password, entreprise_id, role_id } = row;
    return new User(id, name, email, password, entreprise_id, role_id);
  }

  static async getAll(): Promise<User[]> {
    const connection: Connection = getConnection(); // Assuming you have an active connection
    const userRepository = connection.getRepository(User);
    const users = await userRepository.find();
    return users;
  }
}