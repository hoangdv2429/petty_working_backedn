import { Router } from 'express';
import PetService from '../../service/petSerivce';
import BaseController from './baseController';
import { ValidationError } from '@hapi/joi';
import auth from '../../middleware/auth';

const PET_ROUTES = {
	all: '/',
	allMy: '/my',
	one: '/:id',
	oneMy: '/my/:id',
	create: '/',
	update: '/',
};

export class PetController extends BaseController {

	constructor() {
		super();
		this.service = new PetService();
	}

	create = async (req, res) => {
		try {
			const { userId } = req.headers;
			req.body.userId = userId;
			const { service: petService } = this;
			const pet = await petService.create(req.body);
			return this.responseSuccess(res, pet);
		} catch (error) {
			if (error instanceof ValidationError) {
				this.responseError(res, error.details, 400);
			} 
			else {
				this.responseError(res, "Đã có lỗi xảy ra");
			}
		}
	}

	update = async (req, res) => {
		// try {
			const { userId } = req.headers;
			req.body.userId = userId;
			const { service: petService } = this;
			const pet = req.body;
			if (!pet.id) {
				this.responseError(res, "Bắt buộc có Id", 400);
			}
			return this.responseSuccess(res, await petService.update(pet));
		// } catch (error) {
		// 	if (error instanceof ValidationError) {
		// 		this.responseError(res, error.message, 400);
		// 	} 
		// 	else {
		// 		this.responseError(res, "Đã có lỗi xảy ra");
		// 	}
		// }
	}

	getAll = async (req, res) => {
		try {
			const { keyword } = req.query
			const { service: petService } = this;
			const pets = await petService.getAll(keyword);
			return this.responseSuccess(res, pets);
		} catch (error) {
			this.responseError(res, "Đã có lỗi xảy ra");
		}
	}

	getAllMyPet = async (req, res) => {
		try {
			const { userId } = req.headers;
			const { keyword } = req.query
			const { service: petService } = this;
			const pets = await petService.getAll(keyword, userId);
			return this.responseSuccess(res, pets);
		} catch (error) {
			this.responseError(res, "Đã có lỗi xảy ra");
		}
	}

	getOne = async (req, res) => {
		try {
			const { id } = req.params;
			const { service: petService } = this;
			const pet = await petService.getById(id);
			if (!pet) {
				this.responseError(res, "Pet không tồn tại", 404);
			}
			return this.responseSuccess(res, pet.toJSON());
		} catch (error) {
			this.responseError(res, "Đã có lỗi xảy ra");
		}
	}

	getOneMyPet = async (req, res) => {
		try {
			const { userId } = req.headers;
			const { id } = req.params;
			const { service: petService } = this;
			const pet = await petService.getById(id);
			if (!pet || pet.userId != userId) {
				this.responseError(res, "Pet không tồn tại", 404);
			}
			return this.responseSuccess(res, pet.toJSON());
		} catch (error) {
			this.responseError(res, "Đã có lỗi xảy ra");
		}
	}
}

export default ({ config }) => {
	let api = Router();
	const defaultMiddlewares = config.defaultMiddlewares;
	const petController = new PetController();

	api.get(PET_ROUTES.all, defaultMiddlewares.without([auth]), petController.getAll)
	api.get(PET_ROUTES.allMy, defaultMiddlewares, petController.getAllMyPet)
	api.get(PET_ROUTES.one, defaultMiddlewares.without([auth]), petController.getOne)
	api.get(PET_ROUTES.oneMy, defaultMiddlewares, petController.getOneMyPet)
	api.post(PET_ROUTES.create, defaultMiddlewares, petController.create)
	api.put(PET_ROUTES.update, defaultMiddlewares, petController.update)

	return api;
};