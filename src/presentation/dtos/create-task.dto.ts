import { ApiProperty } from "@nestjs/swagger"
import { TaskPriority } from "src/domain/enums/task-priority.enum"

export class CreateTaskDTO {
  @ApiProperty({ example: 'Implement feature X' })
  title: string

  @ApiProperty({ example: 'Detailed description', required: false })
  description?: string

  @ApiProperty({ example: 'user-uuid-123' })
  assigneeId: string

  @ApiProperty({ enum: TaskPriority, required: false })
  priority?: TaskPriority

  @ApiProperty({ example: '2026-03-30T23:59:59Z' })
  dueDate: string
}