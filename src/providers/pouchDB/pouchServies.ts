import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable()
export class PouchDBService {

  private _db;
  private _jsonData;

  constructor(public http: HttpClient) {
    console.log('Hello PouchDbProvider Provider');
    this.initDB();
  }

  initDB() {
    this._db = new PouchDB('localAppDB',{revs_limit: 1, auto_compaction: true,location:'default'});
  }

  addJSON(json) {
    return this._db.post(json);
  }

  updateJSON(json) {
    return this._db.put(json);
  }

  deleteJSON(json) {
    return this._db.remove(json);
  }

  getObject(id) {
    if (id == "" || id == undefined) { } else {
      if (this._db) {
        return new Promise((resolve, reject) => {
          this._db.get(id).then(doc => {
            resolve(doc);
          }, err => {
            reject(err);
          })
        })
      }
    }
  }

  getAll() {
    if (!this._jsonData) {
      return this._db.allDocs({ include_docs: true })
        .then(docs => {
          this._jsonData = docs.rows.map(row => {
            row.doc.Date = new Date(row.doc.Date);
            return row.doc;
          });
          // Listen for changes on the database.
          this._db.changes({ live: true, since: 'now', include_docs: true })
            .on('change', this.onDatabaseChange);
          return this._jsonData;
        });
    } else {
      return Promise.resolve(this._jsonData);
    }
  }

  private onDatabaseChange = (change) => {
    var index = this.findIndex(this._jsonData, change.id);
    var localData = this._jsonData[index];
    if (change.deleted) {
      if (localData) {
        this._jsonData.splice(index, 1); // delete
      }
    } else {
      change.doc.Date = new Date(change.doc.Date);
      if (localData && localData._id === change.id) {
        this._jsonData[index] = change.doc; // update
      } else {
        this._jsonData.splice(index, 0, change.doc) // insert
      }
    }
  }

  // Binary search, the array is by default sorted by _id.
  private findIndex(array, id) {
    var low = 0, high = array.length, mid;
    while (low < high) {
      mid = (low + high) >>> 1;
      array[mid]._id < id ? low = mid + 1 : high = mid
    }
    return low;
  }

  public put(id: string, document: any) {
    document._id = id;
    return new Promise((resolve, reject) => {
      this._db.get(id).then(ress => {
        var result: any = ress;
        document._rev = result._rev;
        this._db.put(document);
        resolve(document);
      }, error => {
        if (error.status == "404") {
          this._db.put(document);
          resolve(document);
        } else {
          reject(error);
        }
      });

    })
  }

  public putData(id:string){
    this._db.get(id).then(doc=>{
      return this._db.put({
        _id: id,
        _rev: doc._rev
      });
    }).then(response=> {
    }).catch(err=> {
    });
  }

}
