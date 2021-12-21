import BaseService from './baseService';
import Users from '../model/users';
import UserValidator from '../validator/userValidator';
import { ValidationError } from '@hapi/joi';
import MD5 from 'crypto-js/md5';
const jwt = require('jsonwebtoken');

export default class UserService extends BaseService {
    constructor() {
        super(Users, UserValidator);
    }

    getAll = async () => {
        const { model } = this;
        return await model.findAll();
    }

    getById = async (id) => {
        const { model } = this;
        return await model.findByPk(id);
    }

    login = async (loginData) => {
        const { model, validator } = this;
        const validated = validator.LoginSchema.validate(loginData);

        if (validated.error) {
            throw new ValidationError('Dữ liệu gửi lên không chính xác', validated.error);
        }
        const { value: validatedData } = validated;

        validatedData.password = this.passwordToHash(validatedData.password);

        const users = await model.findAll({
            where: validatedData
        });

        if (!users[0]) {
            throw new ValidationError('Sai tài khoản hoặc mật khẩu');
        }

        return users[0];
    };

    register = async (registerData) => {
        const { model, validator } = this;
        const validated = validator.RegisterSchema.validate(registerData);

        if (validated.error) {
            throw new ValidationError('Dữ liệu gửi lên không chính xác', validated.error);
        }
        const { value: validatedData } = validated;

        const foundByEmail = await model.findAll({
            where: {
                email: validatedData.email
            }
        });

        if (foundByEmail && foundByEmail.length > 0) {
            throw new ValidationError('Email đã tồn tại');
        }
        
        validatedData.password = this.passwordToHash(validatedData.password);

        const createdUser = await model.create(validatedData);

        return createdUser;
    };

    passwordToHash = (password) => {
        return MD5(password).toString();
    };

    generateToken = (payload) => {
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '8h' });
    }
}