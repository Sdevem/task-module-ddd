import { Task } from '../../domain/entities/task.entity'
import { TaskRepository } from '../../application/repositories/task-repository.interface'

export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Task[] = []

  async save(task: Task): Promise<void> {
    this.tasks.push(task)
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.find(task => task.id === id) ?? null
  }

  async update(task: Task): Promise<void> {
    const index = this.tasks.findIndex(t => t.id === task.id)

    if (index !== -1) {
      this.tasks[index] = task
    }
  }
}