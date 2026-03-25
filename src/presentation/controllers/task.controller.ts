import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common'

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case'
import { UpdateTaskStatusUseCase } from '../../application/use-cases/update-task-status.use-case'

import { TaskPriority } from '../../domain/enums/task-priority.enum'
import { TaskStatus } from '../../domain/enums/task-status.enum'

import { isLeft } from '../../shared/either'
import {
  InvalidStatusTransitionError,
} from '../../domain/errors/task.errors'
import { TaskNotFoundError } from '../../domain/errors/task.errors'
import { CreateTaskDTO } from '../dtos/create-task.dto'
import { UpdateTaskStatusDTO } from '../dtos/update-task-status.dto'



@ApiTags('tasks')
@Controller('/api/v1/tasks')
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskStatusUseCase: UpdateTaskStatusUseCase,
  ) {}

@Post()
@ApiOperation({ summary: 'Create a new task' })
@ApiResponse({ status: 201, description: 'Task created successfully' })
@ApiResponse({ status: 400, description: 'Invalid input' })
async create(@Body() body: CreateTaskDTO) {
    if (!body || !body.title || !body.assigneeId || !body.dueDate) {
        return {
            statusCode: 400,
            message: 'Missing required fields',
        }
    }

    const result = await this.createTaskUseCase.execute({
      ...body,
      dueDate: new Date(body.dueDate),
    })

    if (isLeft(result)) {
       return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: result.value.message,
      }
    }

    const task = result.value

    return {
      statusCode: HttpStatus.CREATED,
      ...task,
    }
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update task status' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateTaskStatusDTO,
  ) {
    if (!body || !body.status) {
        return { statusCode: HttpStatus.BAD_REQUEST, message: 'Status is required' }
    }
    const result = await this.updateTaskStatusUseCase.execute(
      id,
      body.status,
    )

    if (isLeft(result)) {
      if (result.value instanceof TaskNotFoundError) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: result.value.message,
        }
      }

      if (result.value instanceof InvalidStatusTransitionError) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: result.value.message,
        }
      }

      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: result.value.message,
      }
    }

    return {
      statusCode: HttpStatus.OK,
      ...result.value,
    }
  }
}