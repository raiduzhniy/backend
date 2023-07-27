export class DateUtils {
  static nowISODate(): string {
    const nowDate = new Date();

    return nowDate.toISOString();
  }
}
