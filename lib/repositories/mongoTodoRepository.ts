import { getDatabase } from '../db/mongodb';
import type { Todo } from '../types/todo';
import type { ITodoRepository } from './todoRepository';
import { ObjectId } from 'mongodb';

export class MongoTodoRepository implements ITodoRepository {
  private collectionName = 'todos';

  async findAll(userId: string): Promise<Todo[]> {
    const db = await getDatabase();
    const collection = db.collection<Todo & { _id?: ObjectId; userId: string }>(this.collectionName);
    const todos = await collection.find({ userId }).toArray();
    return todos.map((todo) => ({
      id: todo._id?.toString() || '',
      text: todo.text,
      completed: todo.completed,
      createdAt: todo.createdAt,
    }));
  }

  async findById(id: string, userId: string): Promise<Todo | null> {
    const db = await getDatabase();
    const collection = db.collection<Todo & { _id?: ObjectId; userId: string }>(this.collectionName);
    
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return null;
    }
    
    const todo = await collection.findOne({ _id: objectId, userId });
    
    if (!todo) return null;
    
    return {
      id: todo._id?.toString() || id,
      text: todo.text,
      completed: todo.completed,
      createdAt: todo.createdAt,
    };
  }

  async create(todo: Omit<Todo, 'id' | 'createdAt'>, userId: string): Promise<Todo> {
    const db = await getDatabase();
    const collection = db.collection<Todo & { userId: string }>(this.collectionName);
    
    const newTodo = {
      ...todo,
      userId,
      createdAt: new Date().toISOString(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await collection.insertOne(newTodo as any);
    
    return {
      id: result.insertedId.toString(),
      text: todo.text,
      completed: todo.completed,
      createdAt: newTodo.createdAt,
    };
  }

  async update(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>, userId: string): Promise<Todo> {
    const db = await getDatabase();
    const collection = db.collection<Todo & { _id?: ObjectId; userId: string }>(this.collectionName);
    
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      throw new Error('Invalid todo ID');
    }
    
    const result = await collection.findOneAndUpdate(
      { _id: objectId, userId },
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error('Todo not found');
    }

    return {
      id: result._id?.toString() || id,
      text: result.text,
      completed: result.completed,
      createdAt: result.createdAt,
    };
  }

  async delete(id: string, userId: string): Promise<void> {
    const db = await getDatabase();
    const collection = db.collection<Todo & { _id?: ObjectId; userId: string }>(this.collectionName);
    
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      throw new Error('Invalid todo ID');
    }
    
    const result = await collection.deleteOne({ _id: objectId, userId });
    
    if (result.deletedCount === 0) {
      throw new Error('Todo not found');
    }
  }
}

