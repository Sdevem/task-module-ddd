import { randomUUID } from 'crypto'
import { Task } from '../../domain/entities/task.entity'
import { TaskRepository } from '../repositories/task-repository.interface'
import { Either, left, right } from '../../shared/either'
import { TaskPriority } from 'src/domain/enums/task-priority.enum'

type CreateTaskRequest = {
  title: string
  description?: string
  assigneeId: string
  priority?: TaskPriority
  dueDate: Date
}

export class CreateTaskUseCase {
  constructor(private repository: TaskRepository) {}

  async execute(
    request: CreateTaskRequest,
  ): Promise<Either<Error, Task>> {
    const id = randomUUID()
    const organizationId = 'default-org-id'

    const taskOrError = Task.create({
      id,
      title: request.title,
      description: request.description,
      assigneeId: request.assigneeId,
      organizationId,
      dueDate: request.dueDate,
      priority: request.priority,
    })

    if (taskOrError.type === 'left') {
      return left(taskOrError.value)
    }

    const task = taskOrError.value

    await this.repository.save(task)

    return right(task)
  }
}