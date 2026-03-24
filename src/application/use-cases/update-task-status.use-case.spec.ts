import { UpdateTaskStatusUseCase } from './update-task-status.use-case'
import { InMemoryTaskRepository } from '../../infra/repositories/in-memory-task.repository'
import { Task } from '../../domain/entities/task.entity'
import { TaskStatus } from '../../domain/enums/task-status.enum'
import { isRight, isLeft } from '../../shared/either'

describe('UpdateTaskStatusUseCase', () => {
  it('should update task status successfully', async () => {
    const repo = new InMemoryTaskRepository()

    const taskOrError = Task.create({
      id: '1',
      title: 'Test',
      assigneeId: 'user-1',
      organizationId: 'org-1',
      dueDate: new Date(Date.now() + 100000),
    })

    if (isLeft(taskOrError)) throw new Error()

    const task = taskOrError.value

    await repo.save(task)

    const useCase = new UpdateTaskStatusUseCase(repo)

    const result = await useCase.execute('1', TaskStatus.IN_PROGRESS)

    expect(isRight(result)).toBe(true)
  })

  it('should fail when task does not exist', async () => {
    const repo = new InMemoryTaskRepository()
    const useCase = new UpdateTaskStatusUseCase(repo)

    const result = await useCase.execute('999', TaskStatus.IN_PROGRESS)

    expect(isLeft(result)).toBe(true)
  })
})