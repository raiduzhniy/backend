import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { FirestoreBase, FirestoreService } from '../firebase/firestore';
import { OwnersService } from '../owners';
import { VehiclesService } from '../vehicles';
import { User } from './user.schema';
import { UserDto, UserUpdateDto } from './users.dto';
import { or, where } from 'firebase/firestore';

const DEFAULT_USER_POPLATE = ['owners', 'vehicles'];

@Injectable()
export class UsersService extends FirestoreBase<User> {
  protected readonly collectionName: string = 'users';

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    firestoreService: FirestoreService,
    private ownersService: OwnersService,
    private vehiclesService: VehiclesService,
  ) {
    super(firestoreService);
  }

  getUsers() {
    return this.getDocuments({
      populate: DEFAULT_USER_POPLATE,
      removeFields: ['passwordHash'],
    });
  }

  async getUserById(
    userId: string,
    populate:
      | PopulateOptions
      | (PopulateOptions | string)[] = DEFAULT_USER_POPLATE,
  ): Promise<User> {
    return this.getDocumentById(userId, undefined, {
      populate: DEFAULT_USER_POPLATE,
      removeFields: ['passwordHash'],
    });
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
    const existingUsers = await this.getDocuments({
      filter: or(
        where('login', '==', login),
        where('apartmentNumber', '==', apartmentNumber),
      ),
    });

    if (existingUsers.length) {
      throw new BadRequestException(
        'User with the same login or apartment number is existing',
      );
    }

    const ownerIds = await Promise.all(
      owners.map((owner) =>
        this.ownersService.addDoc(owner).then((doc) => doc.id),
      ),
    );

    const vehicleIds = await Promise.all(
      vehicles.map((vehicle) =>
        this.vehiclesService.addDoc(vehicle).then((doc) => doc.id),
      ),
    );

    const passwordHash = await this.createPasswordHash(password);

    const user: User = {
      login,
      roles,
      apartmentNumber,
      owners: ownerIds,
      vehicles: vehicleIds,
      passwordHash,
    };

    return this.addDoc(user).then((docRef) => this.buildUser(user, docRef.id));
  }

  async updateUser(
    userId: string,
    { roles, owners, vehicles }: UserUpdateDto,
  ): Promise<User> {
    const user = await this.getUserById(userId, []);

    await Promise.all(this.deleteOwners(user.owners as string[]));
    await Promise.all(this.deleteVehicles(user.vehicles as string[]));

    const ownerIds = await Promise.all(
      owners.map((owner) =>
        this.ownersService.addDoc(owner).then((doc) => doc.id),
      ),
    );

    const vehicleIds = await Promise.all(
      vehicles.map((vehicle) =>
        this.vehiclesService.addDoc(vehicle).then((doc) => doc.id),
      ),
    );

    return this.userModel.findByIdAndUpdate(
      userId,
      {
        vehicles: vehicleIds,
        owners: ownerIds,
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

  private deleteOwners(ownerIds: string[]): Promise<void>[] {
    return ownerIds.map(async (ownerId) => {
      return await this.ownersService.findByIdAndDelete(ownerId);
    });
  }

  private deleteVehicles(vehicleIds: string[]): Promise<void>[] {
    return vehicleIds.map(async (vehicleIds) => {
      return await this.vehiclesService.findByIdAndDelete(vehicleIds);
    });
  }

  private async createPasswordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return bcrypt.hashSync(password, salt);
  }

  private buildUser(user: User, id: string): User {
    const { passwordHash, ...builtUser } = user;
    return {
      ...builtUser,
      id,
    };
  }
}
