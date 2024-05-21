import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-respository'

interface SeachGymsUseCaseRequest {
  query: string
  page: number
}

interface SeachGymsUseCaseResponse {
  gyms: Gym[]
}

export class SeachGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SeachGymsUseCaseRequest): Promise<SeachGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
