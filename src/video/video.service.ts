import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { VideoModel } from './video.model'
import { Types } from 'mongoose'

@Injectable()
export class VideoService {
	constructor(
		@InjectModel(VideoModel) private readonly VideoModel: ModelType<VideoModel>
	) {}

	async byId(_id: Types.ObjectId) {
		const user = await this.VideoModel.findOne({ _id, isPublic: true }, '-__v')
		if (!user) throw new UnauthorizedException('Video not found')

		return user
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [{ name: new RegExp(searchTerm, 'i') }]
			}

		return this.VideoModel.find(options)
			.find({ isPublic: true }, '-__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}

	async byUserId(userId: Types.ObjectId, isPrivate = false) {
		const userIdCheck = { user: userId }
		const options = isPrivate ? userIdCheck : { ...userIdCheck, isPublic: true }

		return this.VideoModel.find(options, '-__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}
}
