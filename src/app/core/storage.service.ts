import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { AppDB, HistoryRequest, RequestCollection, SavedRequest,  } from './storage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private dbPromise: Promise<IDBPDatabase<AppDB>>;

  constructor() {
    this.dbPromise = this.initDb();
  }

  private async initDb(): Promise<IDBPDatabase<AppDB>> {
    return openDB<AppDB>('httpotamus-db', 1, {
      upgrade(db) {
        if(!db.objectStoreNames.contains('history')) {
          const store = db.createObjectStore('history', { keyPath: 'id', autoIncrement: true});
          store.createIndex('by-createdAt', 'createdAt');
        }

        if(!db.objectStoreNames.contains('collection')) {
          const store = db.createObjectStore('collection', { keyPath: 'id' });
          store.createIndex('by-createdAt', 'createdAt');
        }

        if(!db.objectStoreNames.contains('saved')) {
          const store = db.createObjectStore('saved', { keyPath: 'id', autoIncrement: true });
          store.createIndex('by-createdAt', 'createdAt');
          store.createIndex('by-collection', 'collectionId');
          store.createIndex('by-name', 'name');
        }
      }
    })
  }

  private _history$ = new BehaviorSubject<HistoryRequest[]>([]);
  public history$ = this._history$.asObservable();
  private _collection$ = new BehaviorSubject<RequestCollection[]>([]);
  public collection$ = this._collection$.asObservable();
  private _saved$ = new BehaviorSubject<SavedRequest[]>([]);
  public saved$ = this._saved$.asObservable();

  async downloadDb(): Promise<any> {
    const db = await this.dbPromise;

    const exportData = {
      history: await db.getAll('history'),
      saved: await db.getAll('saved'),
      collection: await db.getAll('collection')
    };

    return exportData;
  }

  async uploadDb() {
    // TODO
  }

  async addHistory(req: HistoryRequest) {
    const db = await this.dbPromise;
    await db.add('history', req);
    this.getHistory();
    this.cleanupHistory(<number>(localStorage.getItem('history') as any));
  }

  async getHistory() {
    const db = await this.dbPromise;
    const res = await db.getAllFromIndex('history', 'by-createdAt');
    this._history$.next(res);
  }

  async deleteHistory(id: number): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('history', id);
    this.getHistory();
  }

  async clearHistory() {
    const db = await this.dbPromise;
    await db.clear('history');
    this.getHistory();
  }

  async cleanupHistory(maxItems: number = 25) {
    const db = await this.dbPromise;
    const allItems = await db.getAllFromIndex('history', 'by-createdAt');

    const sorted = allItems.sort((a, b) => { return b.createdAt - a.createdAt });

    const toKeep = sorted.slice(0, maxItems);
    const toDelete = sorted.slice(maxItems);

    const tx = db.transaction('history', 'readwrite');
    toDelete.forEach(item => {
      if(item.id !== undefined) {
        tx.store.delete(item.id);
      }
    });

    await tx.done;
  }
}
