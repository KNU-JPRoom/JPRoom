package com.example.jpsmartcard;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import androidx.annotation.Nullable;

public class JP_DBHelper extends SQLiteOpenHelper {

    // ID 검색 테이블
    private static final String ID_TABLE_NAME = "USERINFO";
    private static final String ID_COLUMN_ID = "USER_ID";

    // 1차 JSON 검색 테이블
    private static final String INFO_TABLE_NAME = "INFO";
    private static final String INFO_COLUMN_OID = "OID";
    private static final String INFO_COLUMN_ORDERER = "ORDERER";
    private static final String INFO_COLUMN_DESTINATION = "DESTINATION";
    private static final String INFO_COLUMN_STATUS = "STATUS";

    // 2차 JSON 검색 테이블
    private static final String PART_TABLE_NAME = "PARTINFO";
    private static final String PART_COLUMN_OID = "OID";
    private static final String PART_COLUMN_PARTNAME = "PARTNAME";
    private static final String PART_COLUMN_CNT = "CNT";

    public JP_DBHelper(MainActivity context, String name, SQLiteDatabase.CursorFactory factory, int version) {
        super(context, name, factory, version);
    }

    private static final String CREATE_TABLE_ID = "CREATE TABLE if not exists " +
            ID_TABLE_NAME +
            " ( ID INTEGER PRIMARY KEY AUTOINCREMENT," +
            ID_COLUMN_ID + " TEXT)";

    private static final String CREATE_TABLE_INFO = "CREATE TABLE if not exists " +
            INFO_TABLE_NAME +
            " ( ID INTEGER PRIMARY KEY AUTOINCREMENT," +
            INFO_COLUMN_OID + " TEXT," +
            INFO_COLUMN_ORDERER + " TEXT," +
            INFO_COLUMN_DESTINATION + " TEXT," +
            INFO_COLUMN_STATUS + " TEXT)";

    private static final String CREATE_TABLE_PARTINFO = "CREATE TABLE if not exists " +
            PART_TABLE_NAME +
            " ( ID INTEGER PRIMARY KEY AUTOINCREMENT," +
            PART_COLUMN_OID + " TEXT," +
            PART_COLUMN_PARTNAME + " TEXT," +
            PART_COLUMN_CNT + " TEXT)";



    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL(CREATE_TABLE_ID);
        db.execSQL(CREATE_TABLE_INFO);
        db.execSQL(CREATE_TABLE_PARTINFO);

    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + ID_TABLE_NAME);
        db.execSQL("DROP TABLE IF EXISTS " + INFO_TABLE_NAME);
        db.execSQL("DROP TABLE IF EXISTS " + PART_TABLE_NAME);
        onCreate(db);
    }

    // 아이디 접속
    void DBInsert(SQLiteDatabase db, String tableName, String _id) {
        ContentValues contentValues = new ContentValues();
        contentValues.put("USER_ID", _id);

        // 리턴값: 생성된 데이터의 id
        long id = db.insert(tableName, null, contentValues);
    }

    // 1차 JSON 저장
    void DBInsert(SQLiteDatabase db, String tableName, String oid, String orderer, String destination, String status) {

        Cursor c = db.rawQuery("SELECT * FROM " + tableName + " WHERE oid = '" + oid + "'", null);
        c.moveToFirst();
        if (c.getCount() == 0) {
            ContentValues contentValues = new ContentValues();
            contentValues.put("OID", oid);
            contentValues.put("ORDERER", orderer);
            contentValues.put("DESTINATION", destination);
            contentValues.put("STATUS", status);

            // 리턴값: 생성된 데이터의 id
            db.insertWithOnConflict(tableName, null, contentValues, SQLiteDatabase.CONFLICT_REPLACE);

        }
    }

    // 2차 JSON 저장
    void DBInsert(SQLiteDatabase db, String tableName, String oid, String partname, String cnt) {

        Cursor c = db.rawQuery("SELECT * FROM " + tableName + " WHERE partname = '" + partname + "'", null);
        c.moveToFirst();
        if (c.getCount() == 0) {
            ContentValues contentValues = new ContentValues();
            contentValues.put("OID", oid);
            contentValues.put("PARTNAME", partname);
            contentValues.put("CNT", cnt);

            // 리턴값: 생성된 데이터의 id
            db.insertWithOnConflict(tableName, null, contentValues, SQLiteDatabase.CONFLICT_REPLACE);
        }
    }
}
