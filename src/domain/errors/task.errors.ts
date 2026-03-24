export class InvalidTaskTitleError extends Error {
  constructor() {
    super('Invalid title')
  }
}

export class InvalidDueDateError extends Error {
  constructor() {
    super('Due date must be in the future')
  }
}

export class AssigneeRequiredError extends Error {
  constructor() {
    super('Assignee is required')
  }
}

export class OrganizationRequiredError extends Error {
  constructor() {
    super('Organization is required')
  }
}

export class InvalidStatusTransitionError extends Error {
  constructor(from: string, to: string) {
    super(`Cannot transition from ${from} to ${to}`)
  }
}

export class TaskNotFoundError extends Error {
  constructor(id: string) {
    super(`Task with ID ${id} not found`)
  }
}