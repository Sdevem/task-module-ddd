import { ApiProperty } from "@nestjs/swagger";
import { TaskStatus } from "src/domain/enums/task-status.enum";

export class UpdateTaskStatusDTO {
  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
  })
  status: TaskStatus
}