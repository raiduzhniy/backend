import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Filter } from 'firebase-admin/firestore';
import { FirestoreBase } from '../firebase/firestore';
import { OwnersService } from '../owners';
import { VehiclesService } from '../vehicles';
import { User } from './user.schema';
import { UserDto, UserUpdateDto } from './users.dto';

const DEFAULT_USER_POPULATE_FIELDS = ['owners', 'vehicles'];
const DEFAULT_USER_REMOVE_FIELDS = ['passwordHash'];

@Injectable()
export class UsersService extends FirestoreBase<User> {
  protected readonly collectionName: string = 'users';

  constructor(
    private ownersService: OwnersService,
    private vehiclesService: VehiclesService,
  ) {
    super();
  }

  getUsers() {
    return this.getDocuments({
      populate: DEFAULT_USER_POPULATE_FIELDS,
      removeFields: DEFAULT_USER_REMOVE_FIELDS,
    });
  }

  async getUserById(
    userId: string,
    removeFields = DEFAULT_USER_REMOVE_FIELDS,
  ): Promise<User> {
    return this.getDocumentById(userId, undefined, {
      populate: DEFAULT_USER_POPULATE_FIELDS,
      removeFields,
    });
  }

  async getUserByLogin(login: string): Promise<User> {
    return this.getDocuments({
      buildQuery: {
        filters: [['login', '==', login]],
        limit: 1,
      },
      populate: DEFAULT_USER_POPULATE_FIELDS,
    }).then(([user]) => user);
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
      buildQuery: {
        filters: [
          Filter.or(
            Filter.where('login', '==', login),
            Filter.where('apartmentNumber', '==', apartmentNumber),
          ),
        ],
      },
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

    return this.addDoc(user, {
      removeFields: DEFAULT_USER_REMOVE_FIELDS,
      populate: DEFAULT_USER_POPULATE_FIELDS,
    });
  }

  async updateUser(
    userId: string,
    { roles, owners, vehicles }: UserUpdateDto,
  ): Promise<User> {
    const user = await this.getDocumentById(userId);

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

    return this.updateDoc(userId, {
      vehicles: vehicleIds,
      owners: ownerIds,
      roles,
    });
  }

  async changePassword(userId: string, newPassword: string) {
    return this.updateDoc(
      userId,
      {
        passwordHash: await this.createPasswordHash(newPassword),
      },
      {
        populate: DEFAULT_USER_POPULATE_FIELDS,
        removeFields: DEFAULT_USER_REMOVE_FIELDS,
      },
    );
  }

  async resetPassword(userId: string): Promise<User> {
    const user = await this.getUserById(userId);

    return this.updateDoc(
      userId,
      {
        passwordHash: await this.createPasswordHash(user.login),
      },
      {
        populate: DEFAULT_USER_POPULATE_FIELDS,
        removeFields: DEFAULT_USER_REMOVE_FIELDS,
      },
    );
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
}
