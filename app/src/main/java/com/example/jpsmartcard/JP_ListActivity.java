package com.example.jpsmartcard;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import java.util.ArrayList;

public class JP_ListActivity extends AppCompatActivity {

    RecyclerView mRecyclerView = null;
    JP_RecyclerAdapter mAdapter = null;
    ArrayList<JP_RecyclerItem> mList = new ArrayList<JP_RecyclerItem>();
    JP_GSDB list_db_manager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_list);

        list_db_manager = MainActivity.db_manager;
        DBSearch(list_db_manager.getDb(), "INFO");

        mRecyclerView = findViewById(R.id.JP_Recycler);
        // 리사이클러뷰에 SimpleTextAdapter 객체 지정
        mAdapter = new JP_RecyclerAdapter(mList, getApplicationContext());
        mRecyclerView.setAdapter(mAdapter);
        // 리사이클러뷰에 LinearLayoutManage를 지정
        mRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        mAdapter.notifyDataSetChanged();
    }

    public void addItem(String oid, String name, String borough, String status) {
        JP_RecyclerItem item = new JP_RecyclerItem();

        item.setOid(oid);
        item.setName(name);
        item.setBorough(borough);
        item.setStatus(status);

        mList.add(item);
    }

    void DBSearch(SQLiteDatabase db, String tableName) {
        Cursor cursor = null;
        try {
            cursor = db.query(tableName, null, null, null, null, null, null);

            if (cursor != null) {
                while (cursor.moveToNext()) {
                    String _oid= cursor.getString(cursor.getColumnIndex("OID"));
                    String _orderer= cursor.getString(cursor.getColumnIndex("ORDERER"));
                    String _destination= cursor.getString(cursor.getColumnIndex("DESTINATION"));
                    String _status= cursor.getString(cursor.getColumnIndex("STATUS"));

                    Log.e("ORDERER", _oid);
                    Log.e("ORDERER", _orderer);
                    Log.e("DESTINATION", _destination);
                    Log.e("STATUS", _status);

                    addItem(_oid, _orderer, _destination, _status);
                }
            }
        } finally {
            if (cursor != null) {
                cursor.close();
            }
        }
    }
}