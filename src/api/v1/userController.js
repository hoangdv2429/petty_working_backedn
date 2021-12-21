import { Router } from 'express';
import auth from '../../middleware/auth';
import UserService from '../../service/userService';
import BaseController from './baseController';
import { ValidationError } from '@hapi/joi';

const USER_ROUTES = {
	all: '/',
	one: '/:id',
	login: '/login',
	register: '/register',
	detail: '/detail',
};

export class UserController extends BaseController {

	constructor() {
		super();
		this.service = new UserService();
	}

	getAll = async (req, res) => {
		const { service: userService } = this;
		const users = await userService.getAll();
		return this.responseSuccess(res, users);
	}

	login = async (req, res) => {
		try {
			const { service: userService } = this;
			const loginUser = await this.service.login(req.body);
			const result = userService.generateToken(loginUser.toJSON());

			return this.responseSuccess(res, result);
		} catch (error) {
			if (error instanceof ValidationError) {
				this.responseError(res, error.message, 400);
			} else {
				this.responseError(res, "Đã có lỗi xảy ra");
			}
		}
	}

	register = async (req, res) => {
		try {
			const { service: userService } = this;
			let registeredUser = await this.service.register(req.body);

			const result = userService.generateToken(registeredUser.toJSON());

			return this.responseSuccess(res, result);
		} catch (error) {
			if (error instanceof ValidationError) {
				this.responseError(res, error.message, 400);
			} else {
				this.responseError(res, "Đã có lỗi xảy ra");
			}
		}
	}

	getOne = async (req, res) => {
		const { id } = req.params;
		const { service: userService } = this;
		const user = await userService.getById(id);

		return this.responseSuccess(res, user.toJSON());
	}

	getUserByToken = async (req, res) => {
		const { userId } = req.headers;
		const { service: userService } = this;
		const user = await userService.getById(userId);

		if (!user) {
			return this.responseError(res, "Token sai định dạng, hoặc đã hết hạn", 401);
		}

		return this.responseSuccess(res, user);
	}

}

export default ({ config }) => {
	let api = Router();
	const defaultMiddlewares = config.defaultMiddlewares;
	const userController = new UserController();
	api.get(USER_ROUTES.all, defaultMiddlewares, userController.getAll)
	//User login
	api.post(USER_ROUTES.login, defaultMiddlewares.without([auth]), userController.login);
	//User register
	api.post(USER_ROUTES.register, defaultMiddlewares.without([auth]), userController.register);
	//Get by token
	api.get(USER_ROUTES.detail, defaultMiddlewares, userController.getUserByToken);
	//Get User
	api.get(USER_ROUTES.one, defaultMiddlewares, userController.getOne);

	return api;
};