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

public class JP_RecyclerAdapter extends RecyclerView.Adapter<JP_RecyclerAdapter.ViewHolder> {
    private ArrayList<JP_RecyclerItem> mData = null ;
    private Context context;
    private JP_DetailActivity detailActivity;

    // 생성자를 통해 데이터 리스트 객체를 전달받음
    JP_RecyclerAdapter(ArrayList<JP_RecyclerItem> list, Context context) {
        mData = list;
        this.context = context;
    }

    // 아이템 뷰를 위한 뷰홀더 클래스 생성
    @NonNull
    @Override
    public JP_RecyclerAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        Context context = parent.getContext() ;
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) ;

        View view = inflater.inflate(R.layout.recycler_item, parent, false) ;
        JP_RecyclerAdapter.ViewHolder vh = new JP_RecyclerAdapter.ViewHolder(view) ;

        return vh ;
    }

    @Override
    public void onBindViewHolder(@NonNull JP_RecyclerAdapter.ViewHolder holder, int position) {
        JP_RecyclerItem item = mData.get(position);

        holder.name.setText(item.getName());
        holder.borough.setText(item.getBorough());
        holder.status.setText(item.getStatus());
    }

    @Override
    public int getItemCount() {
        return mData.size();
    }

    // 아이템 뷰를 저장하는 뷰홀더 클래스.
    public class ViewHolder extends RecyclerView.ViewHolder {
        TextView name ;
        TextView borough ;
        TextView status ;

        ViewHolder(View itemView) {
            super(itemView) ;

            // 뷰 객체에 대한 참조.
            name = itemView.findViewById(R.id.Text_Name) ;
            borough = itemView.findViewById(R.id.Text_Borough) ;
            status = itemView.findViewById(R.id.Text_Status);

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    int pos = getAdapterPosition() ;
                    Toast.makeText(context, "" + mData.get(pos).getName() , Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(v.getContext(), JP_DetailActivity.class);
                    intent.putExtra("Oid", mData.get(pos).getOid());
                    intent.putExtra("Name", mData.get(pos).getName());
                    intent.putExtra("Borough", mData.get(pos).getBorough());
                    intent.putExtra("Status", mData.get(pos).getStatus());
                    v.getContext().startActivity(intent);
                }
            });
        }
    }
}
