import { DBSchema } from "idb";

export interface AppDB extends DBSchema {
    history: {
        key: number;
        value: HistoryRequest;
        indexes: { 'by-createdAt': number };
    };
    collection: {
        key: string;
        value: RequestCollection;
        indexes: { 'by-createdAt': number };
    };
    saved: {
        key: number;
        value: SavedRequest;
        indexes: { 
            'by-createdAt': number;
            'by-collection': string;
            'by-name': string;
        };
    };
}

export interface HistoryRequest {
    id?: number;
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: string;
    createdAt: number;
}

export interface RequestCollection {
    id: string;
    name: string;
    description?: string;
    createdAt: number;
}

export interface SavedRequest {
    id?: number;
    name: string;
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: string;
    createdAt: number;
    collectionId?: string;
}
