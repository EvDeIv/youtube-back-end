import { Injectable } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { CommentModel } from './comment.model'
import { Types } from 'mongoose'
import { CommentDto } from './comment.dto'

@Injectable()
export class CommentService {
	constructor(
		@InjectModel(CommentModel)
		private readonly CommentModel: ModelType<CommentModel>
	) {}

	async byVideoId(videoId: Types.ObjectId) {
		return this.CommentModel.find({ video: videoId }, '-__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}

	async create(userId: Types.ObjectId, dto: CommentDto) {
		return this.CommentModel.create({ ...dto, user: userId })
	}
}
