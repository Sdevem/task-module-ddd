import { Module } from '@nestjs/common';
import { TaskController } from './presentation/controllers/task.controller'
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case'
import { UpdateTaskStatusUseCase } from './application/use-cases/update-task-status.use-case'
import { InMemoryTaskRepository } from './infra/repositories/in-memory-task.repository'

@Module({
  controllers: [TaskController],
  providers: [
    {
      provide: 'TaskRepository',
      useClass: InMemoryTaskRepository,
    },
    {
      provide: CreateTaskUseCase,
      useFactory: (repo: InMemoryTaskRepository) => {
        return new CreateTaskUseCase(repo)
      },
      inject: ['TaskRepository'],
    },
    {
      provide: UpdateTaskStatusUseCase,
      useFactory: (repo: InMemoryTaskRepository) => {
        return new UpdateTaskStatusUseCase(repo)
      },
      inject: ['TaskRepository'],
    },
  ],
})
export class AppModule {}
