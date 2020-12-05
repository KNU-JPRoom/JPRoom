package com.example.jpsmartcard;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class JP_DetailActivity extends AppCompatActivity {

    private String Oid;
    private String Name;
    private String Borough;
    private String Status;

    TextView JP_DetailName;
    TextView JP_DetailBorough;
    TextView JP_DetailStatus;

    RecyclerView mRecyclerView = null;
    JP_RecyclerAdapter2 mAdapter = null;
    ArrayList<JP_RecyclerItem2> mList = new ArrayList<>();

    JP_Data jp_data;
    JP_GSDB part_db_manager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_jpdetail);

        jp_data = MainActivity.jp_data;

        // 2차 리사이클러뷰
        mRecyclerView = findViewById(R.id.JP_Recycler2);
        // 리사이클러뷰에 SimpleTextAdapter 객체 지정
        mAdapter = new JP_RecyclerAdapter2(mList, getApplicationContext());
        mRecyclerView.setAdapter(mAdapter);

        // 리사이클러뷰에 LinearLayoutManage를 지정
        mRecyclerView.setLayoutManager(new LinearLayoutManager(this));

        part_db_manager = MainActivity.db_manager;

        Button newButton = (Button) findViewById(R.id.completeButton);
        newButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendComplete();
            }
        });

        JP_DetailName = findViewById(R.id.JP_DetailName);
        JP_DetailBorough = findViewById(R.id.JP_DetailBorough);
        JP_DetailStatus = findViewById(R.id.JP_DetailStatus);

        Intent secondIntent = getIntent();
        Oid = secondIntent.getStringExtra("Oid");
        Name = secondIntent.getStringExtra("Name");
        Borough = secondIntent.getStringExtra("Borough");
        Status = secondIntent.getStringExtra("Status");

        Log.e("OID는 ", Oid);

        JP_DetailName.setText(Name);
        JP_DetailBorough.setText(Borough);
        JP_DetailStatus.setText(Status);

        DBSearch(part_db_manager.getDb(), "PARTINFO", Oid);
    }

    public void sendComplete() {
        String url = "http://13.125.153.38:5000/RFID/Update";
        StringRequest request = new StringRequest(
                Request.Method.POST,
                url,
                // 응답을 잘 받았을 때 이 메소드가 자동으로 호출
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        dbDelete("INFO", Oid);
                        dbDelete("PARTINFO", Oid);

                        Intent intent = new Intent(getApplicationContext(), JP_ListActivity.class);
                        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                        startActivity(intent);

                        Log.e("2번째 결과 값", response);
                    }
                },
                // 에러 발생시 호출될 리스너 객체
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.e("에러 발생! 원인은 ", error.getMessage());
                    }
                }
        ) {
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                Map<String, String> params = new HashMap<String, String>();
                params.put("oid", Oid);
                return params;
            }
        };
        // 이전 결과가 있어도 새로 요청하여 응답을 보여줌
        request.setShouldCache(false);
        // Request Queue 초기화 필수
        AppHelper.requestQueue = Volley.newRequestQueue(this);
        AppHelper.requestQueue.add(request);
    }

    public void addItem(String partname, String partcnt) {
        JP_RecyclerItem2 item = new JP_RecyclerItem2();

        item.setPartName(partname);
        item.setPartCnt(partcnt);

        mList.add(item);
    }

    void DBSearch(SQLiteDatabase db, String tableName, String _OID) {
        Cursor cursor = null;
        try {
            cursor = db.rawQuery("SELECT * FROM " + tableName + " WHERE OID = " + _OID, null);
            if (cursor != null) {
                while (cursor.moveToNext()) {
                    String partname= cursor.getString(cursor.getColumnIndex("PARTNAME"));
                    String partcnt= cursor.getString(cursor.getColumnIndex("CNT"));

                    addItem(partname, partcnt);
                    mAdapter.notifyDataSetChanged();
                }
            }
        } finally {
            if (cursor != null) {
                cursor.close();
            }
        }
    }

    void dbDelete(String tableName, String name) {
        String nameArr[] = {name};

        // 리턴값: 삭제한 수
        int n = part_db_manager.getDb().delete(tableName, "OID = ?", nameArr);

        Log.d("TAG", "n: " + n);
    }
}