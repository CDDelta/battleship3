import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import {
  debounceTime,
  delay,
  map,
  Observable,
  shareReplay,
  Subject,
  switchMap,
  tap,
  throttleTime,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  provider: Web3Provider;

  signer$: Observable<JsonRpcSigner>;
  address$: Observable<string | undefined>;

  private accountsChange$ = new Subject();

  constructor(@Inject(DOCUMENT) document: Document) {
    const window = document.defaultView as any;
    this.provider = new Web3Provider(window.ethereum);

    this.signer$ = this.accountsChange$.pipe(
      map(() => this.provider.getSigner()),
      shareReplay(1),
    );
    this.address$ = this.signer$.pipe(
      switchMap((signer) => signer.getAddress().catch(() => undefined)),
      shareReplay(1),
    );

    setTimeout(() => this.accountsChange$.next(null), 500);

    window.ethereum.on('connect', () => this.accountsChange$.next(null));
    window.ethereum.on('disconnect', () => this.accountsChange$.next(null));
    window.ethereum.on('accountsChanged', () =>
      this.accountsChange$.next(null),
    );
  }

  async connect(): Promise<void> {
    await this.provider.send('eth_requestAccounts', []);
    this.accountsChange$.next(null);
  }
}
