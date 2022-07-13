import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UsePipes,
	ValidationPipe,
	HttpCode,
	Put
} from '@nestjs/common'
import { UserService } from './user.service'
import { UserDto } from './user.dto'
import { CurrentUser } from './decorators/user.decorator'
import { Auth } from './../auth/decorators/auth.decorator'
import { timeStamp } from 'console'
import { Types } from 'mongoose'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('_id') _id: Types.ObjectId) {
		return this.userService.getUserWithVideoCount(_id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('profile')
	@Auth() //Admin
	async updateProdile(
		@CurrentUser('_id') _id: Types.ObjectId,
		@Body() dto: UserDto
	) {
		return this.userService.updateProfile(_id, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async updateUser(
		@Param('id', IdValidationPipe) id: Types.ObjectId,
		@Body() dto: UserDto
	) {
		return this.userService.updateProfile(id, dto)
	}

	@Get('most-popular')
	async getMostPopular() {
		return this.userService.getMostPopular()
	}
}
