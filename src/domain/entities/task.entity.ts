import { TaskStatus } from '../enums/task-status.enum'
import { TaskPriority } from '../enums/task-priority.enum'
import { Either, left, right } from '../../shared/either'
import { AssigneeRequiredError, InvalidDueDateError, InvalidStatusTransitionError, InvalidTaskTitleError, OrganizationRequiredError } from '../errors/task.errors'

  export type CreateTaskProps = {
  id: string
  title: string
  description?: string
  assigneeId: string
  organizationId: string
  dueDate: Date
  priority?: TaskPriority
}

export class Task {
  private constructor(
    public readonly id: string,
    public title: string,
    public description: string | null,
    public status: TaskStatus,
    public priority: TaskPriority,
    public assigneeId: string,
    public organizationId: string,
    public dueDate: Date,
    public completedAt: Date | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}



  static create(params: CreateTaskProps): Either<Error, Task> {
    if (!params.title || params.title.length > 200) {
      return left(new InvalidTaskTitleError())
    }

    if (params.dueDate <= new Date()) {
      return left(new InvalidDueDateError())
    }

    if (!params.assigneeId) {
      return left(new AssigneeRequiredError())
    }

   if (!params.organizationId) {
      return left(new OrganizationRequiredError())
   }

    const now = new Date()

    const task = new Task(
      params.id,
      params.title,
      params.description ?? null,
      TaskStatus.PENDING,
      params.priority ?? TaskPriority.MEDIUM,
      params.assigneeId,
      params.organizationId,
      params.dueDate,
      null,
      now,
      now,
    )

    return right(task)
  }

  updateStatus(newStatus: TaskStatus): Either<Error, void> {
    const current = this.status

    const validTransitions: Record<TaskStatus, TaskStatus[]> = {
      [TaskStatus.PENDING]: [TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED],
      [TaskStatus.IN_PROGRESS]: [TaskStatus.COMPLETED, TaskStatus.CANCELLED],
      [TaskStatus.COMPLETED]: [],
      [TaskStatus.CANCELLED]: [],
    }

    if (!validTransitions[current].includes(newStatus)) {
      return left(new InvalidStatusTransitionError(current, newStatus))
    }

    this.status = newStatus
    this.updatedAt = new Date()

    if (newStatus === TaskStatus.COMPLETED) {
      this.completedAt = new Date()
    }

    return right(undefined)
  }
}