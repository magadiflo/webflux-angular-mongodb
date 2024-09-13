import { Pipe, PipeTransform } from '@angular/core';
import { Moment } from 'moment';
import { DateUtils } from '../utils/date-util';

@Pipe({
  name: 'momentHumanize',
  standalone: true
})
export class MomentHumanizePipe implements PipeTransform {

  transform(value: Moment): string | undefined {
    return value ? DateUtils.toDuration(value)?.humanize() : undefined;
  }

}
