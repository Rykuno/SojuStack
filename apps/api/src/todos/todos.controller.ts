import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoDto } from './dto/todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodosService } from './todos.service';
import { ZodResponse } from 'nestjs-zod';
import { Auth, AuthType } from 'src/auth/decorators/auth.decorator';

@Controller('todos')
@Auth(AuthType.Unauthenticated)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ZodResponse({ type: TodoDto, status: 201 })
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  @ZodResponse({ type: [TodoDto], status: 200 })
  findAll() {
    return this.todosService.findAll() as Promise<TodoDto[]>;
  }

  @Get(':id')
  @ZodResponse({ type: TodoDto, status: 200 })
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  @ZodResponse({ type: TodoDto, status: 200 })
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @ZodResponse({ type: TodoDto, status: 200 })
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }
}
