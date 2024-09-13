import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { MomentHumanizePipe } from '../pipe/moment-humanize.pipe';
import { ItemService } from '../services/item.service';
import { Item } from '../model/item';
import { DateUtils } from '../utils/date-util';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [NgIf, NgClass, MatCardModule, MatIconModule, MomentHumanizePipe],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent {

  @Input() item!: Item;
  @Input() readonly = false;

  @Output() itemDeleted = new EventEmitter();
  @Output() itemUpdated = new EventEmitter();

  public displayMenu = false;
  public actionInProgress = false;

  private readonly _itemService = inject(ItemService);
  private readonly _dialog = inject(MatDialog);

  public hasBeenUpdateRecently(): boolean {
    return DateUtils.toDuration(this.item.lastModifiedDate)!.asSeconds() < 5;
  }

  public displayActionButtons() {
    return !this.readonly && this.displayMenu;
  }

  public edit(): void {

  }

  public delete(): void {

  }
}
