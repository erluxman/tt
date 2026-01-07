import { getDatabase } from '../db/mongodb';
import type { User, CreateUserInput } from '../types/user';
import bcrypt from 'bcryptjs';

const COLLECTION_NAME = 'users';

export class UserModel {
  static async create(input: CreateUserInput): Promise<User> {
    const db = await getDatabase();
    const collection = db.collection<User>(COLLECTION_NAME);

    // Check if user already exists
    const existingUser = await collection.findOne({ email: input.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 10);

    const now = new Date().toISOString();
    const user: User = {
      email: input.email,
      password: hashedPassword,
      name: input.name || input.email.split('@')[0],
      provider: 'credentials',
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(user);
    return { ...user, _id: result.insertedId.toString() };
  }

  static async findByEmail(email: string): Promise<User | null> {
    const db = await getDatabase();
    const collection = db.collection<User>(COLLECTION_NAME);
    return collection.findOne({ email });
  }

  static async findById(id: string): Promise<User | null> {
    const db = await getDatabase();
    const collection = db.collection<User>(COLLECTION_NAME);
    const user = await collection.findOne({ _id: id });
    if (!user) return null;
    return { ...user, _id: user._id?.toString() };
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Create default test user if it doesn't exist
  static async createDefaultUser(): Promise<void> {
    const db = await getDatabase();
    const collection = db.collection<User>(COLLECTION_NAME);
    
    const existingUser = await collection.findOne({ email: 'test@test.com' });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('test', 10);
      const now = new Date().toISOString();
      await collection.insertOne({
        email: 'test@test.com',
        password: hashedPassword,
        name: 'Test User',
        provider: 'credentials',
        createdAt: now,
        updatedAt: now,
      });
    }
  }
}

