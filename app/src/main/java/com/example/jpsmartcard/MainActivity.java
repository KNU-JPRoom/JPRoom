package com.example.jpsmartcard;

import androidx.appcompat.app.AppCompatActivity;

import android.content.ContentValues;
import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import static android.content.ContentValues.TAG;

public class MainActivity extends AppCompatActivity {

    public static JP_GSDB db_manager;
    String userID;
    JP_DBHelper dbHelper;
    public static JP_Data jp_data;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        db_manager = new JP_GSDB();
        jp_data = new JP_Data();

        // SQLite 부분
        // 1. 데이터베이스 생성 혹은 만들어진 데이터베이스를 가져온다.
        dbHelper = new JP_DBHelper(MainActivity.this, "JP_DB.db", null, 1);
        SQLiteDatabase db = dbHelper.getWritableDatabase();
        // 2. DB GET / SET!
        db_manager.setDbHelper(dbHelper);
        db_manager.setDb(db);
        db_manager.getDbHelper().onCreate(db_manager.getDb());

        // 3. DB 삽입
        dbHelper.DBInsert(db, "USERINFO", "047154E2F36481");
        // 4. DB 검색
        DBSearch(db,"USERINFO");
    }

    public void btnClick(View view) {
        sendRequest();
    }

    public void sendRequest() {
        String url = "http://13.125.153.38:5000/RFID";
        StringRequest request = new StringRequest(
                Request.Method.POST,
                url,
                // 응답을 잘 받았을 때 이 메소드가 자동으로 호출
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        Log.e("현재 응답은 ", response);
                        JSON_Job(response);
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
                params.put("param", userID);
                return params;
            }
        };
        // 이전 결과가 있어도 새로 요청하여 응답을 보여줌
        request.setShouldCache(false);
        // Request Queue 초기화 필수
        AppHelper.requestQueue = Volley.newRequestQueue(this);
        AppHelper.requestQueue.add(request);

    }

    void JSON_Job(String response) {
        try {
            // 1차 JSON ARRAY 생성
            JSONObject JP_JSON = new JSONObject(response);
            JSONArray JP_ARRAY_INFO = (JSONArray) JP_JSON.get("info");

            for (int i=0; i<JP_ARRAY_INFO.length(); i++) {
                JSONObject tmp = (JSONObject) JP_ARRAY_INFO.get(i);
                // SQLite에 저장
                dbHelper.DBInsert(db_manager.getDb(), "INFO", String.valueOf(tmp.get("oid")), (String) tmp.get("orderer"), (String) tmp.get("destination"), (String) tmp.get("status"));
                // 2차 JSON ARRAY 생성
                JSONArray JP_ARRAY_ORDERINFO = (JSONArray) tmp.get("orderinfo");
                jp_data.setOID(String.valueOf(tmp.get("oid")));

                for(int j=0; j<JP_ARRAY_ORDERINFO.length(); j++) {
                    JSONObject tmp2 = (JSONObject) JP_ARRAY_ORDERINFO.get(j);
                    // SQLite에 저장 - OID 값으로 저장
                    dbHelper.DBInsert(db_manager.getDb(), "PARTINFO", String.valueOf(tmp.get("oid")), (String) tmp2.get("partname"), String.valueOf(tmp2.get("cnt")));
                }
            }
            Intent intent = new Intent(getApplicationContext(), JP_ListActivity.class);
            startActivity(intent);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    void DBSearch(SQLiteDatabase db, String tableName) {
        Cursor cursor = null;
        try {
            cursor = db.query(tableName, null, null, null, null, null, null);
            if (cursor != null) {
                while (cursor.moveToNext()) {
                    userID = cursor.getString(cursor.getColumnIndex("USER_ID"));
                }
            }
        } finally {
            if (cursor != null) {
                cursor.close();
            }
        }
    }


}