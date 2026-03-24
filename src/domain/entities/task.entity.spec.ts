import { Task } from './task.entity'
import { TaskPriority } from '../enums/task-priority.enum'
import { TaskStatus } from '../enums/task-status.enum'
import { isLeft, isRight } from '../../shared/either'

describe('Task Entity', () => {
  it('should create a task successfully', () => {
    const result = Task.create({
      id: '1',
      title: 'Test',
      assigneeId: 'user-1',
      organizationId: 'org-1',
      dueDate: new Date(Date.now() + 100000),
      priority: TaskPriority.HIGH,
    })

    expect(isRight(result)).toBe(true)
  })

  it('should not create task with invalid title', () => {
    const result = Task.create({
      id: '1',
      title: '',
      assigneeId: 'user-1',
      organizationId: 'org-1',
      dueDate: new Date(Date.now() + 100000),
    })

    expect(isLeft(result)).toBe(true)
  })

  it('should not create task with past due date', () => {
    const result = Task.create({
      id: '1',
      title: 'Test',
      assigneeId: 'user-1',
      organizationId: 'org-1',
      dueDate: new Date(Date.now() - 100000),
    })

    expect(isLeft(result)).toBe(true)
  })

  it('should update status correctly', () => {
    const taskOrError = Task.create({
      id: '1',
      title: 'Test',
      assigneeId: 'user-1',
      organizationId: 'org-1',
      dueDate: new Date(Date.now() + 100000),
    })

    if (isLeft(taskOrError)) throw new Error()

    const task = taskOrError.value

    const result = task.updateStatus(TaskStatus.IN_PROGRESS)

    expect(isRight(result)).toBe(true)
    expect(task.status).toBe(TaskStatus.IN_PROGRESS)
  })

  it('should not allow invalid status transition', () => {
    const taskOrError = Task.create({
      id: '1',
      title: 'Test',
      assigneeId: 'user-1',
      organizationId: 'org-1',
      dueDate: new Date(Date.now() + 100000),
    })

    if (isLeft(taskOrError)) throw new Error()

    const task = taskOrError.value

    task.updateStatus(TaskStatus.IN_PROGRESS)
    task.updateStatus(TaskStatus.COMPLETED)

    const result = task.updateStatus(TaskStatus.IN_PROGRESS)

    expect(isLeft(result)).toBe(true)
  })
})