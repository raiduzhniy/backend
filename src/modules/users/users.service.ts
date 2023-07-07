import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { IsExistingAbstract } from '../../shared/abstract-classes';
import { Owner, OwnerDto, OwnersService } from '../owners';
import { Vehicle, VehicleDto, VehiclesService } from '../vehicles';
import { User, UserSchema } from './user.schema';
import { UserDto, UserUpdateDto } from './users.dto';
import * as bcrypt from 'bcrypt';

const DEFAULT_USER_POPLATE = ['owners', 'vehicles'];

@Injectable()
export class UsersService extends IsExistingAbstract<User> {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private ownersService: OwnersService,
    private vehiclesService: VehiclesService,
  ) {
    super(userModel);
  }

  async getUsers(): Promise<User[]> {
    return this.userModel.find().populate(['owners', 'vehicles']);
  }

  async getUserById(
    userId: string,
    populate:
      | PopulateOptions
      | (PopulateOptions | string)[] = DEFAULT_USER_POPLATE,
  ): Promise<User> {
    return this.userModel.findById(userId).populate(populate);
  }

  async getFullUser(
    filter: FilterQuery<User>,
    populate:
      | PopulateOptions
      | (PopulateOptions | string)[] = DEFAULT_USER_POPLATE,
  ): Promise<User> {
    return this.userModel
      .findOne(filter)
      .select('+passwordHash')
      .populate(populate);
  }

  async createUser({
    roles,
    owners,
    apartmentNumber,
    login,
    password,
    vehicles,
  }: UserDto): Promise<User> {
    const isUserExist = await this.checkIsExist({
      $or: [{ login }, { apartmentNumber }],
    });

    if (isUserExist) {
      throw new BadRequestException(
        'User with the same login or apartment number is existing',
      );
    }

    const [ownersIds, vehicleIds] = [
      await Promise.all(this.createOwners(owners)),
      await Promise.all(this.createVehicles(vehicles)),
    ];

    const passwordHash = await this.createPasswordHash(password);

    const user: UserSchema = new this.userModel({
      login,
      roles,
      apartmentNumber,
      owners: ownersIds,
      vehicles: vehicleIds,
      passwordHash,
    });

    return user.save();
  }

  async updateUser(
    userId: string,
    { roles, owners, vehicles }: UserUpdateDto,
  ): Promise<User> {
    const user = await this.getUserById(userId, []);

    await Promise.all(this.deleteOwners(user.owners as string[]));
    await Promise.all(this.deleteVehicles(user.vehicles as string[]));

    const [ownersIds, vehicleIds] = [
      await Promise.all(this.createOwners(owners)),
      await Promise.all(this.createVehicles(vehicles)),
    ];

    return this.userModel.findByIdAndUpdate(
      userId,
      {
        vehicles: vehicleIds,
        owners: ownersIds,
        roles,
      },
      {
        new: true,
      },
    );
  }

  async changeUserPassword(
    userId: string,
    newPassword?: string,
  ): Promise<User> {
    const user = await this.getUserById(userId, []);

    return this.userModel
      .findByIdAndUpdate(userId, {
        passwordHash: await this.createPasswordHash(newPassword || user.login),
      })
      .populate(DEFAULT_USER_POPLATE);
  }

  private createOwners(ownerDtos: OwnerDto[] = []): Promise<Owner>[] {
    return ownerDtos?.map(async (ownerDto) => {
      const owner = await this.ownersService.createOwner(ownerDto);

      return owner['_id'];
    });
  }

  private createVehicles(vehicleDtos: VehicleDto[] = []): Promise<Vehicle>[] {
    return vehicleDtos?.map(async (vehicleDto) => {
      const vehicle = await this.vehiclesService.createVehicle(vehicleDto);

      return vehicle['_id'];
    });
  }

  private deleteOwners(ownerIds: string[]): Promise<Owner>[] {
    return ownerIds.map(async (ownerId) => {
      return await this.ownersService.findOwnerAndDelete(ownerId);
    });
  }

  private deleteVehicles(vehicleIds: string[]): Promise<Vehicle>[] {
    return vehicleIds.map(async (vehicleIds) => {
      return await this.vehiclesService.findVehicleAndDelete(vehicleIds);
    });
  }

  private async createPasswordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return bcrypt.hashSync(password, salt);
  }
}
