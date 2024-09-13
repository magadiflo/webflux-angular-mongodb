import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ItemBoardComponent } from "./item-board/item-board.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ItemBoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
