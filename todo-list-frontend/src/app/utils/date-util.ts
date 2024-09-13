import moment from 'moment';
import {Duration, Moment} from 'moment';

export class DateUtils {

  private constructor() {}

  static toDuration(value: Moment): Duration | undefined {
    return value ? moment.duration(moment().utc().diff(value)) : undefined;
  }

}
