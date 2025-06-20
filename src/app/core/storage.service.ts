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
  private _requested$ = new BehaviorSubject<any>([]);
  public requested$ = this._requested$.asObservable();

  async requestPersistentStorage() {
    if(navigator.storage && await navigator.storage.persist()) {
      const isPersisted = await navigator.storage.persisted();

      if(!isPersisted) {
        const granted = await navigator.storage.persist();
      }
    }
    else {
      console.warn('[Storage] Persistence API not supported.')
    }
  }

  async downloadDb(): Promise<any> {
    const db = await this.dbPromise;

    const exportData = {
      history: await db.getAll('history'),
      saved: await db.getAll('saved'),
      collection: await db.getAll('collection')
    };

    return exportData;
  }

  async uploadDb(jsonData: any) {
    const db = await this.dbPromise;
    const tx = db.transaction(['history','saved','collection'], 'readwrite');

    console.info('On UploadDb')
    console.log(jsonData)

    try {
      await Promise.all([
        ...jsonData.history.map((item: HistoryRequest) => tx.objectStore('history').put(item)),
        ...jsonData.collection.map((item: RequestCollection) => tx.objectStore('collection').put(item)),
        ...jsonData.saved.map((item: SavedRequest) => tx.objectStore('saved').put(item))
      ]);
  
      await tx.done;
      this.getHistory();
    } catch (err) {
      console.error(err)
    }
  }

  async addCollection(req: RequestCollection) {
    const db = await this.dbPromise;
    await db.add('collection', req);
    this.getCollection();
  }

  async getCollection() {
    const db = await this.dbPromise;
    const res = await db.getAllFromIndex('collection', 'by-createdAt');
    this._collection$.next(res);
  }

  async getAllCollection() {
    const db = await this.dbPromise;
    const collections = await db.getAllFromIndex('collection', 'by-createdAt');
    let res: any = [];
    for (const c of collections) {
      const requests = await db.getAllFromIndex('saved', 'by-collection', c.id);
      res.push({
        name: c.name,
        id: c.id,
        createdAt: c.createdAt,
        description: c.description,
        requests: requests
      });
    };

    this._requested$.next(res);
  }

  async addToCollection(req: SavedRequest) {
    const db = await this.dbPromise;
    await db.add('saved', req);
    this.getAllCollection();
  }

  async deleteRequest(id: number) {
    const db = await this.dbPromise;
    await db.delete('saved', id);
    this.getAllCollection();
  }

  async deleteCollection(id: string) {
    const db = await this.dbPromise;
    await db.delete('collection', id);
    this.getAllCollection();
  }

  // async getOneCollection(collectionId: string) {
  //   const db = await this.dbPromise;
  //   const collection = await db.get('collection', collectionId);
  //   const requests = await db.getAllFromIndex('saved', 'by-collection', collectionId);
  //   this._requested$.next({collection, requests});
  // }

  async addHistory(req: HistoryRequest) {
    const db = await this.dbPromise;
    await db.add('history', req);
    this.getHistory();
    const max = Number(localStorage.getItem('history'));
    this.cleanupHistory(!isNaN(max) && max > 0 ? max : 25);
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
