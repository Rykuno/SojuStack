import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { type DrizzleClient } from 'src/common/database/drizzle.type';
import { todos } from 'src/common/database/drizzle.schema';
import { takeFirstOrThrow } from 'src/common/database/drizzle.utils';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoDto } from './dto/todo.dto';
import { InjectDrizzle } from '@nest-native/drizzle';

@Injectable()
export class TodosService {
  constructor(
    @InjectDrizzle()
    private readonly db: DrizzleClient,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<TodoDto> {
    return this.db.insert(todos).values(createTodoDto).returning().then(takeFirstOrThrow);
  }

  findAll() {
    return this.db.query.todos.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const todo = await this.db.query.todos.findFirst({
      where: {
        id,
      },
    });
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async update(id: string, set: UpdateTodoDto) {
    return this.db
      .update(todos)
      .set(set)
      .where(eq(todos.id, id))
      .returning()
      .then(takeFirstOrThrow);
  }

  async remove(id: string) {
    return this.db.delete(todos).where(eq(todos.id, id)).returning().then(takeFirstOrThrow);
  }
}
