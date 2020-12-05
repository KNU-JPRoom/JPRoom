package com.example.jpsmartcard;

import android.database.sqlite.SQLiteDatabase;

public class JP_GSDB {
    public JP_DBHelper dbHelper;
    public SQLiteDatabase db;

    public JP_DBHelper getDbHelper() {
        return dbHelper;
    }

    public void setDbHelper(JP_DBHelper dbHelper) {
        this.dbHelper = dbHelper;
    }

    public SQLiteDatabase getDb() {
        return db;
    }

    public void setDb(SQLiteDatabase db) {
        this.db = db;
    }
}
