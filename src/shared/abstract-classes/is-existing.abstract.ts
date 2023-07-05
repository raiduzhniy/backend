import { FilterQuery, InferId, Model } from 'mongoose';

export abstract class IsExistingAbstract<T> {
  protected constructor(private model: Model<T>) {}

  protected async checkIsExist(
    filter: FilterQuery<T>,
  ): Promise<{ _id: InferId<T> }> {
    return this.model.exists(filter);
  }
}
