import { NgClass, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

import { MatIconModule } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs';

import { ItemStatus } from './../model/item-status.enum';
import { ItemComponent } from '../item/item.component';
import { ItemService } from '../services/item.service';
import { Item } from '../model/item';

@Component({
  selector: 'app-item-board',
  standalone: true,
  imports: [NgFor, NgClass, MatToolbar, MatIconModule, ItemComponent],
  templateUrl: './item-board.component.html',
  styleUrl: './item-board.component.scss'
})
export class ItemBoardComponent implements OnInit {

  public itemStatus = ItemStatus;
  public statusItemsMap = new Map<string, Item[]>;
  public actionInProgress = false;
  public dragAndDropInProgress = false;

  private readonly _itemService = inject(ItemService);
  private readonly _changeDetector = inject(ChangeDetectorRef);
  private readonly _dialog = inject(MatDialog);

  ngOnInit(): void {
    this.refresh();
  }

  public refresh() {
    this.actionInProgress = true;

    //* Borrar todos los estados
    for (const status of this.getStatuses()) {
      this.statusItemsMap.set(status.key, []);
    }

    this._itemService.findAllItems()
      .pipe(
        finalize(() =>  this.stopActionInProgress())
      )
      .subscribe(item => {
        this.statusItemsMap.get(item.status)?.push(item);
      });
  }

  public getStatuses(): {key: string, value: ItemStatus}[] {
    return Object.keys(this.itemStatus)
        .map(key => ({ key, value: this.itemStatus[key as keyof typeof ItemStatus]}));
  }

  public stopActionInProgress() {
    this.actionInProgress = false;
    this._changeDetector.detectChanges();
  }

  public drop(event: CdkDragDrop<any, any>) {
  }

}
