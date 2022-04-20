import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Game, StartedGamesGQL } from 'src/graphql/generated';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss']
})
export class GamesListComponent implements OnInit {
  readonly startedGames$ = this.startedGamesGql.watch(undefined, {
    pollInterval: 60 * 1000
  }).valueChanges.pipe(map(({ data }) => data.games));

  constructor(private readonly startedGamesGql: StartedGamesGQL) {
  }

  ngOnInit(): void {
  }

}
