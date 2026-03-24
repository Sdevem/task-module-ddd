import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common'

import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case'
import { UpdateTaskStatusUseCase } from '../../application/use-cases/update-task-status.use-case'

import { TaskPriority } from '../../domain/enums/task-priority.enum'
import { TaskStatus } from '../../domain/enums/task-status.enum'

import { isLeft } from '../../shared/either'
import {
  InvalidStatusTransitionError,
} from '../../domain/errors/task.errors'
import { TaskNotFoundError } from '../../domain/errors/task.errors'

type CreateTaskDTO = {
  title: string
  description?: string
  assigneeId: string
  priority?: TaskPriority
  dueDate: string
}

type UpdateTaskStatusDTO = {
  status: TaskStatus
}

@Controller('/api/v1/tasks')
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskStatusUseCase: UpdateTaskStatusUseCase,
  ) {}

  @Post()
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
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateTaskStatusDTO,
  ) {
    if (!body || !body.status) {
        return { statusCode: 400, message: 'status is required' }
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