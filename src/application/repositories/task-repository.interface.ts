import { Task } from '../../domain/entities/task.entity'

export interface TaskRepository {
  save(task: Task): Promise<void>
  findById(id: string): Promise<Task | null>
  update(task: Task): Promise<void>
}