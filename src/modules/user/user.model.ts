import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { Role } from '~/utilities/emu.untility';
import { IUser } from '~/modules/user/user.interface';
import { HashPasswordUtility } from '~/utilities/hash-password.utility';

const UserSchema: Schema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: Object.values(Role),
			default: Role.User,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		activationCode: {
			type: String,
			default: null,
		},
		activationCodeExpiresAt: {
			type: Date,
			default: null,
		},
		resetPasswordCode: {
			type: String,
			default: null,
		},
		resetPasswordCodeExpiresAt: {
			type: Date,
			default: null,
		},
		lastLogin: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);


UserSchema.pre<IUser & Document>('save', async function (next) {
	if (!this.isModified('password')) return next();

	try {
		this.password = await HashPasswordUtility.hash(this.password);
		next();
	} catch (error) {
		next(error as Error);
	}
});


export const User = mongoose.model<IUser & Document>('User', UserSchema);
