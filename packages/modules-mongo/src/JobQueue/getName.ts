import { v4 as uuid } from 'uuid'

// TODO: When running in AWS use Task Metadata Endpoint to get Task ID
// https://docs.aws.amazon.com/AmazonECS/latest/userguide/task-metadata-endpoint-v4-fargate.html
export const getName = (): string => {
  return uuid()
}
