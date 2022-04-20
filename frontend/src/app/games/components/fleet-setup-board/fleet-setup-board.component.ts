import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fleet-setup-board',
  templateUrl: './fleet-setup-board.component.html',
  styleUrls: ['./fleet-setup-board.component.scss']
})
export class FleetSetupBoardComponent implements OnInit {
  columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor() { }

  ngOnInit(): void {
  }

}
