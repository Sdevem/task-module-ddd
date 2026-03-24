import { CreateTaskUseCase } from './create-task.use-case'
import { InMemoryTaskRepository } from '../../infra/repositories/in-memory-task.repository'
import { isRight, isLeft } from '../../shared/either'

describe('CreateTaskUseCase', () => {
  it('should create a task successfully', async () => {
    const repo = new InMemoryTaskRepository()
    const useCase = new CreateTaskUseCase(repo)

    const result = await useCase.execute({
      title: 'Test',
      assigneeId: 'user-1',
      dueDate: new Date(Date.now() + 100000),
    })

    expect(isRight(result)).toBe(true)
  })

  it('should fail with invalid data', async () => {
    const repo = new InMemoryTaskRepository()
    const useCase = new CreateTaskUseCase(repo)

    const result = await useCase.execute({
      title: '',
      assigneeId: 'user-1',
      dueDate: new Date(Date.now() + 100000),
    })

    expect(isLeft(result)).toBe(true)
  })
})