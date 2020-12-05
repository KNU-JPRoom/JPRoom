package com.example.jpsmartcard;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class JP_RecyclerAdapter2 extends RecyclerView.Adapter<JP_RecyclerAdapter2.ViewHolder> {
    private ArrayList<JP_RecyclerItem2> mData = null ;
    private Context context;

    // 생성자를 통해 데이터 리스트 객체를 전달받음
    JP_RecyclerAdapter2(ArrayList<JP_RecyclerItem2> list, Context context) {
        mData = list;
        this.context = context;
    }

    // 아이템 뷰를 위한 뷰홀더 클래스 생성
    @NonNull
    @Override
    public JP_RecyclerAdapter2.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        Context context = parent.getContext() ;
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) ;

        View view = inflater.inflate(R.layout.recycler_item2, parent, false) ;
        JP_RecyclerAdapter2.ViewHolder vh = new JP_RecyclerAdapter2.ViewHolder(view) ;

        return vh ;
    }

    @Override
    public void onBindViewHolder(@NonNull JP_RecyclerAdapter2.ViewHolder holder, int position) {
        JP_RecyclerItem2 item = mData.get(position);

        holder.partname.setText(item.getPartName());
        holder.partcnt.setText(item.getPartCnt());
    }

    @Override
    public int getItemCount() {
        return mData.size();
    }

    // 아이템 뷰를 저장하는 뷰홀더 클래스.
    public class ViewHolder extends RecyclerView.ViewHolder {
        TextView partname ;
        TextView partcnt ;

        ViewHolder(View itemView) {
            super(itemView) ;

            // 뷰 객체에 대한 참조.
            partname = itemView.findViewById(R.id.Text_PartName) ;
            partcnt = itemView.findViewById(R.id.Text_PartCnt) ;
        }
    }
}
