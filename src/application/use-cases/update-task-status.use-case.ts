import { TaskRepository } from '../repositories/task-repository.interface'
import { TaskStatus } from '../../domain/enums/task-status.enum'
import { Either, left, right } from '../../shared/either'
import { TaskNotFoundError } from '../../domain/errors/task.errors'

export class UpdateTaskStatusUseCase {
  constructor(private repository: TaskRepository) {}

  async execute(
    id: string,
    status: TaskStatus,
  ): Promise<Either<Error, { id: string; status: TaskStatus }>> {
    const task = await this.repository.findById(id)

    if (!task) {
        return left(new TaskNotFoundError(id))
    }

    const result = task.updateStatus(status)

    if (result.type === 'left') {
      return left(result.value)
    }

    await this.repository.update(task)

    return right({
      id: task.id,
      status: task.status,
    })
  }
}