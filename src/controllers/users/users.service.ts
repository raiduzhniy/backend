import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Filter } from 'firebase-admin/firestore';
import { SuccessResponse } from '@shared/interfaces';
import { FirestoreBase } from '@shared/modules/firebase/firestore';
import { OwnersService } from '@shared/modules/owners';
import { VehiclesService } from '@shared/modules/vehicles';
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
    }).then((received) => received.elements[0]);
  }

  async createUser({
    roles,
    owners,
    apartmentNumber,
    login,
    password,
    vehicles,
    address,
  }: UserDto): Promise<User> {
    const existingUsers = await this.getDocuments({
      buildQuery: {
        filters: [
          Filter.or(
            Filter.where('login', '==', login),
            Filter.and(
              Filter.where('apartmentNumber', '==', apartmentNumber),
              Filter.where('address', '==', address),
            ),
          ),
        ],
      },
    });

    if (existingUsers.elements.length) {
      throw new BadRequestException(
        'Користувач з таким логіном або адресою вже існує',
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
      address,
      owners: ownerIds,
      vehicles: vehicleIds,
      passwordHash,
      confirmedUserAgreement: false,
      lastLogin: null,
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

  async updateLastLogin(userId: string): Promise<User> {
    return this.updateDoc(userId, { lastLogin: Date.now() });
  }

  async confirmUserAgreement(userId: string): Promise<SuccessResponse> {
    return this.updateDoc(userId, { confirmedUserAgreement: true })
      .then(() => ({ success: true }))
      .catch(() => ({ success: false }));
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
