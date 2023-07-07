import { FilterQuery, Model } from 'mongoose';

export abstract class IsExistingAbstract<T> {
  protected constructor(private model: Model<T>) {}

  protected async checkIsExist(filter: FilterQuery<T>): Promise<T> {
    return this.model.findOne(filter);
  }
}
